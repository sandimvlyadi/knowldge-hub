<?php

namespace App\Console\Commands;

use App\Events\StoreIssues;
use App\Helpers\ApacheHelper;
use Illuminate\Console\Command;
use Storage;

class IssueGet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issue:get';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get issue from repository';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $startAt = 0;
        $maxResults = 1000;
        $apache = new ApacheHelper;
        $progressBar = null;
        $totalFetched = 0;
        $batchNumber = 1;

        $this->info('Starting to fetch issues...');

        while (true) {
            $response = $apache->search($startAt, $maxResults);
            $issues = $response['issues'] ?? [];
            $total = $response['total'] ?? 0;

            // Initialize progress bar with total count on first iteration
            if (is_null($progressBar) && $total > 0) {
                $progressBar = $this->output->createProgressBar($total);
                $progressBar->setFormat(' %current%/%max% [%bar%] %percent:3s%% - %message%');
                $progressBar->setMessage('Fetching issues...');
                $progressBar->start();
            }

            if (empty($issues)) {
                break;
            }

            // Store batch temporarily
            $storageDir = 'issues/temp';
            if (! Storage::exists($storageDir)) {
                Storage::makeDirectory($storageDir);
            }
            $filename = "{$storageDir}/batch_{$batchNumber}.json";
            Storage::put($filename, json_encode($issues, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

            // Dispatch event to store issues in background
            StoreIssues::dispatch($filename, $batchNumber);

            $totalFetched += count($issues);
            $startAt += $maxResults;
            $batchNumber++;

            // Update progress bar
            if (! is_null($progressBar)) {
                $progressBar->setProgress($totalFetched);
                $progressBar->setMessage("Fetched {$totalFetched} of {$total} issues (Batch {$batchNumber})");
            }
        }

        // Finish progress bar
        if (! is_null($progressBar)) {
            $progressBar->finish();
            $this->newLine();
        }

        $this->info("Completed! Total issues fetched: {$totalFetched}");
        $this->info('Issues are being stored in background. Check storage/app/issues/ directory.');
    }
}
