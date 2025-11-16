<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Reporter\StoreMasterReporterRequest;
use App\Http\Requests\Master\Reporter\UpdateMasterReporterRequest;
use App\Models\Master\MasterReporter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterReporterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('master/reporter/index');
    }

    public function data(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', null);

        $data = MasterReporter::when($query, function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('display_name', 'like', "%{$query}%");
        })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMasterReporterRequest $request): JsonResponse
    {
        // Check if there's a soft-deleted record with same key
        $existingByKey = MasterReporter::withTrashed()->where('key', $request->key)->first();

        if ($existingByKey && $existingByKey->trashed()) {
            $existingByKey->restore();
            $existingByKey->deleted_by = null; // Reset deleted_by
            $existingByKey->update($request->validated());

            return response()->json($existingByKey, 200);
        }

        // Otherwise create new record
        $record = MasterReporter::create($request->validated());

        return response()->json($record, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMasterReporterRequest $request, MasterReporter $record): JsonResponse
    {
        $record->update($request->validated());

        return response()->json($record, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterReporter $record)
    {
        $record->delete();

        return response()->json(null, 204);
    }

    public function option(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', null);

        $data = MasterReporter::when($search, function ($q) use ($search) {
            $q->where('key', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('display_name', 'like', "%{$search}%");
        })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }
}
