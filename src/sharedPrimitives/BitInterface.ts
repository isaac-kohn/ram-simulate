export interface BitElement {
  element: HTMLElement;
  getState: () => boolean;
  setState: (state: boolean) => void;
}
