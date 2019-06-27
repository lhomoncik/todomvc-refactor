export interface ToDo {
    id: string,
    title: string,
    completed: boolean
}

export interface StorageApi{
    getAll: () => Promise<ToDo[]>,
    create: (ToDo) => Promise<void>,
    toggle: (ToDo) => Promise<void>,
    edit: (ToDo) => Promise<void>,
    toggleAll: (Array) => Promise<void>,
    destroyCompleted: (Array) => Promise<void>,
    destroy: (ToDo) => Promise<void>
}