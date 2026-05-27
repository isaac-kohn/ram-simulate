import type { BitComponent } from "./circuitTypes";
import { createEmitter } from "./emitter";

export const createTeenyBit = ({ id }: { id: string }): BitComponent => {
  const bit = document.createElement("div");
  bit.id = "teenyBit-" + id;
  bit.style.display = "inline-block";
  bit.style.width = "10px";
  bit.style.height = "10px";
  bit.style.marginInline = "10px";
  bit.style.border = "solid 1px";

  bit.style.display = "flex";

  let isOn = false;

  const emitter = createEmitter();

  const updateUI = () => {
    bit.style.background = isOn ? "limegreen" : "pink";
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
