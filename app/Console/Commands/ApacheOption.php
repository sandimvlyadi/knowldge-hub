<?php

namespace App\Console\Commands;

use App\Helpers\ApacheHelper;
use Illuminate\Console\Command;
use Storage;

class ApacheOption extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'apache:option';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch Apache JIRA options';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apache = new ApacheHelper;

        $project = $apache->projectOptions();
        $issueType = $apache->issueTypeOptions();
        $priority = $apache->priorityOptions();
        $status = $apache->statusOptions();

        $files = [
            'apache/project.json' => $project->body(),
            'apache/issuetype.json' => $issueType->body(),
            'apache/priority.json' => $priority->body(),
            'apache/status.json' => $status->body(),
        ];

        foreach ($files as $path => $content) {
            if (! Storage::exists($path)) {
                $formattedJson = json_encode(json_decode($content), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                Storage::put($path, $formattedJson);
            }
        }
    }
}
