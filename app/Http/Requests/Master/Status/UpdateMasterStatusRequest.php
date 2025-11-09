<?php

namespace App\Http\Requests\Master\Status;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMasterStatusRequest extends FormRequest
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
            'ref_id' => ['required', 'string', 'max:255', Rule::unique('App\Models\Master\MasterStatus', 'ref_id')->ignore($this->route('record'))],
            'name' => ['required', 'string', 'max:255'],
            'icon_url' => ['required', 'url'],
            'description' => ['nullable', 'string'],
            'category_ref_id' => [
                'required',
                'string',
                'exists:App\Models\Master\MasterStatusCategory,ref_id',
            ],
            'category_key' => ['required', 'string', 'max:255'],
            'category_name' => ['required', 'string', 'max:255'],
            'category_color_name' => ['required', 'string', 'max:255'],
        ];
    }
}
