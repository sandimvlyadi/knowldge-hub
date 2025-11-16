<?php

namespace App\Console\Commands;

use App\Models\Library;
use Illuminate\Console\Command;

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
        $libraries = Library::leftJoin('issue_library', 'libraries.name', '=', 'issue_library.library_name')
            ->selectRaw('libraries.*, COUNT(issue_library.issue_key) as issues_count')
            ->where('libraries.name', 'NOT LIKE', 'java%')
            ->where('libraries.name', 'NOT LIKE', 'org.apache%')
            ->where('libraries.name', 'NOT LIKE', 'org.junit%')
            ->groupBy('libraries.name')
            ->orderBy('issues_count', 'desc')
            ->limit(10)
            ->get();

        foreach ($libraries as $library) {
            $this->info("Library: {$library->name} - Used in {$library->issues_count} issues");
        }
    }
}
