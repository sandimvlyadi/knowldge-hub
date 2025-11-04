<?php

namespace App\Helpers;

use Http;
use Log;

class ApacheHelper
{
    const API = 'https://issues.apache.org/jira/rest/api/2';

    public function __construct()
    {
        // Constructor implementation
    }

    public function search($startAt = 0, $maxResults = 10, $filters = [])
    {
        // Build JQL query based on filters
        $jqlParts = [];

        // Project filter
        $projectFilter = GeneralHelper::FilterEmptyValues($filters['project'] ?? []);
        if (! empty($projectFilter)) {
            $projects = array_map(function ($project) {
                return '"'.str_replace('"', '\\"', $project).'"';
            }, $projectFilter);
            $jqlParts[] = 'project IN ('.implode(', ', $projects).')';
        } else {
            // Default projects if no filter applied
            $jqlParts[] = 'project IN ("Axis2", "CXF", "Hadoop Common", "HBase", "Struts 2")';
        }

        // Issue Type filter
        $issueTypeFilter = GeneralHelper::FilterEmptyValues($filters['issueType'] ?? []);
        if (! empty($issueTypeFilter)) {
            $issueTypes = array_map(function ($type) {
                return '"'.str_replace('"', '\\"', $type).'"';
            }, $issueTypeFilter);
            $jqlParts[] = 'issuetype IN ('.implode(', ', $issueTypes).')';
        } else {
            // Default issue types if no filter applied
            $jqlParts[] = 'issuetype IN ("New Feature", "Improvement", "Wish")';
        }

        // Status filter
        $statusFilter = GeneralHelper::FilterEmptyValues($filters['status'] ?? []);
        if (! empty($statusFilter)) {
            $statuses = array_map(function ($status) {
                return '"'.str_replace('"', '\\"', $status).'"';
            }, $statusFilter);
            $jqlParts[] = 'status IN ('.implode(', ', $statuses).')';
        } else {
            // Default statuses if no filter applied
            $jqlParts[] = 'status IN ("Resolved", "Closed")';
        }

        // Priority filter (optional, only add if specified)
        $priorityFilter = GeneralHelper::FilterEmptyValues($filters['priority'] ?? []);
        if (! empty($priorityFilter)) {
            $priorities = array_map(function ($priority) {
                return '"'.str_replace('"', '\\"', $priority).'"';
            }, $priorityFilter);
            $jqlParts[] = 'priority IN ('.implode(', ', $priorities).')';
        }

        $jql = implode(' AND ', $jqlParts);
        $encodedJql = urlencode($jql);

        $url = self::API."/search?jql={$encodedJql}&fields=summary,description,issuetype,status,project,created,priority,reporter,components&maxResults={$maxResults}&startAt={$startAt}";

        // Log the URL for debugging (you can remove this in production)
        // Log::info('JIRA Search URL: '.$url);
        // Log::info('Applied filters: ', $filters);

        $response = Http::withOptions([
            'verify' => false,
        ])
            ->get($url);

        return $response;
    }

    public function projectOptions()
    {
        $url = self::API.'/project';
        $response = Http::withOptions([
            'verify' => false,
        ])
            ->get($url);

        return $response;
    }

    public function issueTypeOptions()
    {
        $url = self::API.'/issuetype';
        $response = Http::withOptions([
            'verify' => false,
        ])
            ->get($url);

        return $response;
    }

    public function statusOptions()
    {
        $url = self::API.'/status';
        $response = Http::withOptions([
            'verify' => false,
        ])
            ->get($url);

        return $response;
    }

    public function priorityOptions()
    {
        $url = self::API.'/priority';
        $response = Http::withOptions([
            'verify' => false,
        ])
            ->get($url);

        return $response;
    }
}
