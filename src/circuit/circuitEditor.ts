import type {
  BitComponent,
  CircuitNodeComponent,
} from "../sharedPrimitives/circuitTypes";
import { createStaticBit } from "../sharedPrimitives/staticBit";
import { createToggleButton } from "../sharedPrimitives/toggleButton";
import type { CircuitRenderer } from "./circuitRenderer";
import type { CircuitModel } from "./circuitWindow";
import { createAndGate } from "./logicGates/logicGate";
import { createWire } from "./wire";

export const createCircuitEditor = ({
  circuitModel,
  circuitRenderer,
}: {
  circuitModel: CircuitModel;
  circuitRenderer: CircuitRenderer;
}) => {
  const editorDiv = document.createElement("div");
  editorDiv.style.display = "inline-block";
  editorDiv.style.padding = "40px";
  editorDiv.style.border = "solid 1px";

  const nodeEditorDiv = document.createElement("div");
  const nodeEditorLabel = document.createElement("h1");
  nodeEditorLabel.textContent = "Node Editor";
  nodeEditorLabel.style.marginTop = "0";
  const nodeTextArea = document.createElement("textarea");
  nodeTextArea.style.height = "100px";

  const updateNodeRows = (text: string) => {
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
      } else if (char === "A") {
        const andGate = createAndGate({
          rerenderEmitter: circuitModel.renderEmitter,
        });
        andGate.element.style.margin = `${marginy} ${marginx}`;
        row.push(andGate);
      }
    }
    if (row.length > 0) circuitModel.nodeRows.push([...row]);
    console.log(circuitModel);
    circuitModel.editEmitter.emit();
  };

  const sanitizeNodeText = (text: string): string => {
    let sanitized = "";
    const allowedChars = ["A", "R", "B", "T", "F", "N"];
    const isAllowed = (c: string): boolean => {
      return allowedChars.indexOf(c.toUpperCase()) !== -1;
    };

    text = text.replace(/\r\n/g, "\n");
    text = text.replace(/\r/g, "\n");
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
  wireTextArea.style.height = "100px";

  const updateWireRows = (text: string) => {
    const tokenRows = text
      .trim()
      .split(/\n+/)
      .map((textRow) => textRow.trim().split(/\s+/));
    console.log(tokenRows);
    const wireMapRows = tokenRows.map((row) =>
      row.flatMap((token, index) =>
        token === "-" ? [] : [{ from: index, to: parseInt(token) }],
      ),
    );
    console.log(wireMapRows);

    const getInputs = (node: CircuitNodeComponent): BitComponent[] => {
      if ("inputs" in node) {
        return node.inputs;
      }
      return [node];
    };
    const getOutputs = (node: CircuitNodeComponent): BitComponent[] => {
      if ("outputs" in node) {
        return node.outputs;
      }
      return [node];
    };
    const inputRows = circuitModel.nodeRows.map((row) =>
      row.flatMap((node) => getInputs(node)),
    );
    const outputRows = circuitModel.nodeRows.map((row) =>
      row.flatMap((node) => getOutputs(node)),
    );
    inputRows.splice(0, 1);
    outputRows.pop();
    console.log(inputRows);
    console.log(outputRows);

    circuitModel.wires = [];
    wireMapRows.forEach((mapRow, rowIndex) => {
      mapRow.forEach((wireMap) => {
        const wire = createWire({
          from: outputRows[rowIndex][wireMap.from],
          to: inputRows[rowIndex][wireMap.to],
          canvasDiv: circuitRenderer.element,
        });
        circuitModel.wires.push(wire);
      });
    });
    //console.log(circuitModel.wires);
    circuitModel.editEmitter.emit();
  };

  const sanitizeWireText = (text: string) => {
    let sanitized = "";
    text = text.replace(/\r\n/g, "\n");
    text = text.replace(/\r/g, "\n");
    let allowNewlineNext = false;
    let allowSpaceNext = false;
    let allowDashNext = true;
    let allowNumNext = true;
    for (const char of text) {
      if (allowNewlineNext && char === "\n") {
        sanitized += "\n";
        allowNewlineNext = false;
        allowSpaceNext = false;
        allowDashNext = true;
        allowNumNext = true;
      } else if ((allowSpaceNext && char === " ") || char === "\t") {
        sanitized += " ";
        allowDashNext = true;
        allowNumNext = true;
      } else if (allowDashNext && char === "-") {
        sanitized += "-";
        allowSpaceNext = true;
        allowNewlineNext = true;
        allowDashNext = false;
        allowNumNext = false;
      } else if (/^\d$/.test(char)) {
        sanitized += char;
        allowSpaceNext = true;
        allowNewlineNext = true;
        allowDashNext = false;
      }
    }
    return sanitized;
  };

  wireTextArea.addEventListener("input", () => {
    const sanitized = sanitizeWireText(wireTextArea.value);
    if (wireTextArea.value !== sanitized) {
      wireTextArea.value = sanitized;
      wireTextArea.setSelectionRange(
        wireTextArea.selectionStart,
        wireTextArea.selectionEnd,
      );
    }
    updateWireRows(wireTextArea.value);
  });

  nodeEditorDiv.append(nodeEditorLabel, nodeTextArea);
  wireEditorDiv.append(wireEditorLabel, wireTextArea);
  editorDiv.append(nodeEditorDiv, wireEditorDiv);

  return { element: editorDiv };
};
