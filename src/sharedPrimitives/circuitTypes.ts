import type { LogicGateComponent } from "../circuit/logicGate";
import type { Emitter } from "./emitter";

export interface BitComponent {
  element: HTMLElement;
  getState: () => boolean;
  setState: (state: boolean) => void;
  emitter: Emitter;
}

export type CircuitNodeComponent = BitComponent | LogicGateComponent;
