/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    captureScreenshot: () => Promise<string>;
    toggleOverlay: (isVisible: boolean) => Promise<void>;
    minimizeWindow: () => Promise<void>;
    closeWindow: () => Promise<void>;
  };
}
