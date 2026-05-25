import type { BitComponent } from "../sharedPrimitives/circuitTypes";
import type { Emitter } from "../sharedPrimitives/emitter";
import { createTeenyBit } from "../sharedPrimitives/teenyBit";

export interface LogicGateComponent {
  element: HTMLElement;
  inputs: BitComponent[];
  outputs: BitComponent[];
}

export const createAndGate = ({
  rerenderEmitter,
}: {
  rerenderEmitter: Emitter;
}): LogicGateComponent => {
  const gateDiv = document.createElement("div");
  // we create a 1x1 grid cell as a hack so we can put both children in the cell and use alignSelf top/bottom
  gateDiv.style.display = "grid";
  gateDiv.style.gridTemplateRows = "1fr";
  gateDiv.style.gridTemplateColumns = "1fr";
  gateDiv.style.justifyItems = "center";
  gateDiv.style.position = "relative"; // this sets the coordinate system for the svg
  gateDiv.style.width = "fit-content";
  gateDiv.style.height = "50px";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  svg.setAttribute("preserve-aspect-ratio", "none");
  svg.style.inset = "0";
  svg.style.zIndex = "0";

  const input1 = createTeenyBit({ id: "1" });
  const input2 = createTeenyBit({ id: "2" });
  const output = createTeenyBit({ id: "3" });

  const inputsDiv = document.createElement("div");
  inputsDiv.style.width = "fit-content";
  inputsDiv.style.height = "fit-content";
  inputsDiv.style.display = "flex";
  inputsDiv.style.justifyContent = "center";
  inputsDiv.style.alignSelf = "top";
  inputsDiv.style.zIndex = "1";

  const outputsDiv = document.createElement("div");
  outputsDiv.style.width = "fit-content";
  outputsDiv.style.height = "fit-content";
  outputsDiv.style.display = "flex";
  outputsDiv.style.justifyContent = "center";
  outputsDiv.style.alignSelf = "bottom";
  outputsDiv.style.zIndex = "1";

  const label = document.createElement("p");
  label.textContent = "AND";
  label.style.margin = "0px";
  label.style.position = "absolute";
  label.style.top = "50%";
  label.style.left = "50%";
  label.style.transform = "translate(-50%, -50%)";
  label.style.zIndex = "1";

  const gateGraphic = document.createElementNS(svgNS, "path");
  gateGraphic.setAttribute("stroke", "black");
  gateGraphic.setAttribute("stroke-width", "2");
  gateGraphic.setAttribute("fill", "lightblue");

  const updateCurve = () => {
    // svg
    const rect = gateDiv.getBoundingClientRect();
    const x0 = rect.x;
    const y0 = rect.y;
    gateGraphic.setAttribute(
      "d",
      `M 0 0
       L ${rect.right - x0} 0
       L ${rect.right - x0} ${rect.top + 0.5 * rect.height - y0}
       Q ${rect.right - x0} ${rect.bottom - y0} 
       ${rect.left + 0.5 * rect.width - x0} ${rect.bottom - y0}
       Q 0 ${rect.bottom - y0} 0 
       ${rect.top + 0.5 * rect.height - y0}
       Z
       `,
    );
  };
  rerenderEmitter.subscribe(updateCurve);

  const updateState = () => {
    const isOn1 = input1.getState();
    const isOn2 = input2.getState();
    output.setState(isOn1 && isOn2);
  };
  input1.emitter.subscribe(updateState);
  input2.emitter.subscribe(updateState);

  const observer = new ResizeObserver(() => {
    const { width, height } = gateDiv.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    updateCurve();
  });
  observer.observe(gateDiv);

  inputsDiv.append(input1.element);
  inputsDiv.append(input2.element);
  outputsDiv.append(output.element);
  gateDiv.append(inputsDiv);
  gateDiv.append(label);
  gateDiv.append(outputsDiv);
  svg.append(gateGraphic);
  gateDiv.append(svg);

  return {
    element: gateDiv,
    inputs: [input1, input2],
    outputs: [output],
  };
};
