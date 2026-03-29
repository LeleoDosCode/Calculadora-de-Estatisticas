import { promises } from "dns";

export interface IApi{
  saveText: (dados: string) => promise<boolean>;
}

declare global {
  interface Window {
    api: IApi;
  }
}
