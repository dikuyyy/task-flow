import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

const VALID_USER_IDS = ['user-1', 'user-2', 'user-3', 'admin'];

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const userId = request.headers['x-user-id'] as string;

        if (!userId) {
            throw new UnauthorizedException('Missing x-user-id header');
        }

        if (!VALID_USER_IDS.includes(userId)) {
            throw new UnauthorizedException('Invalid x-user-id');
        }

        (request as any).userId = userId;

        return true;
    }
}

