import axios from "axios";
import {ApiResponse, CreateTodoDto, GenerateAi, Todo, UpdateTodoDto} from "./types.ts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const USER_ID = "user-1";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        "x-user-id": USER_ID,
    }
})

export const todoApi = {
    getAll: async (search?: string): Promise<ApiResponse<Todo[]>> => {
        const params = search ? {search} : {};
        const response = await api.get<ApiResponse<Todo[]>>("/todos", {
            params
        });
        return response.data;
    },

    getDetail: async (id: number): Promise<ApiResponse<Todo>> => {
        const response = await api.get<ApiResponse<Todo>>(`/todos/${id}`);
        return response.data;
    },

    create: async (data: CreateTodoDto): Promise<ApiResponse<Todo>> => {
        const response = await api.post(`/todos`, data);
        return response.data;
    },

    update: async (id: number, data: UpdateTodoDto) => {
        const response = await api.patch(`/todos/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    },

    generateRecommendation: async (data: GenerateAi): Promise<ApiResponse<{ recommendation: string }>> => {
        const response = await api.post('/todos/generate-ai', data)
        return response.data;
    }
}