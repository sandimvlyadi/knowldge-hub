<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Status\StoreMasterStatusRequest;
use App\Http\Requests\Master\Status\UpdateMasterStatusRequest;
use App\Models\Master\MasterStatus;
use App\Models\Master\MasterStatusCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('master/status/index');
    }

    public function data(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', null);
        $categoryId = $request->input('category_id', null);

        $data = MasterStatus::with(['statusCategory'])
            ->when($query, function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            })
            ->when($categoryId, function ($q) use ($categoryId) {
                $q->whereHas('statusCategory', function ($q2) use ($categoryId) {
                    $q2->where('id', $categoryId);
                });
            })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMasterStatusRequest $request): JsonResponse
    {
        $category = MasterStatusCategory::firstOrCreate(
            [
                'ref_id' => $request->category_ref_id,
            ],
            [
                'key' => $request->category_key,
                'name' => $request->category_name,
                'color_name' => $request->category_color_name,
            ]
        );

        // Check if there's a soft-deleted record with same ref_id or key
        $existingByRefId = MasterStatus::withTrashed()->where('ref_id', $request->ref_id)->first();
        $existingByKey = MasterStatus::withTrashed()->where('key', $request->key)->first();

        // If soft-deleted record exists, restore and update it
        if ($existingByRefId && $existingByRefId->trashed()) {
            $existingByRefId->restore();
            $existingByRefId->deleted_by = null; // Reset deleted_by
            $existingByRefId->update($request->validated());
            $existingByRefId->statusCategory()->associate($category);
            $existingByRefId->save();

            return response()->json($existingByRefId, 200);
        }

        if ($existingByKey && $existingByKey->trashed()) {
            $existingByKey->restore();
            $existingByKey->deleted_by = null; // Reset deleted_by
            $existingByKey->update($request->validated());
            $existingByKey->statusCategory()->associate($category);
            $existingByKey->save();

            return response()->json($existingByKey, 200);
        }

        // Otherwise create new record
        $record = MasterStatus::create($request->validated());
        $record->statusCategory()->associate($category);
        $record->save();

        return response()->json($record, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMasterStatusRequest $request, MasterStatus $record): JsonResponse
    {
        $category = MasterStatusCategory::firstOrCreate(
            [
                'ref_id' => $request->category_ref_id,
            ],
            [
                'key' => $request->category_key,
                'name' => $request->category_name,
                'color_name' => $request->category_color_name,
            ]
        );

        $record->update($request->validated());
        $record->statusCategory()->associate($category);
        $record->save();

        return response()->json($record, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterStatus $record)
    {
        $record->delete();

        return response()->json(null, 204);
    }

    public function optionCategory(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', null);

        $data = MasterStatusCategory::when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
        })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }
}
