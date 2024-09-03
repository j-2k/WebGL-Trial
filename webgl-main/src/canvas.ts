function StartCanvas(){
    // Select the canvas element
    const canvas = document.getElementById('webglCanvas') as HTMLCanvasElement;

    // Get the 2D context from the canvas
    const context = canvas.getContext('2d');

    if (context) {
        context.fillStyle = '#BF00FF';
        context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        console.error('Canvas 2D context is not available.');
    }
    return canvas;
}

export {
    StartCanvas
}



