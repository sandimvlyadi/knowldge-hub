<?php

namespace Database\Seeders;

use App\Models\Master\MasterStatus;
use App\Models\Master\MasterStatusCategory;
use Illuminate\Database\Seeder;

class MasterStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lists = [
            [
                'ref_id' => 5,
                'name' => 'Resolved',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/statuses/resolved.png',
                'description' => 'A resolution has been taken, and it is awaiting verification by reporter. From here issues are either reopened, or are closed.',
                'status_category' => [
                    'ref_id' => 3,
                    'key' => 'done',
                    'name' => 'Done',
                    'color_name' => 'green',
                ],
            ],
            [
                'ref_id' => 6,
                'name' => 'Closed',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/statuses/closed.png',
                'description' => 'The issue is considered finished, the resolution is correct. Issues which are not closed can be reopened.',
                'status_category' => [
                    'ref_id' => 3,
                    'key' => 'done',
                    'name' => 'Done',
                    'color_name' => 'green',
                ],
            ],
        ];

        foreach ($lists as $data) {
            MasterStatus::updateOrCreate(
                ['ref_id' => $data['ref_id']],
                [
                    'name' => $data['name'],
                    'icon_url' => $data['icon_url'],
                    'description' => $data['description'],
                    'ref_status_category_id' => MasterStatusCategory::updateOrCreate(
                        [
                            'ref_id' => $data['status_category']['ref_id'],
                            'key' => $data['status_category']['key'],
                        ],
                        [
                            'name' => $data['status_category']['name'],
                            'color_name' => $data['status_category']['color_name'],
                        ]
                    )->ref_id,
                ]
            );
        }
    }
}
