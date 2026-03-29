import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api',{
  saveText: (dados: string) =>{
    return ipcRenderer.invoke('saveText', dados);
  },
  importCSV: () => {
    return ipcRenderer.invoke('importCSV');
  },
});