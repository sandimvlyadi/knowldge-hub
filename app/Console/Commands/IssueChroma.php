<?php

namespace App\Console\Commands;

use App\Models\Issue;
use DB;
use HelgeSverre\Chromadb\Embeddings\Embeddings;
use HelgeSverre\Chromadb\Facades\Chromadb;
use Illuminate\Console\Command;

class IssueChroma extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'issue:chroma';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Store issues into Chroma vector database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $embedder = Embeddings::fromConfig();
        $chromadb = Chromadb::client()->withEmbeddings(embeddingFunction: $embedder);
        $collection = $chromadb->collections()->create(
            name: 'issues_collection',
            getOrCreate: true,
            metadata: [
                'description' => 'A collection of issue embeddings',
            ],
            configuration: [
                'hnsw:space' => 'cosine',
                'hnsw:construction_ef' => 100,
                'hnsw:M' => 16,
            ]
        );

        if ($collection->failed()) {
            $this->error('Failed to create or retrieve collection: '.$collection->body());

            return self::FAILURE;
        }

        $collectionId = $collection->json('id');
        $startAt = 0;
        $maxResults = 10;

        $totalIssues = Issue::whereHas('libraries')
            ->where('chromadb_stored', false)
            ->count();
        $this->info("Total issues to process: {$totalIssues}");
        $bar = $this->output->createProgressBar($totalIssues);
        $bar->start();

        $addedCount = 0;
        $skippedCount = 0;
        $errorCount = 0;

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
                ->skip($startAt)
                ->take($maxResults)
                ->get();

            if ($issues->isEmpty()) {
                break;
            }

            foreach ($issues as $issue) {
                $items = $chromadb->items()->get(
                    collectionId: $collectionId,
                    ids: [$issue->key],
                );

                if ($items->failed()) {
                    $errorCount++;
                    $bar->advance();

                    continue;
                }

                $docs = $items->json('documents');
                if (empty($docs)) {
                    // $this->info("Adding Issue Key: {$issue->key}");
                    $description = "{$issue->summary}. ".($issue->description ?? '');
                    $description = trim($description);

                    $result = $chromadb->items()->addWithEmbeddings(
                        collectionId: $collectionId,
                        documents: [$description],
                        embeddingFunction: $embedder,
                        ids: [$issue->key],
                        metadatas: [[
                            'issue_id' => $issue->id,
                            'project' => $issue->project->ref_id,
                            'issue_type' => $issue->issueType->ref_id,
                            'priority' => $issue->priority->ref_id,
                            'status' => $issue->status->ref_id,
                            'reporter' => $issue->reporter->key,
                        ]]
                    );

                    if ($result->failed()) {
                        $this->error("Failed to add Issue Key: {$issue->key}");
                        $this->error($result->body());
                        $errorCount++;
                    } else {
                        $addedCount++;
                        $issue->chromadb_stored = true;
                        $issue->save();
                    }
                } else {
                    $skippedCount++;
                    $issue->chromadb_stored = true;
                    $issue->save();
                }

                $bar->advance();
            }

            $startAt += $maxResults;
        }

        $bar->finish();
        $this->newLine(2);
        $this->info('Completed!');
        $this->info("Added: {$addedCount} | Skipped: {$skippedCount} | Errors: {$errorCount}");

        return self::SUCCESS;
    }
}
