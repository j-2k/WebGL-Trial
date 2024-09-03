import helloWorld from "./hello";
helloWorld();

import { initializeCanvas } from "./canvas"
import { StartMessages } from "./messages";
import { Renderer } from "./renderer"

function main() {
    const canvasId = 'webglCanvas';
    const gl = initializeCanvas(canvasId) as WebGLRenderingContext | null;
    //const gl = false;
    
    if (!gl) {
        console.warn("WebGL context not available. Renderer will not start.");
        StartMessages(canvasId);
        return; // Early return if gl is null
    }

    // WebGL is available, proceed with initialization and rendering
    StartMessages(canvasId);
    Renderer(gl);
}

// Call the main function to start the application
main();