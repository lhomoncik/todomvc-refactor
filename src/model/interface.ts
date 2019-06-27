export interface ToDo {
    id: string,
    title: string,
    completed: boolean
}

export interface StorageApi{
    getAll: () => Promise<ToDo[]>,
    create: (ToDo) => void,
    toggle: (ToDo) => void,
    edit: (ToDo) => void,
    toggleAll: (Array) => void,
    destroyCompleted: (Array) => void,
    destroy: (ToDo) => void
}