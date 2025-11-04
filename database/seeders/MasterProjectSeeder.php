<?php

namespace Database\Seeders;

use App\Models\Master\MasterProject;
use Illuminate\Database\Seeder;

class MasterProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lists = [
            [
                'ref_id' => '12310843',
                'key' => 'HIVE',
                'name' => 'Hive',
                'avatar' => 'https://issues.apache.org/jira/secure/projectavatar?pid=12310843&avatarId=11935',
                'archived' => false,
                'url' => 'http://hive.apache.org/',
                'description' => 'Sistem data warehouse berbasis Hadoop yang memungkinkan analisis data besar menggunakan sintaks mirip SQL (HiveQL)',
            ],
            [
                'ref_id' => '10611',
                'key' => 'AXIS2',
                'name' => 'Axis2',
                'avatar' => 'https://issues.apache.org/jira/secure/projectavatar?pid=10611&avatarId=10011',
                'archived' => false,
                'url' => 'http://axis.apache.org/axis2/java/core',
                'description' => 'Framework untuk membangun dan mengonsumsi web service berbasis SOAP dan REST dengan performa tinggi dan arsitektur modular',
            ],
            [
                'ref_id' => '12311210',
                'key' => 'AMQ',
                'name' => 'ActiveMQ Classic',
                'avatar' => 'https://issues.apache.org/jira/secure/projectavatar?pid=12311210&avatarId=10011',
                'archived' => false,
                'url' => 'http://activemq.apache.org/',
                'description' => 'Message broker open-source yang mendukung berbagai protokol pesan (JMS, AMQP, MQTT, STOMP) untuk komunikasi asinkron antar aplikasi',
            ],
            [
                'ref_id' => '12321922',
                'key' => 'HDDS',
                'name' => 'Apache Ozone',
                'avatar' => 'https://issues.apache.org/jira/secure/projectavatar?pid=12321922&avatarId=36746',
                'archived' => false,
                'url' => 'https://ozone.apache.org/',
                'description' => 'Sistem penyimpanan objek dan key-value berskala besar yang kompatibel dengan Hadoop, dirancang untuk menangani data dalam skala exabyte',
            ],
            [
                'ref_id' => '12315420',
                'key' => 'SPARK',
                'name' => 'Spark',
                'avatar' => 'https://issues.apache.org/jira/secure/projectavatar?pid=12315420&avatarId=27346',
                'archived' => false,
                'url' => 'http://spark.apache.org/',
                'description' => 'Platform komputasi terdistribusi untuk pemrosesan data besar secara cepat, mendukung batch, streaming, machine learning, dan analisis graf',
            ],
        ];

        foreach ($lists as $list) {
            MasterProject::updateOrCreate(
                [
                    'ref_id' => $list['ref_id'],
                    'key' => $list['key'],
                ],
                $list
            );
        }
    }
}
