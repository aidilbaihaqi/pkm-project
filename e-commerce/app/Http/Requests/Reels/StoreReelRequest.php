<?php

namespace App\Http\Requests\Reels;

use Illuminate\Foundation\Http\FormRequest;

class StoreReelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        
        // User must be authenticated and have an UMKM profile
        return $user && 
               ($user->isSeller() || $user->isAdmin()) && 
               $user->umkmProfile;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'video_url' => [
                'nullable',
                'string',
                'max:500',
                'regex:/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+/',
            ],
            'thumbnail_url' => ['nullable', 'string', 'max:500'],
            'product_name' => ['required', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'kategori' => ['required', 'string', 'max:50'],
            'type' => ['nullable', 'string', 'in:video,image'],
            'status' => ['nullable', 'string', 'in:draft,review,published'],
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
            'video_url.regex' => 'URL video harus berupa URL YouTube yang valid (youtube.com/watch, youtu.be, atau youtube.com/shorts)',
            'product_name.required' => 'Nama produk wajib diisi',
            'kategori.required' => 'Kategori wajib diisi',
            'type.in' => 'Tipe harus video atau image',
            'status.in' => 'Status harus draft, review, atau published',
        ];
    }
}
