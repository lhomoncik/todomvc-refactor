"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.restApi = {
    getAll: function () {
        return jQuery.ajax({
            method: 'GET',
            url: 'http://localhost:3000/todos'
        });
    },
    create: function (todo) {
        return jQuery.ajax({
            method: 'POST',
            url: 'http://localhost:3000/todos',
            data: todo
        });
    },
    toggle: function (todo) {
        todo.completed = todo.completed;
        return _this.edit(todo);
    },
    edit: function (todo) {
        return jQuery.ajax({
            method: 'PUT',
            url: "http://localhost:3000/todos/" + todo.id,
            data: todo
        });
    },
    toggleAll: function (todos) {
        var todosList = todos.map(function (todo) { return todo.completed = !todo.completed; });
        var todos2 = todosList.map(function (todos) { return _this.edit(todos); });
        return Promise.all(todos2);
    },
    destroyCompleted: function (todos) {
        todos.forEach(function (todo) {
            if (todo.completed) {
                _this.destroy(todo);
            }
        });
    },
    destroy: function (todo) {
        return jQuery.ajax({
            method: 'DELETE',
            url: "http://localhost:3000/todos/" + todo.id,
            data: todo
        });
    }
};
