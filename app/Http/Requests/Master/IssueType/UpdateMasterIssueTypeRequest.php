<?php

namespace App\Http\Requests\Master\IssueType;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMasterIssueTypeRequest extends FormRequest
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
            'ref_id' => ['required', 'string', 'max:255', Rule::unique('App\Models\Master\MasterIssueType', 'ref_id')->ignore($this->route('record'))],
            'name' => ['required', 'string', 'max:255'],
            'icon_url' => ['required', 'url'],
            'description' => ['nullable', 'string'],
        ];
    }
}
