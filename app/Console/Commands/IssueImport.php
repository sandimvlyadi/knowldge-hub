<?php

namespace App\Console\Commands;

use App\Models\Issue;
use App\Models\Library;
use Illuminate\Console\Command;
use Storage;

class IssueImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issue:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync issues with imported libraries';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $data = Storage::get('issues/jira_imports.csv');
        $lines = explode(PHP_EOL, $data);
        $isFirstLine = true;

        // Filter out empty lines for accurate count
        $validLines = array_filter($lines, fn ($line) => ! empty(trim($line)));
        $totalLines = count($validLines) - 1; // Exclude header

        $bar = $this->output->createProgressBar($totalLines);
        $bar->start();

        foreach ($lines as $line) {
            if (empty(trim($line))) {
                continue;
            }

            if ($isFirstLine) {
                $isFirstLine = false;

                continue;
            }

            [$jiraKey, $import, $foundAt] = str_getcsv($line);

            $issue = Issue::where('key', $jiraKey)->first();
            $library = Library::firstOrCreate(['name' => $import]);

            if ($issue) {
                $issue->libraries()->syncWithoutDetaching([$library->name]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Import completed successfully!');
    }
}
