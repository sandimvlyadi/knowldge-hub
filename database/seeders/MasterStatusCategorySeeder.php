<?php

namespace Database\Seeders;

use App\Models\Master\MasterStatusCategory;
use Illuminate\Database\Seeder;

class MasterStatusCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lists = [
            [
                'ref_id' => 1,
                'key' => 'undefined',
                'color_name' => 'medium-gray',
                'name' => 'No Category',
            ],
            [
                'ref_id' => 2,
                'key' => 'new',
                'color_name' => 'blue-gray',
                'name' => 'To Do',
            ],
            [
                'ref_id' => 4,
                'key' => 'indeterminate',
                'color_name' => 'yellow',
                'name' => 'In Progress',
            ],
            [
                'ref_id' => 3,
                'key' => 'done',
                'color_name' => 'green',
                'name' => 'Done',
            ],
        ];

        foreach ($lists as $item) {
            MasterStatusCategory::updateOrCreate(
                [
                    'ref_id' => $item['ref_id'],
                    'key' => $item['key'],
                ],
                $item
            );
        }
    }
}
