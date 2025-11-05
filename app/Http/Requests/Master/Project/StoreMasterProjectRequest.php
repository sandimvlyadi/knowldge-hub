<?php

namespace App\Http\Requests\Master\Project;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMasterProjectRequest extends FormRequest
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
            'ref_id' => [
                'required',
                'string',
                'max:255',
                Rule::unique('App\Models\Master\MasterProject', 'ref_id')->whereNull('deleted_at'),
            ],
            'key' => [
                'required',
                'string',
                'max:16',
                Rule::unique('App\Models\Master\MasterProject', 'key')->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['required', 'url'],
            'archived' => ['required', 'boolean'],
            'url' => ['nullable', 'url'],
            'description' => ['nullable', 'string'],
        ];
    }
}
