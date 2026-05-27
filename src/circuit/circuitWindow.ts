import type { CircuitNodeComponent } from "../sharedPrimitives/circuitTypes";
import { createEmitter, type Emitter } from "../sharedPrimitives/emitter";
import { createCircuitEditor } from "./circuitEditor";
import { createCircuitRenderer } from "./circuitRenderer";
import type { WireComponent } from "./wire";

export interface CircuitModel {
  nodeRows: CircuitNodeComponent[][];
  wires: WireComponent[];
  editEmitter: Emitter;
  renderEmitter: Emitter;
}

export const createCircuitWindow = () => {
  let nodeRows: CircuitNodeComponent[][] = [];
  let wires: WireComponent[] = [];
  const windowDiv = document.createElement("div");
  windowDiv.style.width = "fit-content";
  windowDiv.style.height = "fit-content";

  const renderEmitter = createEmitter();
  const editEmitter = createEmitter();
  const model: CircuitModel = {
    nodeRows,
    wires,
    editEmitter,
    renderEmitter,
  };

  const renderer = createCircuitRenderer({ circuitModel: model });
  const editor = createCircuitEditor({
    circuitModel: model,
    circuitRenderer: renderer,
  });

  windowDiv.append(renderer.element, editor.element);

  return {
    element: windowDiv,
    renderer,
    editor,
    renderEmitter,
    editEmitter,
  };
};
