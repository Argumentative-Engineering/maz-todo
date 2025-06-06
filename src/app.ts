import path from "node:path";
import os from "node:os";
import fs from "node:fs"
import { shell } from "electron";

export const GET_APP_PATH = (): string => {
    if (!fs.existsSync(APP_PATH)) {
        fs.mkdirSync(APP_PATH, {recursive: true})
    }

    return APP_PATH
}

export const APP_PATH = path.join(os.homedir(), 'basictodo');
export const TASKS_PATH = path.join(GET_APP_PATH(), 'tasks.json');
export const SETTINGS_PATH = path.join(GET_APP_PATH(), 'settings.json');

export const openAppFolder = () => {
    console.log('openin')
    shell.openPath(GET_APP_PATH())
}
