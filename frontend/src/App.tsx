import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {todoApi} from "./api.ts";
import {Todo, TodoStatus} from "./types.ts";
import * as React from "react";

function App() {
    const queryClient = useQueryClient();
    const [newTitle, setNewTitle] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
    const [editStatus, setEditStatus] = useState<TodoStatus>('created');
    const [editProblemDesc, setEditProblemDesc] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [aiRecommendation, setAiRecommendation] = useState('');
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [selectedTodoForAi, setSelectedTodoForAi] = useState<Todo | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500)

        return () => clearTimeout(handler);
    }, [search]);

    const {
        data: todos = [],
        isLoading,
        error
    } = useQuery({
        queryKey: ["todos", debouncedSearch],
        queryFn: () => todoApi.getAll(debouncedSearch || undefined),
        select: (response) => Array.isArray(response?.data) ? response.data : []
    })

    const createMutation = useMutation({
        mutationFn: todoApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(
                {queryKey: ["todos"]}
            )

            setNewTitle('');
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id,data }: { id: number; data: { status: TodoStatus; problem_desc?: string }; }) => todoApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["todos"]});
        },
    });

    const deleteMutation = useMutation({
        mutationFn: todoApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["todos"]})
        }
    })

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTitle.trim()) {
            createMutation.mutate({title: newTitle.trim()});
        }
    }

    const openDetailModal = async (id: number) => {
        setIsLoadingDetail(true);
        setIsModalOpen(true);
        try {
            const response = await todoApi.getDetail(id);
            console.log(response);
            const detail = response?.data;
            setSelectedTodo(detail);
            setEditStatus(detail?.status || 'created');
            setEditProblemDesc(detail?.problem_desc ?? '');
        } catch (error) {
            console.error("failed to add detail", error);
        } finally {
            setIsLoadingDetail(false);
        }
    }

    const handleStatusChange = async (todo: Todo, newStatus: TodoStatus) => {
        if (newStatus === 'problem') {
            await openDetailModal(todo.id)
        } else {
            updateMutation.mutate({
                id: todo.id,
                data: {
                    status: newStatus
                }
            })
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTodo(null);
        setEditStatus("created");
        setEditProblemDesc("");
    };

    const handleSaveModal = () => {
        if (selectedTodo) {
            updateMutation.mutate({
                id: selectedTodo.id,
                data: {
                    status: editStatus,
                    problem_desc: editStatus === 'problem' ? editProblemDesc : undefined
                }
            })
        }
        closeModal();
    }

    const getStatusClass = (status: TodoStatus) => {
        return `status-badge status-${status}`;
    };

    const formatStatus = (status: TodoStatus) => {
        return status.replace("_", " ");
    };

    const handleGenerateAi = async (todo: Todo) => {
        setSelectedTodoForAi(todo);
        setIsAiModalOpen(true);
        setIsGeneratingAi(true);
        setAiRecommendation('');

        try {
            const response = await todoApi.generateRecommendation({
                title: todo.title,
                problemDesc: todo.problem_desc,
            });
            setAiRecommendation(response.data.recommendation);
        } catch (error) {
            console.error("Failed to generate AI recommendation", error);
            setAiRecommendation("Maaf, gagal menghasilkan rekomendasi AI. Silakan coba lagi.");
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const closeAiModal = () => {
        setIsAiModalOpen(false);
        setSelectedTodoForAi(null);
        setAiRecommendation('');
    };

    return (
        <div className="container">
            <h1>Todo App</h1>

            <form className="add-form" onSubmit={handleAddTodo}>
                <input
                    type="text"
                    placeholder="Enter new todo..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={createMutation.isPending || !newTitle.trim()}
                >
                    {createMutation.isPending ? "Adding..." : "Add"}
                </button>
            </form>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {error && (
                <div className="error">
                    Error loading todos: {(error as Error).message}
                </div>
            )}

            {createMutation.isError && (
                <div className="error">
                    Error creating todo: {(createMutation.error as Error).message}
                </div>
            )}

            {isLoading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading todos...</p>
                </div>
            ) : todos.length === 0 ? (
                <div className="empty-state">
                    <p>No todos found. Add your first todo above!</p>
                </div>
            ) : (
                <div className="todo-table">
                    <table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {todos.map((todo, index) => (
                            <tr key={todo.id}>
                                <td>{index + 1}</td>
                                <td>{todo.title}</td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={todo.status}
                                        onChange={(e) =>
                                            handleStatusChange(todo, e.target.value as TodoStatus)
                                        }
                                        disabled={updateMutation.isPending}
                                    >
                                        <option value="created">Created</option>
                                        <option value="on_going">On Going</option>
                                        <option value="completed">Completed</option>
                                        <option value="problem">Problem</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="action-btn btn-detail"
                                        onClick={() => openDetailModal(todo.id)}
                                    >
                                        Detail
                                    </button>
                                    <button
                                        className="action-btn btn-delete"
                                        onClick={() => deleteMutation.mutate(todo.id)}
                                        disabled={deleteMutation.isPending}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="action-btn btn-ai"
                                        onClick={() => handleGenerateAi(todo)}
                                        disabled={isGeneratingAi || todo.status !== 'problem'}
                                        style={{
                                            cursor: (isGeneratingAi || todo.status !== 'problem') ? 'not-allowed' : 'pointer',
                                            backgroundColor: todo.status !== 'problem' ? '#999' : ''
                                        }}
                                    >
                                        AI Generate
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Todo Detail</h2>

                        {isLoadingDetail ? (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                                <p>Loading detail...</p>
                            </div>
                        ) : selectedTodo ? (
                            <>
                                <div className="modal-content">
                                    <p>
                                        <strong>Title:</strong> {selectedTodo.title}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span className={getStatusClass(selectedTodo.status)}>
                      {formatStatus(selectedTodo.status)}
                    </span>
                                    </p>

                                    <div style={{marginTop: "15px"}}>
                                        <label>Update Status:</label>
                                        <select
                                            className="status-select"
                                            value={editStatus}
                                            onChange={(e) =>
                                                setEditStatus(e.target.value as TodoStatus)
                                            }
                                            style={{width: "100%", marginTop: "5px"}}
                                        >
                                            <option value="created">Created</option>
                                            <option value="on_going">On Going</option>
                                            <option value="completed">Completed</option>
                                            <option value="problem">Problem</option>
                                        </select>
                                    </div>

                                    {editStatus === "problem" && (
                                        <div style={{marginTop: "15px"}}>
                                            <label>Problem Description:</label>
                                            <textarea
                                                value={editProblemDesc}
                                                onChange={(e) => setEditProblemDesc(e.target.value)}
                                                placeholder="Describe the problem..."
                                            />
                                        </div>
                                    )}

                                    {selectedTodo.problem_desc && (
                                        <p style={{marginTop: "15px"}}>
                                            <strong>Current Problem:</strong>{" "}
                                            {selectedTodo.problem_desc}
                                        </p>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-save"
                                        onClick={handleSaveModal}
                                        disabled={updateMutation.isPending}
                                    >
                                        {updateMutation.isPending ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="error">Failed to load todo detail</div>
                        )}
                    </div>
                </div>
            )}

            {isAiModalOpen && (
                <div className="modal-overlay" onClick={closeAiModal}>
                    <div className="modal modal-ai" onClick={(e) => e.stopPropagation()}>
                        <h2>AI Recommendation</h2>

                        {selectedTodoForAi && (
                            <div className="modal-content">
                                <p>
                                    <strong>Todo:</strong> {selectedTodoForAi.title}
                                </p>

                                <p>
                                    <strong>Problem Desc: </strong> {selectedTodoForAi.problem_desc}
                                </p>

                                <div style={{ marginTop: "20px" }}>
                                    <strong>Rekomendasi AI:</strong>
                                    {isGeneratingAi ? (
                                        <div className="loading" style={{ marginTop: "15px" }}>
                                            <div className="loading-spinner"></div>
                                            <p>Generating AI recommendation...</p>
                                        </div>
                                    ) : (
                                        <div className="ai-recommendation-content">
                                            <p style={{ whiteSpace: "pre-line", marginTop: "10px" }}>
                                                {aiRecommendation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={closeAiModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
