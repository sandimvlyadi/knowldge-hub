<?php

namespace App\Http\Controllers;

use App\Helpers\GeneralHelper;
use App\Http\Requests\Feature\StoreFeatureRequest;
use App\Http\Requests\Feature\UpdateFeatureRequest;
use App\Models\Feature;
use App\Models\Issue;
use App\Models\Library;
use HelgeSverre\Chromadb\Embeddings\Embeddings;
use HelgeSverre\Chromadb\Facades\Chromadb;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class FeatureController extends Controller
{
    public function index(): Response
    {
        return inertia('features/index');
    }

    public function data(Request $request): JsonResponse
    {
        $startAt = $request->query('startAt', 0);
        $maxResults = $request->query('maxResults', 10);
        $search = $request->input('query', null);
        $hasMethod = $request->input('has_method', 'false');

        // Get filter parameters and ensure they are arrays
        $filters = [
            'project' => GeneralHelper::EnsureArray($request->query('project', [])),
            'issueType' => GeneralHelper::EnsureArray($request->query('issueType', [])),
            'priority' => GeneralHelper::EnsureArray($request->query('priority', [])),
            'status' => GeneralHelper::EnsureArray($request->query('status', [])),
            'reporter' => GeneralHelper::EnsureArray($request->query('reporter', [])),
        ];

        // Build query
        $query = Feature::with([
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
        $features = $query->skip($startAt)
            ->take($maxResults)
            ->get();

        // Format response to match Apache JIRA format
        $formattedFeatures = $features->map(function ($feature) {
            return [
                'expand' => 'operations,versionedRepresentations,editmeta,changelog,renderedFields',
                'id' => (string) $feature->id,
                'key' => $feature->key,
                'fields' => [
                    'summary' => $feature->summary,
                    'issuetype' => $feature->issueType ? [
                        'self' => null,
                        'id' => (string) $feature->issueType->ref_id,
                        'description' => $feature->issueType->description,
                        'iconUrl' => $feature->issueType->icon_url,
                        'name' => $feature->issueType->name,
                        'subtask' => false,
                        'avatarId' => null,
                    ] : null,
                    'components' => $feature->components
                        ? collect(explode(',', $feature->components))
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
                    'created_at' => $feature->created_at,
                    'description' => $feature->description,
                    'project' => $feature->project ? [
                        'self' => null,
                        'id' => (string) $feature->project->ref_id,
                        'key' => $feature->project->key,
                        'name' => $feature->project->name,
                        'projectTypeKey' => 'software',
                        'avatarUrls' => [
                            '48x48' => $feature->project->avatar,
                            '24x24' => $feature->project->avatar,
                            '16x16' => $feature->project->avatar,
                            '32x32' => $feature->project->avatar,
                        ],
                    ] : null,
                    'reporter' => $feature->reporter ? [
                        'self' => null,
                        'name' => $feature->reporter->name,
                        'key' => $feature->reporter->key,
                        'avatarUrls' => [
                            '48x48' => $feature->reporter->avatar,
                            '24x24' => $feature->reporter->avatar,
                            '16x16' => $feature->reporter->avatar,
                            '32x32' => $feature->reporter->avatar,
                        ],
                        'displayName' => $feature->reporter->display_name,
                        'active' => $feature->reporter->active,
                        'timeZone' => $feature->reporter->time_zone,
                    ] : null,
                    'priority' => $feature->priority ? [
                        'self' => null,
                        'iconUrl' => $feature->priority->icon_url,
                        'name' => $feature->priority->name,
                        'id' => (string) $feature->priority->ref_id,
                    ] : null,
                    'status' => $feature->status ? [
                        'self' => null,
                        'description' => $feature->status->description,
                        'iconUrl' => $feature->status->icon_url,
                        'name' => $feature->status->name,
                        'id' => (string) $feature->status->ref_id,
                        'statusCategory' => $feature->status->statusCategory ? [
                            'self' => null,
                            'id' => $feature->status->statusCategory->ref_id,
                            'key' => $feature->status->statusCategory->key,
                            'colorName' => $feature->status->statusCategory->color_name,
                            'name' => $feature->status->statusCategory->name,
                        ] : null,
                    ] : null,
                ],
                'libraries' => $feature->libraries->map(function ($library) {
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
            'features' => $formattedFeatures,
        ];

        return response()->json($response, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFeatureRequest $request): JsonResponse
    {
        // Check if there's a soft-deleted record with same key
        $existingByKey = Feature::withTrashed()->where('key', $request->key)->first();

        // If soft-deleted record exists, restore and update it
        if ($existingByKey && $existingByKey->trashed()) {
            $existingByKey->restore();
            $existingByKey->deleted_by = null; // Reset deleted_by
            $existingByKey->update($request->validated());

            return response()->json($existingByKey, 200);
        }

        // Otherwise create new record
        $record = Feature::create($request->validated());

        return response()->json($record, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFeatureRequest $request, Feature $record): JsonResponse
    {
        $record->update($request->validated());

        return response()->json($record, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feature $record)
    {
        $record->delete();

        return response()->json(null, 204);
    }

    public function option(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', null);

        $data = Feature::when($search, function ($q) use ($search) {
            $q->where('key', 'like', "%{$search}%")
                ->orWhere('summary', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }

    public function key($key): Response
    {
        $record = Feature::with([
            'project',
            'issueType',
            'priority',
            'status.statusCategory',
            'reporter',
            'libraries',
        ])->where('key', $key)->firstOrFail();

        return inertia('features/detail', [
            'record' => $record,
            'graph' => $record->graph,
        ]);
    }

    public function allGraphs(Request $request): JsonResponse
    {
        $startAt = $request->query('startAt', 0);
        $maxResults = $request->query('maxResults', 10);

        $features = Feature::select([
            'id',
            'key',
            'summary',
            'description',
            'components',
            'ref_project_id',
            'ref_issue_type_id',
            'ref_priority_id',
            'ref_status_id',
            'ref_reporter_key',
        ])
            ->with([
                'project:ref_id,name',
                'issueType:ref_id,name',
                'priority:ref_id,name',
                'status:ref_id,name',
                'reporter:key,display_name',
                'libraries:name',
            ])
            ->whereHas('libraries')
            ->skip($startAt)
            ->take($maxResults)
            ->get();

        $allGraphs = $features->map(function ($feature) {
            return [
                'key' => $feature->key,
                'summary' => $feature->summary,
                'description' => $feature->description,
                'components' => $feature->components ? explode(',', $feature->components) : [],
                'project' => $feature->project?->name,
                'issuetype' => $feature->issueType?->name,
                'priority' => $feature->priority?->name,
                'status' => $feature->status?->name,
                'reporter' => $feature->reporter?->display_name,
                'methods' => $feature->libraries->pluck('name')->toArray(),
            ];
        });

        return response()->json($allGraphs, 200);
    }

    public function generateKey(): JsonResponse
    {
        $lastFeature = Feature::withTrashed()->latest('id')->first();
        $nextId = $lastFeature ? $lastFeature->id + 1 : 1;

        do {
            $key = 'FEAT-'.$nextId++;
        } while (Feature::withTrashed()->where('key', $key)->exists());

        return response()->json(['key' => $key], 200);
    }

    public function suggestion($key): JsonResponse
    {
        $record = Feature::with([
            'project',
            'issueType',
            'priority',
            'status.statusCategory',
            'reporter',
            'libraries',
        ])->where('key', $key)->firstOrFail();

        $embedder = Embeddings::fromConfig();
        $chromadb = Chromadb::client()->withEmbeddings(embeddingFunction: $embedder);
        $collection = $chromadb->collections()->get(collectionName: 'issues_collection');

        if ($collection->failed()) {
            return response()->json($collection->json(), 500);
        }

        $collectionId = $collection->json('id');
        $description = "{$record->summary}. ".($record->description ?? '');
        $description = trim($description);

        $res = $chromadb->items()->queryWithText(
            collectionId: $collectionId,
            queryText: $description,
            embeddingFunction: $embedder,
            nResults: 10,
            include: ['documents', 'metadatas', 'distances'],
            where: [
                'project' => $record->project?->ref_id,
            ]
        );

        if ($res->failed()) {
            return response()->json($res->json(), 500);
        }

        $distance_threshold = 1.0;
        $json = $res->json();
        $ids = $json['ids'][0];
        $distances = $json['distances'][0];

        $selected = [];
        foreach ($ids as $index => $id) {
            if ($distances[$index] > $distance_threshold) {
                continue;
            }

            $selected[] = [
                'id' => $id,
                'distance' => $distances[$index],
            ];
        }

        $issues = Issue::select([
            'id',
            'key',
            'summary',
            'description',
            'components',
            'ref_project_id',
            'ref_issue_type_id',
            'ref_priority_id',
            'ref_status_id',
            'ref_reporter_key',
        ])
            ->with([
                'project:ref_id,name',
                'issueType:ref_id,name',
                'priority:ref_id,name',
                'status:ref_id,name',
                'reporter:key,display_name',
                'libraries:name',
            ])
            ->whereIn('key', collect($selected)->pluck('id')->toArray())
            ->get();

        $suggestionGraphs = $issues->map(function ($issue) use ($selected) {
            return [
                'key' => $issue->key,
                'summary' => $issue->summary,
                'description' => $issue->description,
                'components' => $issue->components ? explode(',', $issue->components) : [],
                'project' => $issue->project?->name,
                'issuetype' => $issue->issueType?->name,
                'priority' => $issue->priority?->name,
                'status' => $issue->status?->name,
                'reporter' => $issue->reporter?->display_name,
                'methods' => $issue->libraries->pluck('name')->toArray(),
                'distance' => collect($selected)->firstWhere('id', $issue->key)['distance'] ?? null,
            ];
        });

        $suggestionGraphs = $suggestionGraphs->sortBy('distance')->values();

        $libraries = $suggestionGraphs
            ->pluck('methods')
            ->flatten()
            ->unique()
            ->map(function ($methodName) use ($suggestionGraphs) {
                $library = Library::where('name', $methodName)->first();

                // Find minimum distance for this method across all suggestions
                $minDistance = $suggestionGraphs
                    ->filter(fn ($s) => in_array($methodName, $s['methods']))
                    ->min('distance');

                return array_merge(
                    $library ? $library->toArray() : ['name' => $methodName],
                    ['distance' => $minDistance]
                );
            })
            ->values()
            ->toArray();

        $libraries = collect($libraries)->sortBy([
            ['distance', 'asc'],
            ['used_in_issues_count', 'desc'],
        ])->values()->toArray();

        return response()->json([
            'graph' => $record->graph,
            'suggestions' => $suggestionGraphs,
            'libraries' => $libraries,
        ], 200);
    }
}
