<?php

namespace Database\Seeders;

use App\Models\Master\MasterPriority;
use Illuminate\Database\Seeder;

class MasterPrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lists = [
            [
                'ref_id' => 1,
                'name' => 'Blocker',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/priorities/blocker.svg',
                'status_color' => '#cc0000',
                'description' => 'Blocks development and/or testing work, production could not run',
            ],
            [
                'ref_id' => 2,
                'name' => 'Critical',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/priorities/critical.svg',
                'status_color' => '#ff0000',
                'description' => 'Crashes, loss of data, severe memory leak.',
            ],
            [
                'ref_id' => 3,
                'name' => 'Major',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/priorities/major.svg',
                'status_color' => '#009900',
                'description' => 'Major loss of function.',
            ],
            [
                'ref_id' => 4,
                'name' => 'Minor',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/priorities/minor.svg',
                'status_color' => '#006600',
                'description' => 'Minor loss of function, or other problem where easy workaround is present.',
            ],
            [
                'ref_id' => 5,
                'name' => 'Trivial',
                'icon_url' => 'https://issues.apache.org/jira/images/icons/priorities/trivial.svg',
                'status_color' => '#003300',
                'description' => 'Cosmetic problem like misspelt words or misaligned text.',
            ],
        ];

        foreach ($lists as $data) {
            MasterPriority::updateOrCreate(
                ['ref_id' => $data['ref_id']],
                $data
            );
        }
    }
}
