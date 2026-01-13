<?php

namespace App\Http\Requests\Reels;

use Illuminate\Foundation\Http\FormRequest;

class FeedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Feed is public, no authentication required
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
            'umkm_id' => ['nullable', 'integer', 'exists:umkm_profiles,id'],
            'lat' => ['required_without:umkm_id', 'nullable', 'numeric', 'between:-90,90'],
            'lng' => ['required_without:umkm_id', 'nullable', 'numeric', 'between:-180,180'],
            'radius' => ['nullable', 'numeric', 'min:0.1', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
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
            'lat.required' => 'Latitude wajib diisi',
            'lat.numeric' => 'Latitude harus berupa angka',
            'lat.between' => 'Latitude harus antara -90 dan 90',
            'lng.required' => 'Longitude wajib diisi',
            'lng.numeric' => 'Longitude harus berupa angka',
            'lng.between' => 'Longitude harus antara -180 dan 180',
            'radius.numeric' => 'Radius harus berupa angka',
            'radius.min' => 'Radius minimal 0.1 km',
            'radius.max' => 'Radius maksimal 100 km',
            'per_page.integer' => 'Per page harus berupa angka bulat',
            'per_page.min' => 'Per page minimal 1',
            'per_page.max' => 'Per page maksimal 50',
        ];
    }

    /**
     * Get default values for optional parameters.
     */
    public function getRadius(): float
    {
        return (float) $this->input('radius', 10);
    }

    public function getPerPage(): int
    {
        return (int) $this->input('per_page', 15);
    }

    public function getPage(): int
    {
        return (int) $this->input('page', 1);
    }
}
