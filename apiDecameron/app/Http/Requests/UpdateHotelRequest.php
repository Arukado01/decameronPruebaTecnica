<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHotelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // el parámetro {hotel} puede ser string o instancia
        $hotelParam = $this->route('hotel');
        $hotelId    = is_object($hotelParam) ? $hotelParam->id : $hotelParam;

        return [
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('hotels', 'name')->ignore($hotelId),
            ],
            'nit'  => [
                'required',
                'string',
                'max:20',
                Rule::unique('hotels', 'nit')->ignore($hotelId),
            ],
            'address'   => 'required|string|max:255',
            'city'      => 'required|string|max:100',
            'max_rooms' => 'required|integer|min:1|max:999',
        ];
    }
}
