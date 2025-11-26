<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Library;
use App\Models\Master\MasterProject;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Get issue counts by project
        $issuesByProject = MasterProject::has('issues')
            ->withCount([
                'issues as issue_with_library_count' => function ($query) {
                    $query->whereHas('libraries');
                },
                'issues as issue_vectorized_count' => function ($query) {
                    $query->where('chromadb_stored', true);
                },
                'issues as issue_all_count',
            ])
            ->get()
            ->map(function ($project) {
                return [
                    'project_key' => $project->key,
                    'project_name' => $project->name,
                    'project_avatar' => $project->avatar,
                    'issue_with_library' => $project->issue_with_library_count,
                    'issue_vectorized' => $project->issue_vectorized_count,
                    'issue_all' => $project->issue_all_count,
                ];
            });

        $data = [
            'count' => [
                'library' => [
                    'library_with_description' => Library::whereNotNull('description')->count(),
                    'library_all' => Library::count(),
                ],
                'issue_by_project' => $issuesByProject,
            ],
        ];

        return inertia('dashboard', $data);
    }
}
