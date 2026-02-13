import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import {ResponseInterceptor} from "./common/interceptor/response.interceptor";
import {AuthGuard} from "./common/guard/auth.guard";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend access
    app.enableCors({
        origin: ["http://localhost:3000", "http://localhost:5173", "http://frontend:5173"],
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "x-user-id"],
        credentials: true,
    });

    // Enable global auth guard
    app.useGlobalGuards(new AuthGuard());

    // Enable validation pipe for DTO validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    // Set global prefix for API routes
    app.setGlobalPrefix("api");
    app.useGlobalInterceptors(new ResponseInterceptor())

    await app.listen(3001);
    console.log("Backend running on http://localhost:3001");
}
bootstrap();
