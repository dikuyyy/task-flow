import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoController } from "./controller/todo.controller";
import { TodoService } from "./service/todo.service";
import { GeminiService } from "./service/gemini.service";
import { Todo } from "./entities/todo.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Todo])],
    controllers: [TodoController],
    providers: [TodoService, GeminiService],
})
export class TodoModule {}
