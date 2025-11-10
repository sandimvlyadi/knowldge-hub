<?php

namespace App\Console\Commands;

use App\Models\Issue;
use App\Models\Master\MasterIssueType;
use App\Models\Master\MasterPriority;
use App\Models\Master\MasterProject;
use App\Models\Master\MasterReporter;
use App\Models\Master\MasterStatus;
use App\Models\Master\MasterStatusCategory;
use Illuminate\Console\Command;
use Storage;

class IssueStore extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issue:store';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Store fetched issues into the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $files = Storage::allFiles('issues');

        $jsonFiles = collect($files)
            ->filter(function ($file) {
                return ! str_contains($file, '/temp/') && pathinfo($file, PATHINFO_EXTENSION) === 'json';
            });

        $this->info("Found {$jsonFiles->count()} JSON files.");

        foreach ($jsonFiles as $file) {
            $this->info("Processing: {$file}");
            $content = Storage::get($file);
            $data = json_decode($content, true);

            $project = $data['fields']['project'] ?? null;
            if (! $project) {
                $this->error("No project data found in file: {$file}");

                continue;
            }

            $issueType = $data['fields']['issuetype'] ?? null;
            if (! $issueType) {
                $this->error("No issue type data found in file: {$file}");

                continue;
            }

            $priority = $data['fields']['priority'] ?? null;
            if (! $priority) {
                $this->error("No priority data found in file: {$file}");

                continue;
            }

            $status = $data['fields']['status'] ?? null;
            if (! $status) {
                $this->error("No status data found in file: {$file}");

                continue;
            }

            $statusCategory = $status['statusCategory'] ?? null;
            if (! $statusCategory) {
                $this->error("No status category data found in file: {$file}");

                continue;
            }

            $reporter = $data['fields']['reporter'] ?? null;
            if (! $reporter) {
                $this->error("No reporter data found in file: {$file}");

                continue;
            }

            $project = MasterProject::firstOrCreate(
                [
                    'ref_id' => $project['id'] ?? null,
                    'key' => $project['key'] ?? null,
                ],
                [
                    'name' => $project['name'] ?? null,
                    'avatar' => $project['avatarUrls']['48x48'] ?? null,
                    'archived' => false,
                    'url' => "https://issues.apache.org/jira/projects/{$project['key']}" ?? null,
                    'description' => $project['projectCategory']['description'] ?? null,
                ]
            );

            $issueType = MasterIssueType::firstOrCreate(
                [
                    'ref_id' => $issueType['id'] ?? null,
                ],
                [
                    'name' => $issueType['name'] ?? null,
                    'icon_url' => $issueType['iconUrl'] ?? null,
                    'description' => $issueType['description'] ?? null,
                ]
            );

            $priority = MasterPriority::firstOrCreate(
                [
                    'ref_id' => $priority['id'] ?? null,
                ],
                [
                    'name' => $priority['name'] ?? null,
                    'icon_url' => $priority['iconUrl'] ?? null,
                    'status_color' => $priority['statusColor'] ?? null,
                    'description' => $priority['description'] ?? null,
                ]
            );

            $statusCategory = MasterStatusCategory::firstOrCreate(
                [
                    'ref_id' => $statusCategory['id'] ?? null,
                    'key' => $statusCategory['key'] ?? null,
                ],
                [
                    'name' => $statusCategory['name'] ?? null,
                    'color_name' => $statusCategory['colorName'] ?? null,
                ]
            );

            $status = MasterStatus::firstOrCreate(
                [
                    'ref_id' => $status['id'] ?? null,
                ],
                [
                    'name' => $status['name'] ?? null,
                    'icon_url' => $status['iconUrl'] ?? null,
                    'description' => $status['description'] ?? null,
                    'ref_status_category_id' => $statusCategory->id,
                ]
            );

            $components = $data['fields']['components'] ?? [];
            $componentImploded = str_replace(
                ' ',
                '',
                implode(
                    ',',
                    collect($components)->pluck('name')->toArray()
                )
            );

            $reporter = MasterReporter::firstOrCreate(
                [
                    'key' => $reporter['key'] ?? null,
                ],
                [
                    'name' => $reporter['name'] ?? null,
                    'display_name' => $reporter['displayName'] ?? null,
                    'avatar' => $reporter['avatarUrls']['48x48'] ?? null,
                    'active' => $reporter['active'] ?? false,
                    'time_zone' => $reporter['timeZone'] ?? null,
                ]
            );

            $validated = [
                'ref_id' => $data['id'] ?? null,
                'key' => $data['key'] ?? null,
                'url' => "https://issues.apache.org/jira/browse/{$data['key']}" ?? null,
                'summary' => $data['fields']['summary'] ?? null,
                'description' => $data['fields']['description'] ?? null,
                'components' => $componentImploded,
                'created' => $data['fields']['created'] ?? null,
                'ref_project_id' => $project->ref_id,
                'ref_issue_type_id' => $issueType->ref_id,
                'ref_priority_id' => $priority->ref_id,
                'ref_status_id' => $status->ref_id,
                'ref_reporter_key' => $reporter->key,
            ];

            $issue = Issue::updateOrCreate(
                [
                    'ref_id' => $validated['ref_id'],
                    'key' => $validated['key'],
                ],
                $validated
            );
        }
    }
}
