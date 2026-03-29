import { contextBridge, ipcMain, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api',{
  saveText: (dados: string) =>{
    return ipcRenderer.invoke('saveText', dados);
  },
});