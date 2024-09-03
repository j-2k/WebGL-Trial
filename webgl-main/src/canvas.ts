function StartCanvas(){
    // Select the canvas element
    const canvas = document.getElementById('webglCanvas') as HTMLCanvasElement;

    // Get the 2D context from the canvas
    const gl = canvas.getContext('webgl');

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
    return canvas;
}

export {
    StartCanvas
}



