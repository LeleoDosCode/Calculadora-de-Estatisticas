import { promises } from "dns";

export interface ISaveText{
  saveText: (dados: string) => promise<boolean>;
}

declare global {
  interface Window {
    api: ISaveText;
  }
}
