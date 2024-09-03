import helloWorld from "./hello";
helloWorld();

import { StartCanvas } from "./canvas"
import { StartMessages } from "./messages";

//Initialization of Canvas + Messages
const canvas = StartCanvas();
StartMessages(canvas);
//StartMessages(StartCanvas()); Funny

//
