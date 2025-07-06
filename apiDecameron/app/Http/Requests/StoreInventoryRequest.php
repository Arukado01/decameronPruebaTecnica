<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Hotel;

class StoreInventoryRequest extends FormRequest
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
        $hotelId = $this->input('hotel_id');

        return [
            'hotel_id'        => 'required|exists:hotels,id',
            'room_type_id'    => 'required|exists:room_types,id',
            'accommodation_id' => 'required|exists:accommodations,id',
            'quantity'        => 'required|integer|min:1|max:' . Hotel::find($hotelId)?->max_rooms,
        ];
    }

    public function messages(): array
    {
        return [
            'quantity.max' => 'La cantidad supera el límite del hotel.',
        ];
    }
}
