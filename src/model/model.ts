import { ToDo, TodoStorage } from './interface';

declare const jQuery: any;


export const restTodoStorage: TodoStorage = {
    getAll: () => {
        return jQuery.ajax({
            method: 'GET',
            url: 'http://localhost:3000/todos'
        });
    },
    create: (todo: ToDo): Promise<void> => {
        return jQuery.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            data: todo
        });
    },
    toggle: (todo: ToDo): Promise<void> => {
        todo.completed = todo.completed;
        return jQuery.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    },
    edit: (todo: ToDo): Promise<void> => {
        return jQuery.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    },
    toggleAll: (todos: ToDo[]): Promise<void> => {
        const todosList = todos.map((todo) => {todo.completed = !todo.completed; return todo;});
        const todosPromises: Array<Promise<void>> = todosList.map((todo) =>
            jQuery.ajax({
                method: 'PUT',
                url: `http://localhost:3000/todos/${todo.id}`,
                data: todo
            }) as Promise<void>);
        return Promise.all(todosPromises).then((responses) => responses[0]);
    },
    destroyCompleted: (todos: ToDo[]): Promise<void> => {
        const todosPromises: Array<Promise<void>> = [];
        todos.forEach((todo) => {
            if (todo.completed) {
                todosPromises.push(jQuery.ajax({
                    method: 'DELETE',
                    url: `http://localhost:3000/todos/${todo.id}`,
                    data: todo
                }) as Promise<void>);
            }
        });
        return Promise.all(todosPromises).then((responses) => responses[0]);
    },
    destroy: (todo: ToDo): Promise<void> => {
        return jQuery.ajax({
            method: 'DELETE',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    }
};