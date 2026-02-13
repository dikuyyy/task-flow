export type TodoStatus = "created" | "on_going" | "completed" | "problem";

export interface ApiResponse<T> {
    data: T,
    message?: string,
    success?: boolean,
    timestamp?: string
}

export interface Todo {
    id: number;
    title: string;
    status: TodoStatus;
    problem_desc: string | null;
    created_at: string;
    updated_at: string;
}


export interface CreateTodoDto {
    title: string;
}

export interface UpdateTodoDto {
    status: TodoStatus;
    problem_desc?: string | null;
}

export interface GenerateAi {
    title: string;
    problemDesc: string | null;
}