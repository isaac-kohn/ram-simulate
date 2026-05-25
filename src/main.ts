import { createCircuitRenderer } from "./circuit/circuitRenderer";
import { createCircuitWindow } from "./circuit/circuitWindow";
import { createAndGate } from "./circuit/logicGate";
import { createStaticBit } from "./sharedPrimitives/staticBit";
import { createToggleButton } from "./sharedPrimitives/toggleButton";
/*
import { createComputor } from "./computor/computor";

const computor = createComputor();

document.body.append(computor.element);

computor.units[0].setOpBits("01");
computor.units[0].setAd1Bits("00");
computor.units[0].setAd2Bits("10");
computor.units[0].setValBits("000111");

computor.units[1].setOpBits("10");
computor.units[1].setAd1Bits("00");
computor.units[1].setAd2Bits("10");
computor.units[1].setValBits("000000");

computor.units[2].setOpBits("01");
computor.units[2].setAd1Bits("10");
computor.units[2].setAd2Bits("00");
computor.units[2].setValBits("001001");

computor.units[3].setOpBits("10");
computor.units[3].setAd1Bits("10");
computor.units[3].setAd2Bits("00");
computor.units[3].setValBits("000000");

computor.setPointer(0);
*/

const circuitWindow = createCircuitWindow();

document.body.append(circuitWindow.element);
