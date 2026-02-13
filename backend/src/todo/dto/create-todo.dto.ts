import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty({message: 'Title is required'})
    @MinLength(3, {message: 'Title must be at least 1 character'})
    @MaxLength(255, {message: 'Title must not exceed 255 character'})
    title: string;
}