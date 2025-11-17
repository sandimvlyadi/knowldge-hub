<?php

namespace App\Http\Requests\Feature;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFeatureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'key' => [
                'required',
                'string',
                'max:255',
                Rule::unique('App\Models\Feature', 'key')->whereNull('deleted_at'),
            ],
            'summary' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'components' => ['nullable', 'string'],
            'ref_project_id' => ['required', 'string', Rule::exists('App\Models\Master\MasterProject', 'ref_id')],
            'ref_issue_type_id' => ['required', 'string', Rule::exists('App\Models\Master\MasterIssueType', 'ref_id')],
            'ref_priority_id' => ['required', 'string', Rule::exists('App\Models\Master\MasterPriority', 'ref_id')],
            'ref_status_id' => ['required', 'string', Rule::exists('App\Models\Master\MasterStatus', 'ref_id')],
            'ref_reporter_key' => ['required', 'string', Rule::exists('App\Models\Master\MasterReporter', 'key')],
        ];
    }
}
