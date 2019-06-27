import { StorageApi, ToDo } from './interface';

declare const jQuery: any;


export const restApi: StorageApi = {
    getAll: () => {
        return jQuery.ajax({
            method: 'GET',
            url: 'http://localhost:3000/todos'
        });
    },
    create: (todo: ToDo) => {
        return jQuery.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            data: todo
        });
    },
    toggle: (todo: ToDo) => {
        todo.completed = todo.completed;
        return this.edit(todo);
    },
    edit: (todo: ToDo) => {
        return jQuery.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    },
    toggleAll: (todos: ToDo[]) => {
        const todosList = todos.map((todo) => todo.completed = !todo.completed);
        const todos2: Promise<Array> = todosList.map((todos) => this.edit(todos));
        return Promise.all(todos2);
    },
    destroyCompleted: (todos: ToDo[]) => {
        todos.forEach((todo) => {
            if (todo.completed) {
                this.destroy(todo);
            }
        });
    },
    destroy: (todo: ToDo) => {
        return jQuery.ajax({
            method: 'DELETE',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    }
};