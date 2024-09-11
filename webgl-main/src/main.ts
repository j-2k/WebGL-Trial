import helloWorld from "./hello";
helloWorld();

import { initializeCanvas } from "./canvas"
import { StartMessages, CreateControlsMenu } from "./messages";
import { InitializeRenderer } from "./renderer"

function main() {
    const canvasId = 'webglCanvas';
    const gl = initializeCanvas(canvasId) as WebGLRenderingContext | null;
    //const gl = false;
    
    if (!gl) {
        console.warn("WebGL context not available. Renderer will not start.");
        StartMessages(canvasId);
        return; // Early return if gl is null
    }

    console.log("WebGL is available, proceed with initialization and rendering");
    StartMessages(canvasId);
    CreateControlsMenu(canvasId);
    InitializeRenderer(gl);
}

// Call the main function to start the application
main();