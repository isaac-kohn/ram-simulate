import { createEmitter } from "../sharedPrimitives/emitter";
import { createStaticBit } from "../sharedPrimitives/staticBit";
import { createToggleButton } from "../sharedPrimitives/toggleButton";
import { createAndGate } from "./logicGate";
import { createWire } from "./wire";

export const createGateWindow = () => {
  const windowDiv = document.createElement("div");
  windowDiv.style.display = "inline-block";
  windowDiv.style.position = "relative"; // this sets the coordinate system for children
  windowDiv.style.verticalAlign = "top";
  windowDiv.style.width = "fit-content";
  windowDiv.style.height = "fit-content";
  windowDiv.style.padding = "5px";
  windowDiv.style.background = "#EEEEEE";

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.style.pointerEvents = "none";
  svg.style.position = "absolute";
  svg.setAttribute("preserve-aspect-ratio", "none");
  svg.style.inset = "0";
  windowDiv.append(svg);

  const emitter = createEmitter();
  const observer = new ResizeObserver(() => {
    const { width, height } = windowDiv.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    emitter.emit();
  });
  observer.observe(windowDiv);

  const btn1 = createToggleButton({ id: "booba" });
  const btn2 = createToggleButton({ id: "boobaba" });
  const bit1 = createStaticBit({ id: "booba" });
  const bit2 = createStaticBit({ id: "trooba" });
  const and1 = createAndGate({ rerenderEmitter: emitter });
  const bit3 = createStaticBit({ id: "mooba" });

  bit2.element.style.margin = "20px";

  windowDiv.append(btn1.element);
  windowDiv.append(btn2.element);
  windowDiv.append(bit1.element);
  windowDiv.append(bit2.element);
  windowDiv.append(and1.element);
  windowDiv.append(bit3.element);

  const wire1 = createWire({ from: btn2, to: bit1, container: windowDiv });
  const wire2 = createWire({ from: bit1, to: bit2, container: windowDiv });
  const wire3 = createWire({
    from: btn1,
    to: and1.inputs[0],
    container: windowDiv,
  });
  const wire4 = createWire({
    from: bit2,
    to: and1.inputs[1],
    container: windowDiv,
  });
  const wire5 = createWire({
    from: and1.outputs[0],
    to: bit3,
    container: windowDiv,
  });
  svg.append(wire1);
  svg.append(wire2);
  svg.append(wire3);
  svg.append(wire4);
  svg.append(wire5);

  return windowDiv;
};
