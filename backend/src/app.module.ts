import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoModule } from "./todo/todo.module";
import { Todo } from "./todo/entities/todo.entity";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: parseInt(process.env.DB_PORT) || 5432,
            username: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD || "root",
            database: process.env.DB_NAME || "todo_db",
            entities: [Todo],
            synchronize: true, // Auto-create tables (disable in production)
        }),
        TodoModule,
    ],
})
export class AppModule {}
