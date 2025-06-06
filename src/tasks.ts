import path from "node:path";
import fs from "node:fs";

export type Task = {
    id: string,
    content: string,
    category: string,
    dateAdded: Date,
    isDone: boolean
    doneAt: Date,
}

export const load = (): Task[] => {
    const fpath = path.join(require('os').homedir(), 'maztodo.json');

    try {
        if (!fs.existsSync(fpath)) return [];
        const data = fs.readFileSync(fpath, 'utf-8');
        return JSON.parse(data) as Task[];
    } catch (err) {
        console.error('error reading todo file', err);
        return [];
    }
}

export const save = (tasks: Task[]) => {
    const fpath = path.join(require('os').homedir(), 'maztodo.json');
    fs.writeFile(fpath, JSON.stringify(tasks, null, 2), err => {
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

