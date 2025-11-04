<?php

namespace App\Listeners;

use App\Events\StoreIssues;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessStoreIssues implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(StoreIssues $event): void
    {
        try {
            // Check if batch file exists
            if (! Storage::exists($event->filePath)) {
                Log::warning("Batch file {$event->filePath} not found.");

                return;
            }

            // Read issues from the batch file
            $content = Storage::get($event->filePath);
            $issues = json_decode($content, true);

            // Delete the temporary batch file
            Storage::delete($event->filePath);

            foreach ($issues as $issue) {
                // Create filename using issue key
                $issueKey = $issue['key'] ?? 'unknown-'.uniqid();
                $projectCode = explode('-', $issueKey)[0];
                if (! Storage::exists("issues/{$projectCode}")) {
                    Storage::makeDirectory("issues/{$projectCode}");
                }
                $filename = "issues/{$projectCode}/{$issueKey}.json";

                // Store issue as JSON file if it doesn't already exist
                if (! Storage::exists($filename)) {
                    Storage::put($filename, json_encode($issue, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
                }
            }

            Log::info("Stored batch {$event->batchNumber} with ".count($issues).' issues');

        } catch (\Exception $e) {
            Log::error("Failed to store issues batch {$event->batchNumber}: ".$e->getMessage());
            throw $e;
        }
    }
}
