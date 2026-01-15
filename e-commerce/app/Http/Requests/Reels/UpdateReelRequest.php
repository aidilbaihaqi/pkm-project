<?php

namespace App\Http\Requests\Reels;

use App\Models\Reel;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        
        if (!$user || !($user->isSeller() || $user->isAdmin())) {
            return false;
        }

        // Check if the reel belongs to the user's UMKM profile
        $reel = $this->route('reel');
        
        if ($reel instanceof Reel) {
            return $user->umkmProfile && $reel->umkm_profile_id === $user->umkmProfile->id;
        }

        // If reel is an ID, fetch it
        $reelModel = Reel::find($reel);
        
        return $reelModel && 
               $user->umkmProfile && 
               $reelModel->umkm_profile_id === $user->umkmProfile->id;
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
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable', 'string'],
            'product_name' => ['sometimes', 'required', 'string', 'max:255'],
            'caption' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'kategori' => ['sometimes', 'required', 'string', 'max:50'],
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
