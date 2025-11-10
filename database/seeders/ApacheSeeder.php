<?php

namespace Database\Seeders;

use App\Helpers\ApacheHelper;
use Illuminate\Database\Seeder;
use Storage;

class ApacheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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
