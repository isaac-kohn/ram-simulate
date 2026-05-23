import { createStaticBit } from "../sharedPrimitives/staticBit";
import { createToggleButton } from "../sharedPrimitives/toggleButton";

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
  svg.style.inset = "0";
  windowDiv.append(svg);

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }
  });
  observer.observe(windowDiv);

  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", "0");
  line.setAttribute("y1", "0");
  line.setAttribute("x2", "10");
  line.setAttribute("y2", "10");
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "2");
  svg.append(line);

  const { element: btn1 } = createToggleButton({ id: "booba" });
  const { element: bit1 } = createStaticBit({ id: "booba" });

  windowDiv.append(btn1);
  windowDiv.append(bit1);

  return windowDiv;
};
