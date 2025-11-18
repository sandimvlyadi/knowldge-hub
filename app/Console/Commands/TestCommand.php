<?php

namespace App\Console\Commands;

use App\Models\Issue;
use App\Models\Library;
use DB;
use HelgeSverre\Chromadb\Embeddings\Embeddings;
use Illuminate\Console\Command;
use OpenAI\Laravel\Facades\OpenAI;

class TestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $libraries = Library::leftJoin('issue_library', 'libraries.name', '=', 'issue_library.library_name')
        //     ->selectRaw('libraries.*, COUNT(issue_library.issue_key) as issues_count')
        //     ->where('libraries.name', 'NOT LIKE', 'java%')
        //     ->where('libraries.name', 'NOT LIKE', 'org.apache%')
        //     ->where('libraries.name', 'NOT LIKE', 'org.junit%')
        //     ->groupBy('libraries.name')
        //     ->orderBy('issues_count', 'desc')
        //     ->limit(10)
        //     ->get();

        // foreach ($libraries as $library) {
        //     $this->info("Library: {$library->name} - Used in {$library->issues_count} issues");
        // }

        // $text = 'Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as authentication, routing, sessions, and caching. Laravel aims to make the development process a pleasing one for the developer without sacrificing application functionality. Happy developers make the best code. Laravel is accessible, powerful, and provides tools required for large, robust applications.';
        // $response = OpenAI::embeddings()->create([
        //     'model' => 'text-embedding-3-small',
        //     'input' => $text,
        // ]);

        // $queryVector = json_encode($response->embeddings[0]->embedding);

        // $this->info('Embedding Vector: '.$queryVector);

        $issues = Issue::select([
            'id',
            'key',
            'summary',
            'description',
            'components',
            'ref_project_id',
            'ref_issue_type_id',
            'ref_priority_id',
            'ref_status_id',
            'ref_reporter_key',
            DB::raw('LENGTH(description) AS length_description'),
        ])
            ->with([
                'project:ref_id,name',
                'issueType:ref_id,name',
                'priority:ref_id,name',
                'status:ref_id,name',
                'reporter:key,display_name',
                'libraries:name',
            ])
            ->whereHas('libraries')
            ->where('chromadb_stored', false)
            ->orderBy('length_description', 'asc')
            ->skip(0)
            ->take(10)
            ->get();

        foreach ($issues as $issue) {
            $this->info("Issue Key: {$issue->key}, Description Length: ".strlen($issue->description));
        }

        return self::SUCCESS;
    }
}
