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
}
