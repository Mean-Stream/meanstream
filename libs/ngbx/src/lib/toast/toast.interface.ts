export interface Action {
  name: string;
  link?: any[];
  run?: () => void;
}

export interface Toast {
  title?: string;
  body?: string;
  class?: string | Record<string, boolean> | string[];
  delay?: number;
  actions?: Action[];
}
