/*global jQuery, Handlebars, Router */
import { ToDo } from './model/interface';
import { restTodoStorage } from './model/model';
import { localAPI } from './model/model_local';
// import { localAPI } from './model/model_local';

declare const Router: any;
declare const Handlebars: any;
declare const jQuery: any;

const SYNC_LOCAL_STORAGE = false;
const SYNC_REST_API = true;

const storage = SYNC_LOCAL_STORAGE ? localAPI : restTodoStorage;
// const storage = restApi;

jQuery(function ($) {
    'use strict';

    Handlebars.registerHelper('eq', function (a, b, options) {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    var util = {
        uuid: function () {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
            }

            return uuid;
        },
        pluralize: function (count, word) {
            return count === 1 ? word : word + 's';
        },
        store: function (namespace, data?) {
            if (arguments.length > 1) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            } else {
                var store = localStorage.getItem(namespace);
                return (store && JSON.parse(store)) || [];
            }
        }
    };

    var App = {
        init: function () {
            // this.todos = util.store('todos-jquery');
            var self = this;
            storage.getAll().then((todos: ToDo[]) => {
                self.todos = todos;
            // });
                self.todoTemplate = Handlebars.compile($('#todo-template').html());
                self.footerTemplate = Handlebars.compile($('#footer-template').html());
                self.bindEvents();

                new Router({
                    '/:filter': function (filter) {
                        this.filter = filter;
                        this.render();
                    }.bind(this)
                }).init('/all');
             }
            );
            $('#test').on('click', (event) => storage.toggleAll(this.todos).then(this.render));
        },
        bindEvents: function () {
            $('#new-todo').on('keyup', this.create.bind(this));
            $('#toggle-all').on('change', this.toggleAll(this));
            $('#footer').on('click', '#clear-completed', this.destroyCompleted.bind(this));
            $('#todo-list')
                .on('change', '.toggle', this.toggle.bind(this))
                .on('dblclick', 'label', this.edit.bind(this))
                .on('keyup', '.edit', this.editKeyup.bind(this))
                .on('focusout', '.edit', this.update.bind(this))
                .on('click', '.destroy', this.destroy.bind(this));

        },
        render: function () {
            var self = this;
            storage.getAll().then((todosList) => {
                self.todos = todosList;
            // });
                var todos = self.getFilteredTodos();
                $('#todo-list').html(self.todoTemplate(todos));
                $('#main').toggle(todos.length > 0);
                $('#toggle-all').prop('checked', self.getActiveTodos().length === 0);
                self.renderFooter();
                $('#new-todo').focus();
                // util.store('todos-jquery', this.todos);
            });
        },
        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.getActiveTodos().length;
            var template = this.footerTemplate({
                activeTodoCount: activeTodoCount,
                activeTodoWord: util.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount,
                filter: this.filter
            });

            $('#footer').toggle(todoCount > 0).html(template);
        },
        toggleAll: function (e) {
            // var isChecked = $(e.target).prop('checked');
            //
            // this.todos.forEach(function (todo) {
            //     todo.completed = isChecked;
            // });
            storage.toggleAll(this.todos).then(this.render);

            this.render();
        },
        getActiveTodos: function () {
            return this.todos.filter(function (todo) {
                return !todo.completed;
            });
        },
        getCompletedTodos: function () {
            return this.todos.filter(function (todo) {
                return todo.completed;
            });
        },
        getFilteredTodos: function () {
            if (this.filter === 'active') {
                return this.getActiveTodos();
            }

            if (this.filter === 'completed') {
                return this.getCompletedTodos();
            }

            return this.todos;
        },
        destroyCompleted: function () {
            // this.todos = this.getActiveTodos();
            storage.destroyCompleted(this.todos).then(this.render);
            this.filter = 'all';
            this.render();
        },
        // accepts an element from inside the `.item` div and
        // returns the corresponding index in the `todos` array
        indexFromEl: function (el): number {
            var id = $(el).closest('li').data('id');
            var todos = this.todos;
            var i = todos.length;

            while (i--) {
                if (todos[i].id === id) {
                    return i;
                }
            }
        },
        create: function (e) {
            var $input = $(e.target);
            var val = $input.val().trim();

            if (e.which !== ENTER_KEY || !val) {
                return;
            }

            // this.todos.push({
            //     id: util.uuid(),
            //     title: val,
            //     completed: false
            // } as ToDo);

            storage.create({
                id: util.uuid(),
                title: val,
                completed: false
            } as ToDo).then(this.render);

            $input.val('');

            this.render();
        },
        toggle: function (e) {
            var i = this.indexFromEl(e.target);
            // this.todos[i].completed = !this.todos[i].completed;
            storage.toggle(this.todos[i]).then(this.render);
            this.render();
        },
        edit: function (e) {
            var $input = $(e.target).closest('li').addClass('editing').find('.edit');
            $input.val($input.val()).focus();
        },
        editKeyup: function (e) {
            if (e.which === ENTER_KEY) {
                e.target.blur();
            }

            if (e.which === ESCAPE_KEY) {
                $(e.target).data('abort', true).blur();
            }
        },
        update: function (e) {
            var el = e.target;
            var $el = $(el);
            var val = $el.val().trim();

            if (!val) {
                this.destroy(e);
                return;
            }

            if ($el.data('abort')) {
                $el.data('abort', false);
            } else {
                // this.todos[this.indexFromEl(el)].title = val;
                this.todos[this.indexFromEl(el)].title = val;
                storage.edit(this.todos).then(this.render);
            }

            this.render();
        },
        destroy: function (e) {
            // this.todos.splice(this.indexFromEl(e.target), 1);
            const todosIndex = this.indexFromEl(e.target);
            storage.destroy(this.todos[todosIndex]).then(this.render);
        }
    };

    App.init();
});
