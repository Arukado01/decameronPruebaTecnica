<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHotelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'      => 'required|string|max:150|unique:hotels,name',
            'nit'       => 'required|string|max:20|unique:hotels,nit',
            'address'   => 'required|string|max:255',
            'city'      => 'required|string|max:100',
            'max_rooms' => 'required|integer|min:1|max:999',
        ];
    }
}
