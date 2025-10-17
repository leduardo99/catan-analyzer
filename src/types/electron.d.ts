export interface IElectronAPI {
  captureScreenshot: () => Promise<string>;
  toggleOverlay: (isVisible: boolean) => Promise<void>;
  minimizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
