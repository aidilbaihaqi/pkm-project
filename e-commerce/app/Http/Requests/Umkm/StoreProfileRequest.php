<?php

namespace App\Http\Requests\Umkm;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isSeller();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_toko' => ['required', 'string', 'max:255'],
            'nomor_wa' => [
                'required',
                'string',
                'max:20',
                'regex:/^(08[0-9]{8,12}|628[0-9]{8,12})$/',
            ],
            'alamat' => ['required', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'kategori' => ['required', 'string', 'max:50'],
            'deskripsi' => ['nullable', 'string'],
            'avatar' => ['nullable', 'string'],
            'is_open' => ['nullable', 'boolean'],
            'open_hours' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nomor_wa.regex' => 'Nomor WhatsApp harus dalam format Indonesia (08xx atau 628xx)',
            'latitude.between' => 'Latitude harus antara -90 dan 90',
            'longitude.between' => 'Longitude harus antara -180 dan 180',
        ];
    }
}
