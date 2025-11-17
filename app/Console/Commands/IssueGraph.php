<?php

namespace App\Console\Commands;

use App\Models\Issue;
use Illuminate\Console\Command;
use Storage;

class IssueGraph extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issue:graph';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate issue graphs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $startAt = 0;
        $maxResults = 10;

        while (true) {
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
                ->skip($startAt)
                ->take($maxResults)
                ->get();

            $allGraphs = $issues->map(function ($issue) {
                return [
                    'key' => $issue->key,
                    'summary' => $issue->summary,
                    'description' => $issue->description,
                    'components' => $issue->components ? explode(',', $issue->components) : [],
                    'project' => $issue->project?->name,
                    'issuetype' => $issue->issueType?->name,
                    'priority' => $issue->priority?->name,
                    'status' => $issue->status?->name,
                    'reporter' => $issue->reporter?->display_name,
                    'methods' => $issue->libraries->pluck('name')->toArray(),
                ];
            });

            if ($issues->isEmpty()) {
                break;
            }

            $existingData = [];
            $filename = 'issues/graphs.json';

            if (Storage::exists($filename)) {
                $existingData = json_decode(Storage::get($filename), true) ?? [];
            }

            // Create array of existing keys for faster lookup
            $existingKeys = array_column($existingData, 'key');

            foreach ($allGraphs as $graph) {
                $keyIndex = array_search($graph['key'], $existingKeys);

                if ($keyIndex !== false) {
                    // Update existing entry
                    $existingData[$keyIndex] = $graph;
                } else {
                    // Add new entry
                    $existingData[] = $graph;
                    $existingKeys[] = $graph['key'];
                }
            }

            Storage::put($filename, json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

            $this->info("Processed {$issues->count()} issues (starting at {$startAt})");

            $startAt += $maxResults;
        }
    }
}
