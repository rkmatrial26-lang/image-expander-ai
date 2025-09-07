export type AppState = 'idle' | 'editing' | 'generating' | 'done';

export interface OriginalImage {
  src: string;
  width: number;
  height: number;
  file: File;
}

export type Theme = 'light' | 'dark';