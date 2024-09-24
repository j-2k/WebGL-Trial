import { initializeCanvas } from "./canvas"
import { StartMessages } from "./messages";

function main() {
    const canvasId = 'webglCanvas';
    //const gl = initializeCanvas(canvasId) as WebGLRenderingContext | null;
    const gl = false;
    
    if (!gl) {
        console.warn("WebGL context not available. Renderer will not start.");
        StartMessages(canvasId, "⚠️ CHECK CONSOLE! ⚠️ GL IS FALSE! ⚠️");
        return; // Early return if gl is null
    }

    console.log("WebGL is available, proceed with initialization and rendering");
    StartMessages(canvasId);
}

// Call the main function to start the application
main();