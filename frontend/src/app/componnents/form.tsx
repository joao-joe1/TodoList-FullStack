"use client";
import { Edit, Delete } from "lucide-react";
import React, { useRef } from "react";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  created_at: string;
  status: string;
}

export function Form() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const inputTask = useRef<HTMLInputElement>(null);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const postTitle = async (event: React.FormEvent) => {
    event.preventDefault();
    const task = {
      title: inputTask.current?.value,
    };
    await fetch("http://localhost:3333/tasks", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    window.location.reload();
  };

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

  return (
    <main>
      <form className="add-form">
        <input
          type="text"
          placeholder="Adicionar tarefa"
          className="input-task"
          ref={inputTask}
        ></input>
        <button type="submit" onClick={postTitle}>
          +
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
              <td>{task.title}</td>
              <td>
                {new Date(task.created_at).toLocaleString("pt-br", options)}
              </td>
              <td>
                <select>
                  <option value="pendente">pendente</option>
                  <option value="em andamento">em andamento</option>
                  <option value="concluída">concluída</option>
                </select>
              </td>
              <td>
                <button className="btn-action">
                  <span>
                    <Edit />
                  </span>
                </button>

                <button className="btn-action">
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
