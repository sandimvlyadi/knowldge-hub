<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use App\Models\Issue;
use App\Models\Library;
use App\Models\Master\MasterProject;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Cache dashboard data for 5 minutes to reduce database load
        $data = Cache::remember('dashboard_data', 300, function () {
            // Get issue counts by project - Optimized with select
            $issuesByProject = MasterProject::select('ref_id', 'key', 'name', 'avatar')
                ->has('issues')
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

            // Get issues by status - Optimized
            $issuesByStatus = Issue::selectRaw('ref_status_id, COUNT(*) as count')
                ->groupBy('ref_status_id')
                ->with('status:ref_id,name')
                ->get()
                ->map(function ($item) {
                    return [
                        'status' => $item->status ? $item->status->name : 'Unknown',
                        'count' => $item->count,
                    ];
                });

            // Get issues by priority - Optimized
            $issuesByPriority = Issue::selectRaw('ref_priority_id, COUNT(*) as count')
                ->groupBy('ref_priority_id')
                ->with('priority:ref_id,name')
                ->get()
                ->map(function ($item) {
                    return [
                        'priority' => $item->priority ? $item->priority->name : 'Unknown',
                        'count' => $item->count,
                    ];
                });

            // Get features by status - Optimized
            $featuresByStatus = Feature::selectRaw('ref_status_id, COUNT(*) as count')
                ->groupBy('ref_status_id')
                ->with('status:ref_id,name')
                ->get()
                ->map(function ($item) {
                    return [
                        'status' => $item->status ? $item->status->name : 'Unknown',
                        'count' => $item->count,
                    ];
                });

            // Get top 10 most used libraries - HEAVILY OPTIMIZED with raw query
            $topLibraries = DB::table('libraries')
                ->select('libraries.name', DB::raw('COUNT(issue_library.issue_key) as count'))
                ->leftJoin('issue_library', 'libraries.name', '=', 'issue_library.library_name')
                ->groupBy('libraries.name')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($library) {
                    return [
                        'name' => $library->name,
                        'count' => (int) $library->count,
                    ];
                });

            // Overview statistics - Single query optimization
            $libraryStats = Library::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN description IS NOT NULL THEN 1 ELSE 0 END) as with_description
            ')->first();

            $overview = [
                'total_features' => Feature::count(),
                'total_issues' => Issue::count(),
                'total_libraries' => $libraryStats->total,
                'total_projects' => MasterProject::count(),
            ];

            return [
                'overview' => $overview,
                'count' => [
                    'library' => [
                        'library_with_description' => $libraryStats->with_description,
                        'library_all' => $libraryStats->total,
                    ],
                    'issue_by_project' => $issuesByProject,
                    'issue_by_status' => $issuesByStatus,
                    'issue_by_priority' => $issuesByPriority,
                    'feature_by_status' => $featuresByStatus,
                    'top_libraries' => $topLibraries,
                ],
            ];
        });

        return inertia('dashboard', $data);
    }
}
