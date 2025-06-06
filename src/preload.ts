import { contextBridge, ipcRenderer} from 'electron';
import { Task } from './tasks';

contextBridge.exposeInMainWorld('todoAPI', {
    loadTasks: () => ipcRenderer.invoke('load-tasks'),
    saveTasks: (tasks: Task[]) => ipcRenderer.send('save-tasks', tasks),
});

contextBridge.exposeInMainWorld('appAPI', {
    toggleOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
    openAppFolder: () => ipcRenderer.send('open-app-folder'),
});
