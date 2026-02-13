import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {ApiResponseDto} from "../../todo/dto/api-response.dto";
import {map, Observable} from "rxjs";

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponseDto<T>>
{
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponseDto<T>> | Promise<Observable<ApiResponseDto<T>>> {
        return next.handle().pipe(
            map((data) => {
                return new ApiResponseDto<T>({
                    success: true,
                    message: 'success',
                    data,
                    timestamp: new Date().toISOString()
                })
            })
        )
    }
}