<?php

namespace App\Http\Controllers;

use App\Http\Requests\Library\StoreLibraryRequest;
use App\Http\Requests\Library\UpdateLibraryRequest;
use App\Models\Library;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LibraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('library/index');
    }

    public function data(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', null);

        $data = Library::leftJoin('issue_library', 'libraries.name', '=', 'issue_library.library_name')
            ->selectRaw('libraries.*, COUNT(issue_library.issue_key) as issues_count')
            ->when($query, function ($q) use ($query) {
                $q->where('libraries.name', 'like', "%{$query}%")
                    ->orWhere('libraries.description', 'like', "%{$query}%");
            })
            ->groupBy('libraries.id', 'libraries.name', 'libraries.description', 'libraries.created_at', 'libraries.updated_at', 'libraries.deleted_at', 'libraries.deleted_by')
            ->orderBy('issues_count', 'desc')
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLibraryRequest $request): JsonResponse
    {
        // Check if there's a soft-deleted record with same name
        $existingByKey = Library::withTrashed()->where('name', $request->name)->first();

        // If soft-deleted record exists, restore and update it
        if ($existingByKey && $existingByKey->trashed()) {
            $existingByKey->restore();
            $existingByKey->deleted_by = null; // Reset deleted_by
            $existingByKey->update($request->validated());

            return response()->json($existingByKey, 200);
        }

        // Otherwise create new record
        $record = Library::create($request->validated());

        return response()->json($record, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLibraryRequest $request, Library $record): JsonResponse
    {
        $record->update($request->validated());

        return response()->json($record, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Library $record)
    {
        $record->delete();

        return response()->json(null, 204);
    }

    public function option(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', null);

        $data = Library::when($search, function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }
}
