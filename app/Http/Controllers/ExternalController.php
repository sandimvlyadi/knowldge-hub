<?php

namespace App\Http\Controllers;

use App\Models\Master\MasterIssueType;
use App\Models\Master\MasterPriority;
use App\Models\Master\MasterProject;
use App\Models\Master\MasterStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Storage;

class ExternalController extends Controller
{
    public function getOptions(Request $request): JsonResponse
    {
        $includes = ['project', 'issueType', 'priority', 'status'];
        $type = $request->query('type', 'none');
        if (! in_array($type, $includes)) {
            return response()->json([
                'message' => 'Not Found',
            ], 404);
        }

        $data = [];
        switch ($type) {
            case 'project':
                $excludes = MasterProject::pluck('ref_id')->toArray();
                $data = Storage::json('apache/project.json');
                $data = array_map(function ($item) use ($excludes) {
                    $item['exist'] = in_array($item['id'], $excludes);

                    return $item;
                }, $data);
                break;
            case 'issueType':
                $excludes = MasterIssueType::pluck('ref_id')->toArray();
                $data = Storage::json('apache/issuetype.json');
                $data = array_map(function ($item) use ($excludes) {
                    $item['exist'] = in_array($item['id'], $excludes);

                    return $item;
                }, $data);
                break;
            case 'priority':
                $excludes = MasterPriority::pluck('ref_id')->toArray();
                $data = Storage::json('apache/priority.json');
                $data = array_map(function ($item) use ($excludes) {
                    $item['exist'] = in_array($item['id'], $excludes);

                    return $item;
                }, $data);
                break;
            case 'status':
                $excludes = MasterStatus::pluck('ref_id')->toArray();
                $data = Storage::json('apache/status.json');
                $data = array_map(function ($item) use ($excludes) {
                    $item['exist'] = in_array($item['id'], $excludes);

                    return $item;
                }, $data);
                break;
        }

        return response()->json(collect($data)->values()->all(), 200);
    }
}
