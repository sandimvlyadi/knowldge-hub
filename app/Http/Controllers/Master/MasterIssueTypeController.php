<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\IssueType\StoreMasterIssueTypeRequest;
use App\Http\Requests\Master\IssueType\UpdateMasterIssueTypeRequest;
use App\Models\Master\MasterIssueType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterIssueTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('master/issuetype/index');
    }

    public function data(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', null);

        $data = MasterIssueType::when($query, function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%");
        })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMasterIssueTypeRequest $request): JsonResponse
    {
        // Check if there's a soft-deleted record with same ref_id or key
        $existingByRefId = MasterIssueType::withTrashed()->where('ref_id', $request->ref_id)->first();
        $existingByKey = MasterIssueType::withTrashed()->where('key', $request->key)->first();

        // If soft-deleted record exists, restore and update it
        if ($existingByRefId && $existingByRefId->trashed()) {
            $existingByRefId->restore();
            $existingByRefId->deleted_by = null; // Reset deleted_by
            $existingByRefId->update($request->validated());

            return response()->json($existingByRefId, 200);
        }

        if ($existingByKey && $existingByKey->trashed()) {
            $existingByKey->restore();
            $existingByKey->deleted_by = null; // Reset deleted_by
            $existingByKey->update($request->validated());

            return response()->json($existingByKey, 200);
        }

        // Otherwise create new record
        $record = MasterIssueType::create($request->validated());

        return response()->json($record, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMasterIssueTypeRequest $request, MasterIssueType $record): JsonResponse
    {
        $record->update($request->validated());

        return response()->json($record, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterIssueType $record)
    {
        $record->delete();

        return response()->json(null, 204);
    }
}
