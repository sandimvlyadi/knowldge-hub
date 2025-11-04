<?php

namespace App\Helpers;

class GeneralHelper
{
    public static function EnsureArray($value): array
    {
        if (is_null($value)) {
            return [];
        }

        if (is_string($value)) {
            return [$value];
        }

        if (is_array($value)) {
            return $value;
        }

        return [];
    }

    public static function FilterEmptyValues(array $array): array
    {
        if (! is_array($array)) {
            return [];
        }

        return array_filter($array, function ($value) {
            return ! empty(trim($value));
        });
    }
}
