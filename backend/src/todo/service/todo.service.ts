import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Todo, TodoStatus} from "../entities/todo.entity";
import {ILike, Like, Repository} from "typeorm";
import {CreateTodoDto, UpdateTodoDto} from "../dto";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: Repository<Todo>
    ) {}

    async findAll(search?: string): Promise<Todo[]> {
        if(search) {
            return this.todoRepository.find({
                where: {
                    title: ILike(`%${search}%`)
                },
                order: {
                    created_at: 'DESC'
                }
            })
        }

        return this.todoRepository.find({
            order: {
                created_at: 'DESC'
            }
        })
    }

    async findOne(id: number): Promise<Todo> {
        const todo = await this.todoRepository.findOne({where: {id}})
        if (!todo) {
            throw new NotFoundException("Todo with id " + id + ' does not exist');
        }

        return todo;
    }

    async create(dto: CreateTodoDto): Promise<Todo> {
        const todo = this.todoRepository.create({
            ...dto,
            status: TodoStatus.CREATED
        })

        return this.todoRepository.save(todo);
    }

    async update(id: number, dto: UpdateTodoDto): Promise<Todo> {
        const todo = await this.todoRepository.findOne({where: {id}})
        if(dto.status !== TodoStatus.PROBLEM) {
            dto.problem_desc = null
        }

        Object.assign(todo, dto);

        return this.todoRepository.save(todo);
    }

    async delete(id: number): Promise<void> {
        const todo = await this.findOne(id);
        await this.todoRepository.remove(todo);
    }

}