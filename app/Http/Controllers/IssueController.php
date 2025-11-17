<?php

namespace App\Http\Controllers;

use App\Helpers\GeneralHelper;
use App\Models\Issue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class IssueController extends Controller
{
    public function index(): Response
    {
        return inertia('issues/index');
    }

    public function data(Request $request): JsonResponse
    {
        $startAt = $request->query('startAt', 0);
        $maxResults = $request->query('maxResults', 10);
        $search = $request->input('query', null);
        $hasMethod = $request->input('has_method', 'true');

        // Get filter parameters and ensure they are arrays
        $filters = [
            'project' => GeneralHelper::EnsureArray($request->query('project', [])),
            'issueType' => GeneralHelper::EnsureArray($request->query('issueType', [])),
            'priority' => GeneralHelper::EnsureArray($request->query('priority', [])),
            'status' => GeneralHelper::EnsureArray($request->query('status', [])),
            'reporter' => GeneralHelper::EnsureArray($request->query('reporter', [])),
        ];

        // Build query
        $query = Issue::with([
            'project',
            'issueType',
            'priority',
            'status.statusCategory',
            'reporter',
            'libraries',
        ]);

        // Apply filters
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                    ->orWhere('summary', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('components', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['project'])) {
            $query->whereHas('project', function ($q) use ($filters) {
                $q->whereIn('name', $filters['project']);
            });
        }

        if (! empty($filters['issueType'])) {
            $query->whereHas('issueType', function ($q) use ($filters) {
                $q->whereIn('name', $filters['issueType']);
            });
        }

        if (! empty($filters['priority'])) {
            $query->whereHas('priority', function ($q) use ($filters) {
                $q->whereIn('name', $filters['priority']);
            });
        }

        if (! empty($filters['status'])) {
            $query->whereHas('status', function ($q) use ($filters) {
                $q->whereIn('name', $filters['status']);
            });
        }

        if (! empty($filters['reporter'])) {
            $query->whereHas('reporter', function ($q) use ($filters) {
                $q->whereIn('key', $filters['reporter']);
            });
        }

        if ($hasMethod === 'true') {
            $query->whereHas('libraries', function ($q) {
                $q->whereNotNull('name')->where('name', '!=', '');
            });
        }

        // Get total count
        $total = $query->count();

        // Get paginated results
        $issues = $query->skip($startAt)
            ->take($maxResults)
            ->get();

        // Format response to match Apache JIRA format
        $formattedIssues = $issues->map(function ($issue) {
            return [
                'expand' => 'operations,versionedRepresentations,editmeta,changelog,renderedFields',
                'id' => (string) $issue->ref_id,
                'self' => $issue->url,
                'key' => $issue->key,
                'fields' => [
                    'summary' => $issue->summary,
                    'issuetype' => $issue->issueType ? [
                        'self' => null,
                        'id' => (string) $issue->issueType->ref_id,
                        'description' => $issue->issueType->description,
                        'iconUrl' => $issue->issueType->icon_url,
                        'name' => $issue->issueType->name,
                        'subtask' => false,
                        'avatarId' => null,
                    ] : null,
                    'components' => $issue->components
                        ? collect(explode(',', $issue->components))
                            ->map(fn ($name) => trim($name))
                            ->filter()
                            ->map(fn ($name) => [
                                'self' => null,
                                'id' => null,
                                'name' => $name,
                                'description' => null,
                            ])
                            ->values()
                            ->toArray()
                        : [],
                    'created' => $issue->created,
                    'description' => $issue->description,
                    'project' => $issue->project ? [
                        'self' => null,
                        'id' => (string) $issue->project->ref_id,
                        'key' => $issue->project->key,
                        'name' => $issue->project->name,
                        'projectTypeKey' => 'software',
                        'avatarUrls' => [
                            '48x48' => $issue->project->avatar,
                            '24x24' => $issue->project->avatar,
                            '16x16' => $issue->project->avatar,
                            '32x32' => $issue->project->avatar,
                        ],
                    ] : null,
                    'reporter' => $issue->reporter ? [
                        'self' => null,
                        'name' => $issue->reporter->name,
                        'key' => $issue->reporter->key,
                        'avatarUrls' => [
                            '48x48' => $issue->reporter->avatar,
                            '24x24' => $issue->reporter->avatar,
                            '16x16' => $issue->reporter->avatar,
                            '32x32' => $issue->reporter->avatar,
                        ],
                        'displayName' => $issue->reporter->display_name,
                        'active' => $issue->reporter->active,
                        'timeZone' => $issue->reporter->time_zone,
                    ] : null,
                    'priority' => $issue->priority ? [
                        'self' => null,
                        'iconUrl' => $issue->priority->icon_url,
                        'name' => $issue->priority->name,
                        'id' => (string) $issue->priority->ref_id,
                    ] : null,
                    'status' => $issue->status ? [
                        'self' => null,
                        'description' => $issue->status->description,
                        'iconUrl' => $issue->status->icon_url,
                        'name' => $issue->status->name,
                        'id' => (string) $issue->status->ref_id,
                        'statusCategory' => $issue->status->statusCategory ? [
                            'self' => null,
                            'id' => $issue->status->statusCategory->ref_id,
                            'key' => $issue->status->statusCategory->key,
                            'colorName' => $issue->status->statusCategory->color_name,
                            'name' => $issue->status->statusCategory->name,
                        ] : null,
                    ] : null,
                ],
                'libraries' => $issue->libraries->map(function ($library) {
                    return [
                        'name' => $library->name,
                        'url' => $library->url,
                        'description' => $library->description,
                    ];
                })->toArray(),
            ];
        });

        $response = [
            'expand' => 'schema,names',
            'startAt' => $startAt,
            'maxResults' => $maxResults,
            'total' => $total,
            'issues' => $formattedIssues,
        ];

        return response()->json($response, 200);
    }

    public function key($key): Response
    {
        $record = Issue::with([
            'project',
            'issueType',
            'priority',
            'status.statusCategory',
            'reporter',
            'libraries',
        ])->where('key', $key)->firstOrFail();

        return inertia('issues/detail', [
            'record' => $record,
            'graph' => $record->graph,
        ]);
    }
}
