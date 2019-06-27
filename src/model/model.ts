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
        jQuery.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            data: todo
        });
    },
    toggle: (todo: ToDo) => {
        todo.completed = todo.completed;
        this.edit(todo);
    },
    edit: (todo: ToDo) => {
        jQuery.ajax({
            method: 'PUT',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    },
    toggleAll: (todos: ToDo[]) => {
        todos.map((todo) => todo.completed = !todo.completed);
        todos.forEach((todo) => this.edit(todo));
    },
    destroyCompleted: (todos: ToDo[]) => {
        todos.forEach((todo) => {
            if (todo.completed) {
                this.destroy(todo);
            }
        });
    },
    destroy: (todo: ToDo) => {
        jQuery.ajax({
            method: 'DELETE',
            url: `http://localhost:3000/todos/${todo.id}`,
            data: todo
        });
    }
};