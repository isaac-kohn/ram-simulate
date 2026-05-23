import { createStaticBit } from "../sharedPrimitives/staticBit";
import { createToggleButton } from "../sharedPrimitives/toggleButton";
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

  const observer = new ResizeObserver(() => {
    const { width, height } = windowDiv.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  });
  observer.observe(windowDiv);

  const btn1 = createToggleButton({ id: "booba" });
  const bit1 = createStaticBit({ id: "booba" });
  const bit2 = createStaticBit({ id: "trooba" });

  bit2.element.style.margin = "20px";

  windowDiv.append(btn1.element);
  windowDiv.append(bit1.element);
  windowDiv.append(bit2.element);

  const wire1 = createWire({ from: btn1, to: bit1, container: windowDiv });
  const wire2 = createWire({ from: bit1, to: bit2, container: windowDiv });
  svg.append(wire1);
  svg.append(wire2);

  return windowDiv;
};
