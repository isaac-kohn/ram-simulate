import type { emitter } from "./emitter";

export interface BitElement {
  element: HTMLElement;
  getState: () => boolean;
  setState: (state: boolean) => void;
  emitter: emitter;
}
