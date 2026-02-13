import {IsEnum, IsOptional, IsString, MaxLength} from "class-validator";
import {TodoStatus} from "../entities/todo.entity";

export class UpdateTodoDto {
    @IsEnum(TodoStatus, {
        message: 'Status must be one of: created, on_going, complete, problem'
    })
    status: TodoStatus;

    @IsOptional()
    @IsString()
    @MaxLength(1000,
        {
            message: 'Problem description must not exceed 1000 character'
        })
    problem_desc: string
}