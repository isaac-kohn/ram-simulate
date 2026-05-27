import type { BitComponent } from "../sharedPrimitives/circuitTypes";

export interface WireComponent {
  element: SVGPathElement;
  getFrom: () => BitComponent;
  getTo: () => BitComponent;
  setFrom: (BitElement) => void;
  setTo: (BitElement) => void;
  cleanup: () => void;
}

export const createWire = ({
  from,
  to,
  canvasDiv,
}: {
  from: BitComponent;
  to: BitComponent;
  canvasDiv: HTMLElement;
}): WireComponent => {
  let bit1 = from;
  let bit2 = to;
  let canvasObserver: ResizeObserver;
  let bit1Observer: ResizeObserver;
  let bit2Observer: ResizeObserver;
  let unsubscribeBit1: () => void = () => {};

  const svgNS = "http://www.w3.org/2000/svg";
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
    const rect0 = canvasDiv.getBoundingClientRect();
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

  unsubscribeBit1 = bit1.emitter.subscribe(updateState);

  canvasObserver = new ResizeObserver(() => updateCurve());
  canvasObserver.observe(canvasDiv);
  bit1Observer = new ResizeObserver(() => updateCurve());
  bit2Observer = new ResizeObserver(() => updateCurve());
  bit1Observer.observe(bit1.element);
  bit2Observer.observe(bit2.element);

  const setFrom = (bit: BitComponent) => {
    unsubscribeBit1();
    bit1Observer.disconnect();
    bit1 = bit;
    bit1Observer.observe(bit1.element);
    updateState();
    updateCurve();
  };
  const setTo = (bit: BitComponent) => {
    bit2Observer.disconnect();
    bit2 = bit;
    bit2Observer.observe(bit2.element);
    updateState();
    updateCurve();
  };

  const cleanup = () => {
    unsubscribeBit1();
    canvasObserver.disconnect();
    bit1Observer.disconnect();
    bit2Observer.disconnect();
  };

  return {
    element: wire,
    getFrom: () => bit1,
    getTo: () => bit2,
    setFrom,
    setTo,
    cleanup,
  };
};
