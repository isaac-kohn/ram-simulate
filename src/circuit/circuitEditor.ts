import type { CircuitNodeComponent } from "../sharedPrimitives/circuitTypes";
import { createStaticBit } from "../sharedPrimitives/staticBit";
import { createTeenyBit } from "../sharedPrimitives/teenyBit";
import { createToggleButton } from "../sharedPrimitives/toggleButton";
import type { CircuitModel } from "./circuitWindow";
import type { WireComponent } from "./wire";

export const createCircuitEditor = ({
  circuitModel,
}: {
  circuitModel: CircuitModel;
}) => {
  let nodeText = "";
  let wireText = "";

  const editorDiv = document.createElement("div");
  editorDiv.style.display = "inline-block";
  editorDiv.style.padding = "40px";
  editorDiv.style.border = "solid 1px";

  const nodeEditorDiv = document.createElement("div");
  const nodeEditorLabel = document.createElement("h1");
  nodeEditorLabel.textContent = "Node Editor";
  nodeEditorLabel.style.marginTop = "0";
  const nodeTextArea = document.createElement("textarea");

  const updateNodeRows = (text) => {
    const marginx = "5px"; // find out how to refactor this lol
    const marginy = "25px";

    circuitModel.nodeRows = [];
    let row = [];
    for (const char of text) {
      if (char === "\n") {
        circuitModel.nodeRows.push([...row]);
        row = [];
      } else if (char === "B") {
        const toggleBit = createToggleButton({ id: "" });
        toggleBit.element.style.margin = `${marginy} ${marginx}`;
        row.push(toggleBit);
      } else if (char === "T") {
        const trueBit = createStaticBit({ id: "" });
        trueBit.element.style.margin = `${marginy} ${marginx}`;
        trueBit.setState(true);
        row.push(trueBit);
      } else if (char === "F") {
        const falseBit = createStaticBit({ id: "" });
        falseBit.element.style.margin = `${marginy} ${marginx}`;
        falseBit.setState(false);
        row.push(falseBit);
      }
    }
    if (row.length > 0) circuitModel.nodeRows.push([...row]);
    console.log(circuitModel);
    circuitModel.updateEmitter.emit();
  };

  const sanitizeNodeText = (text: string): string => {
    let sanitized = "";
    const allowedChars = ["A", "R", "B", "T", "F", "N"];
    const isAllowed = (c: string): boolean => {
      return allowedChars.indexOf(c.toUpperCase()) !== -1;
    };

    let allowNewlineNext = false;
    for (const char of text) {
      if (allowNewlineNext && char === "\n") {
        sanitized += "\n";
        allowNewlineNext = false;
      } else if (isAllowed(char)) {
        sanitized += char.toUpperCase();
        allowNewlineNext = true;
      }
    }

    return sanitized;
  };
  nodeTextArea.addEventListener("input", () => {
    const start = nodeTextArea.selectionStart;
    const end = nodeTextArea.selectionStart;

    const sanitized = sanitizeNodeText(nodeTextArea.value);

    if (sanitized !== nodeTextArea.value) {
      nodeTextArea.value = sanitized;
      nodeTextArea.setSelectionRange(start, end);
    }
    updateNodeRows(nodeTextArea.value);
  });

  const wireEditorDiv = document.createElement("div");
  const wireEditorLabel = document.createElement("h1");
  wireEditorLabel.textContent = "Wire Editor";
  const wireTextArea = document.createElement("textarea");

  nodeEditorDiv.append(nodeEditorLabel, nodeTextArea);
  wireEditorDiv.append(wireEditorLabel, wireTextArea);
  editorDiv.append(nodeEditorDiv, wireEditorDiv);

  return { element: editorDiv };
};
