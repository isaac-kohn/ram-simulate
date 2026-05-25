import type { CircuitNodeComponent } from "../sharedPrimitives/circuitTypes";
import { createEmitter, type Emitter } from "../sharedPrimitives/emitter";
import { createStaticBit } from "../sharedPrimitives/staticBit";
import { createToggleButton } from "../sharedPrimitives/toggleButton";
import { createCircuitEditor } from "./circuitEditor";
import { createCircuitRenderer } from "./circuitRenderer";
import { createAndGate } from "./logicGate";
import type { WireComponent } from "./wire";

export interface CircuitModel {
  nodeRows: CircuitNodeComponent[][];
  wireRows: WireComponent[][];
  updateEmitter: Emitter;
}

export const createCircuitWindow = () => {
  let nodeRows: CircuitNodeComponent[][] = [];
  let wireRows: WireComponent[][] = [];
  const windowDiv = document.createElement("div");
  windowDiv.style.width = "fit-content";
  windowDiv.style.height = "fit-content";

  const model: CircuitModel = {
    nodeRows,
    wireRows,
    updateEmitter: createEmitter(),
  };

  const renderer = createCircuitRenderer({ circuitModel: model });
  const editor = createCircuitEditor({ circuitModel: model });

  windowDiv.append(renderer.element, editor.element);

  return {
    element: windowDiv,
    renderer,
    editor,
  };
};
