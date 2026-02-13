import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export enum TodoStatus {
    CREATED = 'created',
    IN_PROGRESS = 'on_going',
    COMPLETED = 'completed',
    PROBLEM = 'problem'
}

@Entity('todos')
export class Todo{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({
        type: 'enum',
        enum: TodoStatus,
        default: TodoStatus.COMPLETED
    })
    status: TodoStatus;

    @Column({
        type: 'text',
        nullable: true
    })
    problem_desc: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}