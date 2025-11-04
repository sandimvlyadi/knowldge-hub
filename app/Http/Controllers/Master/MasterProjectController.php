<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Project\StoreMasterProjectRequest;
use App\Http\Requests\Master\Project\UpdateMasterProjectRequest;
use App\Models\Master\MasterProject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('master/project/index');
    }

    public function data(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);
        $query = $request->input('query', null);
        $archived = $request->input('archived', null);

        $data = MasterProject::when($query, function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
                ->orWhere('key', 'like', "%{$query}%")
                ->orWhere('description', 'like', "%{$query}%");
        })
            ->when($archived, function ($q) use ($archived) {
                $val = $archived == 'true';
                $q->where('archived', $val);
            })
            ->latest()
            ->paginate(perPage: $perPage, page: $page)
            ->withQueryString();

        return response()->json($data, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('master/project/partials/archived-filter');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMasterProjectRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(MasterProject $masterProject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MasterProject $masterProject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMasterProjectRequest $request, MasterProject $masterProject)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MasterProject $masterProject)
    {
        //
    }
}
