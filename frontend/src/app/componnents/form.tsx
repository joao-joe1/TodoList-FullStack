"use client";
import { Edit, Delete } from "lucide-react";
import React, { useRef } from "react";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  created_at: string;
  status: string;
  isEditing: boolean;
}

export function Form() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const inputTask = useRef<HTMLInputElement>(null);
  const buttonEdit = useRef<HTMLButtonElement>(null);
  const inputStatus = useRef<(HTMLSelectElement | null)[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  // Criar uma tarefa
  const postTitle = async (event: React.FormEvent) => {
    event.preventDefault();
    const task = {
      title: inputTask.current?.value,
    };
    setIsButtonDisabled(true);
    await fetch("http://localhost:3333/tasks", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    setIsButtonDisabled(true);
    window.location.reload();
  };
  // Pegar tarefas do DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3333/tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  // Deletar uma tarefa
  const deleteTask = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const taskId = event.currentTarget.dataset.id;
    if (taskId)
      try {
        await fetch(`http://localhost:3333/tasks/${taskId}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
  };
  // Atualizar uma tarefa
  const putTaskSelect = async (
    taskId: number,
    taskTitle: string,
    taskCreated: string,
    taskStatus: string
  ) => {
    const newStatus = inputStatus.current[taskId]?.value;

    const updatedTask = {
      title: taskTitle,
      status: newStatus,
    };

    if (taskId) {
      try {
        await fetch(`http://localhost:3333/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });
        // window.location.reload();
      } catch (error) {
        console.error(error);
      }
      window.location.reload();
    }
  };

  return (
    <main>
      <form className="add-form">
        <input
          type="text"
          placeholder="Adicionar tarefa"
          className="input-task"
          disabled={isButtonDisabled}
          ref={inputTask}
        ></input>
        <button type="submit" onClick={postTitle}>
          {isButtonDisabled ? "..." : "+"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>N° Tarefa</th>
            <th>Tarefa</th>
            <th>Criada em</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {tasks?.map((task: Task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>
                {task.isEditing ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(event) => {
                      const updatedTasks = tasks.map((t) => {
                        if (t.id === task.id) {
                          return { ...t, title: event.target.value };
                        }
                        return t;
                      });
                      setTasks(updatedTasks);
                    }}
                  />
                ) : (
                  task.title
                )}
              </td>
              <td>
                {new Date(task.created_at).toLocaleString("pt-br", options)}
              </td>
              <td>
                <select
                  onChange={() =>
                    putTaskSelect(
                      task.id,
                      task.title,
                      task.created_at,
                      task.status
                    )
                  }
                  ref={(el) => (inputStatus.current[task.id] = el)}
                  value={task.status}
                >
                  <option value="pendente">pendente</option>
                  <option value="em andamento">em andamento</option>
                  <option value="concluída">concluída</option>
                </select>
              </td>
              <td>
                <button
                  data-id={task.id}
                  ref={buttonEdit}
                  className="btn-action"
                  onClick={() => {
                    const updatedTask = tasks.map((task) => {
                      if (task.id === task.id) {
                        return { ...task, isEditing: true };
                      }
                      return task;
                    });
                    setTasks(updatedTask);
                  }}
                >
                  <span>
                    <Edit />
                  </span>
                </button>

                <button
                  className="btn-action"
                  data-id={task.id}
                  onClick={deleteTask}
                >
                  <span>
                    <Delete />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
