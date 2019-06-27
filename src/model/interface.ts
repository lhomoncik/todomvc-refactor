export interface ToDo {
    id: string,
    title: string,
    completed: boolean
}

export interface StorageApi{
    create: (ToDo) => void,
    toggle: (ToDo) => void,
    edit: (ToDo) => void,
    toggleAll: () => void,
    destroyCompleted: () => void,
    destroy: (ToDo) => void
}