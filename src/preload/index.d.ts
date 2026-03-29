export interface IApi{
  saveText: (dados: string) => Promise<boolean>;
  importCSV: () => Promise<string | null>;
}

declare global {
  interface Window {
    api: IApi;
  }
}
