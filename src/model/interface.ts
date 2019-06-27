export interface ToDo {
    id: string,
    title: string,
    completed: boolean
}

export interface StorageApi{
    getAll: () => Promise<ToDo[]>,
    create: (todo: ToDo) => Promise<void>,
    toggle: (todo: ToDo) => Promise<void>,
    edit: (todo: ToDo) => Promise<void>,
    toggleAll: (todos: Array<ToDo>) => Promise<void>,
    destroyCompleted: (todos: Array<ToDo>) => Promise<void>,
    destroy: (todo: ToDo) => Promise<void>
}