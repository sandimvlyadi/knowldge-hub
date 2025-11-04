<?php

namespace App\Http\Controllers;

use App\Helpers\ApacheHelper;
use App\Helpers\GeneralHelper;
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

        // Get filter parameters and ensure they are arrays
        $filters = [
            'project' => GeneralHelper::EnsureArray($request->query('project', [])),
            'issueType' => GeneralHelper::EnsureArray($request->query('issueType', [])),
            'priority' => GeneralHelper::EnsureArray($request->query('priority', [])),
            'status' => GeneralHelper::EnsureArray($request->query('status', [])),
        ];

        $apache = new ApacheHelper;
        $response = $apache->search($startAt, $maxResults, $filters);

        return response()->json($response->json(), 200);
    }

    public function projectOptions(): JsonResponse
    {
        $apache = new ApacheHelper;
        $response = $apache->projectOptions();

        $includes = ['Hadoop Common', 'HBase', 'Struts 2', 'CXF', 'Axis2'];
        $data = $response->json();
        $data = array_filter($data, function ($item) use ($includes) {
            return in_array($item['name'], $includes);
        });

        return response()->json(collect($data)->values()->all(), 200);
    }

    public function issueTypeOptions(): JsonResponse
    {
        $apache = new ApacheHelper;
        $response = $apache->issueTypeOptions();

        $includes = ['New Feature', 'Improvement', 'Wish'];
        $data = $response->json();
        $data = array_filter($data, function ($item) use ($includes) {
            return in_array($item['name'], $includes);
        });

        return response()->json(collect($data)->values()->all(), 200);
    }

    public function statusOptions(): JsonResponse
    {
        $apache = new ApacheHelper;
        $response = $apache->statusOptions();

        $includes = ['Resolved', 'Closed'];
        $data = $response->json();
        $data = array_filter($data, function ($item) use ($includes) {
            return in_array($item['name'], $includes);
        });

        return response()->json(collect($data)->values()->all(), 200);
    }

    public function priorityOptions(): JsonResponse
    {
        $apache = new ApacheHelper;
        $response = $apache->priorityOptions();

        return response()->json($response->json(), 200);
    }
}
