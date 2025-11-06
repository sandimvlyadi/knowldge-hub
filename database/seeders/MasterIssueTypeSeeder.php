<?php

namespace Database\Seeders;

use App\Models\Master\MasterIssueType;
use Illuminate\Database\Seeder;

class MasterIssueTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lists = [
            [
                'ref_id' => 2,
                'name' => 'New Feature',
                'icon_url' => 'https://issues.apache.org/jira/secure/viewavatar?size=xsmall&avatarId=21141&avatarType=issuetype',
                'description' => 'A new feature of the product, which has yet to be developed.',
            ],
            [
                'ref_id' => 4,
                'name' => 'Improvement',
                'icon_url' => 'https://issues.apache.org/jira/secure/viewavatar?size=xsmall&avatarId=21140&avatarType=issuetype',
                'description' => 'An improvement or enhancement to an existing feature or task.',
            ],
            [
                'ref_id' => 5,
                'name' => 'Wish',
                'icon_url' => 'https://issues.apache.org/jira/secure/viewavatar?size=xsmall&avatarId=21140&avatarType=issuetype',
                'description' => 'General wishlist item.',
            ],
        ];

        foreach ($lists as $item) {
            MasterIssueType::updateOrCreate(
                ['ref_id' => $item['ref_id']],
                $item
            );
        }
    }
}
