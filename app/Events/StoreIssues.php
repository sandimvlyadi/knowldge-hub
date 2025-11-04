<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StoreIssues implements ShouldQueue
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public string $filePath;

    public int $batchNumber;

    /**
     * Create a new event instance.
     */
    public function __construct(string $filePath, int $batchNumber)
    {
        $this->filePath = $filePath;
        $this->batchNumber = $batchNumber;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('store-issues'),
        ];
    }
}
