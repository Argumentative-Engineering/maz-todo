import fs from "node:fs";
import { TASKS_PATH } from "./app";

export type Task = {
    id: string,
    content: string,
    category: string,
    dateAdded: Date,
    isDone: boolean
    doneAt: Date,
    
    orderInCategory: number;

    hidden: boolean,
}

export const load = (): Task[] => {
    try {
        if (!fs.existsSync(TASKS_PATH)) return [];
        const data = fs.readFileSync(TASKS_PATH, 'utf-8');
        return JSON.parse(data) as Task[];
    } catch (err) {
        console.error('error reading todo file', err);
        return [];
    }
}

export const save = (tasks: Task[]) => {
    fs.writeFile(TASKS_PATH, JSON.stringify(tasks, null, 2), err => {
        if (err) {
            console.error('error saving file', err)
            return false;
        } else {
            console.log('saved todo file successfully')
            return true;
        }
    });
    return false;
}
