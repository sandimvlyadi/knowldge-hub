<?php

namespace App\Http\Requests\Master\Priority;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMasterPriorityRequest extends FormRequest
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
                Rule::unique('App\Models\Master\MasterPriority', 'ref_id')->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:255'],
            'icon_url' => ['required', 'url'],
            'status_color' => ['required', 'string', 'max:7'],
            'description' => ['nullable', 'string'],
        ];
    }
}
