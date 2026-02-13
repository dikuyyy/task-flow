export class ApiResponseDto<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: any;
    timestamp: string;

    constructor(partial: Partial<ApiResponseDto<T>>) {
        Object.assign(this, partial);
    }
}