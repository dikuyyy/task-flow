import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";
import {TodoService} from "../service/todo.service";
import {CreateTodoDto, UpdateTodoDto} from "../dto";
import {GeminiService} from "../service/gemini.service";
import {GenerateRecommendationDto} from "../dto/generate-recommendation.dto";

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService, private readonly geminiService: GeminiService) {}

    @Get()
    findAll(@Query('search') search?: string) {
        return this.todoService.findAll(search);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.findOne(id);
    }

    @Post()
    create(@Body() createTodoDto: CreateTodoDto) {
        return this.todoService.create(createTodoDto);
    }

    @Patch(":id")
    update(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto
    ) {
        return this.todoService.update(id, updateTodoDto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.todoService.delete(id);
    }

    @Post('generate-ai')
    generateAi(@Body() dto: GenerateRecommendationDto) {
        return this.geminiService.generateRecommendation(dto);
    }
}