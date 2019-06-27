import { ToDo, StorageApi } from '../model/interface';

const loadFromLocalStorage = (): ToDo[] =>
    JSON.parse(localStorage.getItem('todos-jquery'))


export const localAPI: StorageApi = {
    getAll: ()=> {
        const todos = loadFromLocalStorage()
        return Promise.resolve(todos);
    },
    create: (e: ToDo)=> {
        return localStorage.setItem(e.id, e.title);
    },
    toggle: (e: ToDo) => {
        this.edit(e);
    },
    edit: (e: ToDo) => {
        localStorage.setItem(e.id,e.title);
    },
    toggleAll: (e: ToDo[]) => {
        const all = loadFromLocalStorage();
        all.forEach((item)=>{
            if(item.completed === false) {
                item.completed = true;
            }
        })
    },
    destroyCompleted: (e: ToDo[]) => {
        const all = loadFromLocalStorage();
        all.forEach((item)=>{
            if(item.completed === true) {
                localStorage.removeItem('completed');
            }
        })

    },
    destroy: (todo: ToDo) => {

    }
}

