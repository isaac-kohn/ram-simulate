import type { BitComponent } from "./circuitTypes";
import { createEmitter } from "./emitter";

export const createStaticBit = ({ id }: { id: string }): BitComponent => {
  const bit = document.createElement("h1");
  bit.id = "staticBit-" + id;
  bit.style.width = "50px";
  bit.style.height = "50px";
  bit.style.fontSize = "30px";
  bit.style.border = "2px solid black";
  bit.style.borderRadius = "50%";

  bit.style.display = "flex";
  bit.style.alignItems = "center";
  bit.style.justifyContent = "center";
  bit.style.margin = "50px";

  let isOn = false;

  const emitter = createEmitter();

  const updateUI = () => {
    bit.innerText = isOn ? "1" : "0";
    bit.style.background = isOn ? "white" : "#888888";
    bit.style.color = isOn ? "black" : "white";
  };
  updateUI();

  return {
    element: bit,
    getState: () => isOn,
    setState: (state: boolean) => {
      isOn = state;
      updateUI();
      emitter.emit();
    },
    emitter,
  };
};
