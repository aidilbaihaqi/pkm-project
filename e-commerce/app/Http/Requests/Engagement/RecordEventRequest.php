<?php

namespace App\Http\Requests\Engagement;

use App\Models\EngagementEvent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Request validation for recording engagement events.
 * Requirements: 5.1
 */
class RecordEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Engagement events can be recorded by anyone (public endpoint).
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
            'event_type' => [
                'required',
                'string',
                Rule::in(EngagementEvent::VALID_TYPES),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $validTypes = implode(', ', EngagementEvent::VALID_TYPES);
        
        return [
            'event_type.required' => 'Tipe event wajib diisi',
            'event_type.in' => "Tipe event harus salah satu dari: {$validTypes}",
        ];
    }

    /**
     * Get the user identifier for throttling.
     * Uses IP address as fallback if user is not authenticated.
     */
    public function getUserIdentifier(): string
    {
        $user = $this->user();
        
        if ($user) {
            return 'user:' . $user->id;
        }

        return 'ip:' . $this->ip();
    }
}
