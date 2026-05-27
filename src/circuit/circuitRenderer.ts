import type { CircuitModel } from "./circuitWindow";

export interface CircuitRenderer {
  element: HTMLElement;
}
export const createCircuitRenderer = ({
  circuitModel,
}: {
  circuitModel: CircuitModel;
}) => {
  const canvasDiv = document.createElement("div");
  canvasDiv.style.display = "inline-flex";
  canvasDiv.style.position = "relative"; // this sets the coordinate system for children
  canvasDiv.style.verticalAlign = "top";
  canvasDiv.style.width = "fit-content";
  canvasDiv.style.height = "fit-content";
  canvasDiv.style.flexDirection = "column";
  canvasDiv.style.alignItems = "center";
  canvasDiv.style.padding = "5px";
  canvasDiv.style.background = "#EEEEEE";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  svg.setAttribute("preserve-aspect-ratio", "none");
  svg.style.inset = "0";

  const observer = new ResizeObserver(() => {
    const { width, height } = canvasDiv.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    circuitModel.renderEmitter.emit();
  });
  observer.observe(canvasDiv);

  let nodeRowDivs: HTMLElement[] = [];
  const updateCircuitModel = () => {
    nodeRowDivs = circuitModel.nodeRows.map((nodeRow) => {
      const nodeRowDiv = document.createElement("div");
      nodeRowDiv.style.display = "flex";
      nodeRowDiv.style.justifyContent = "center";
      nodeRowDiv.style.width = "fit-content";
      nodeRow.forEach((node) => {
        nodeRowDiv.append(node.element);
      });
      return nodeRowDiv;
    });

    canvasDiv.replaceChildren(); // clear previous DOM
    canvasDiv.append(svg);

    nodeRowDivs.forEach((nodeRowDiv) => {
      canvasDiv.append(nodeRowDiv);
    });

    svg.replaceChildren(); // clear previous DOM

    circuitModel.wires.forEach((wire) => {
      svg.append(wire.element);
    });
  };
  updateCircuitModel();

  circuitModel.editEmitter.subscribe(updateCircuitModel);

  /*
  const btn1 = createToggleButton({ id: "booba" });
  const btn2 = createToggleButton({ id: "boobaba" });
  const bit1 = createStaticBit({ id: "booba" });
  const bit2 = createStaticBit({ id: "trooba" });
  const and1 = createAndGate({ rerenderEmitter: childEmitter });
  const bit3 = createStaticBit({ id: "mooba" });

  bit2.element.style.margin = "20px";

  canvasDiv.append(btn1.element);
  canvasDiv.append(btn2.element);
  canvasDiv.append(bit1.element);
  canvasDiv.append(bit2.element);
  canvasDiv.append(and1.element);
  canvasDiv.append(bit3.element);
  
  const wire1 = createWire({ from: btn2, to: bit1, container: canvasDiv });
  const wire2 = createWire({ from: bit1, to: bit2, container: canvasDiv });
  const wire3 = createWire({
    from: btn1,
    to: and1.inputs[0],
    container: canvasDiv,
  });
  const wire4 = createWire({
    from: bit2,
    to: and1.inputs[1],
    container: canvasDiv,
  });
  const wire5 = createWire({
    from: and1.outputs[0],
    to: bit3,
    container: canvasDiv,
  });
  svg.append(wire1.element);
  svg.append(wire2.element);
  svg.append(wire3.element);
  svg.append(wire4.element);
  svg.append(wire5.element);*/

  return { element: canvasDiv };
};
