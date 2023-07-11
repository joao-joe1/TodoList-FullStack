const connection = require('./connection')

const getAll = async () => {
    // Obtém todas as tarefas do banco de dados
    const [tasks] = await connection.execute('SELECT * FROM tasks ORDER BY `id` desc')
    return tasks;
}


const createTask = async (task) => {
    // Extrai o título da tarefa do objeto passado como parâmetro
    const { title } = task;

    // Obtém a data atual em formato UTC
    const DateUTC = new Date(Date.now()).toUTCString()

    // Insere uma nova tarefa no banco de dados
    // const query = 'INSERT INTO tasks(title, status, created_at) VALUES (?, ?, ?)'
    const [createdTask] = await connection.execute('INSERT INTO tasks(title, status, created_at) VALUES (?, ?, ?)', [title, 'pendente', DateUTC])

    // Retorna o ID da tarefa criada
    return { insertId: createdTask.insertId }
}


const deleteTask = async (id) => {
    // Exclui uma tarefa do banco de dados com base no ID fornecido
    const [removedTask] = await connection.execute('DELETE FROM tasks WHERE id = ?', [id])
    return removedTask;
}


const updateTask = async (id, task) => {
    const { title, status } = task;

    const [updatedTask] = await connection.execute('UPDATE tasks SET title = ?, status = ? WHERE id = ?', [title, status, id])
    return updatedTask
}

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask,
}
