import type { BitComponent } from "../sharedPrimitives/circuitTypes";

export interface WireComponent {
  element: SVGPathElement;
  getFrom: () => BitComponent;
  getTo: () => BitComponent;
  setFrom: (BitElement) => void;
  setTo: (BitElement) => void;
}

export const createWire = ({
  from,
  to,
  container,
}: {
  from: BitComponent;
  to: BitComponent;
  container: HTMLElement;
}): WireComponent => {
  let bit1 = from;
  let bit2 = to;

  const svgNS = "http://www.w3.org/2000/svg";

  // <path id="lineAC" d="M 100 350 q 150 -300 300 0" stroke="blue" stroke-width="4" fill="none"/>

  const wire = document.createElementNS(svgNS, "path");
  wire.id = "wire-" + bit1.element.id + bit2.element.id;
  wire.setAttribute("stroke-width", "4");
  wire.setAttribute("fill", "none");

  const updateState = () => {
    const isOn = bit1.getState();
    wire.setAttribute("stroke", isOn ? "green" : "red");
    bit2.setState(isOn);
  };
  updateState();

  const yOut = 20;
  const updateCurve = () => {
    const rect0 = container.getBoundingClientRect();
    const x0 = rect0.left;
    const y0 = rect0.top;

    const rect1 = bit1.element.getBoundingClientRect();
    const x1 = (rect1.left + rect1.right) / 2 - x0;
    const y1 = rect1.bottom - y0;

    const rect2 = bit2.element.getBoundingClientRect();
    const x2 = (rect2.left + rect2.right) / 2 - x0;
    const y2 = rect2.top - y0;

    wire.setAttribute(
      "d",
      `M ${x1} ${y1} C ${x1} ${y1 + yOut},
       ${x2} ${y2 - yOut}, ${x2} ${y2}`,
    );
  };

  //const unsubscribe1 = bit1.emitter.subscribe(updateUI);
  //const unsubscribe2 = bit2.emitter.subscribe(updateUI);
  bit1.emitter.subscribe(updateState);

  const observer = new ResizeObserver(() => updateCurve());
  observer.observe(bit1.element);
  observer.observe(bit2.element);
  observer.observe(container);

  return {
    element: wire,
    getFrom: () => bit1,
    getTo: () => bit2,
    setFrom: (bit: BitComponent) => {
      bit1 = bit;
      updateState();
      updateCurve();
    },
    setTo: (bit: BitComponent) => {
      bit2 = bit;
      updateState();
      updateCurve();
    },
  };
};
