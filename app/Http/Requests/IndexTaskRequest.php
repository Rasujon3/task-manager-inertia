<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexTaskRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(TaskStatus::class)],
            'priority' => ['nullable', Rule::enum(TaskPriority::class)],
            'sort' => ['nullable', Rule::in(['created_at', 'due_date', 'title'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ];
    }

    /** @return array{search: string, status: string, priority: string, sort: string, direction: string} */
    public function filters(): array
    {
        $v = $this->validated();

        return [
            'search' => $v['search'] ?? '',
            'status' => $v['status'] ?? '',
            'priority' => $v['priority'] ?? '',
            'sort' => $v['sort'] ?? 'created_at',
            'direction' => $v['direction'] ?? 'desc',
        ];
    }
}
