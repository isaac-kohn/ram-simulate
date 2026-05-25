import type { BitComponent } from "./circuitTypes";
import { createEmitter } from "./emitter";

export const createToggleButton = ({ id }: { id: string }): BitComponent => {
  const button = document.createElement("button");
  button.id = "toggleButton-" + id;

  button.className = "toggleButton";
  button.style.width = "50px";
  button.style.height = "50px";
  button.style.fontSize = "30px";

  let isOn = false;

  const emitter = createEmitter();

  const updateUI = () => {
    button.textContent = isOn ? "1" : "0";
    button.style.backgroundColor = isOn ? "lightgreen" : "pink";
  };
  updateUI();

  button.addEventListener("click", () => {
    isOn = !isOn;
    updateUI();
    emitter.emit();
  });

  return {
    element: button,
    getState: () => {
      return isOn;
    },
    setState: (x: boolean) => {
      isOn = x;
      updateUI();
      emitter.emit();
    },
    emitter,
  };
};
