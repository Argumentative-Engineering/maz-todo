// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer} from 'electron';
import { Task } from './tasks';

contextBridge.exposeInMainWorld('todoAPI', {
    loadTasks: () => ipcRenderer.invoke('load-tasks'),
    saveTasks: (tasks: Task[]) => ipcRenderer.send('save-tasks', tasks),
});

contextBridge.exposeInMainWorld('windowAPI', {
    toggleOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
});
