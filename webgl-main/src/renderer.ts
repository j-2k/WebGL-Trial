function Renderer(canvas: HTMLCanvasElement) : void {
    const gl = canvas.getContext("webgl");
    gl?.clearColor(1.,0.,1.,1.);
    gl?.clear(gl.COLOR_BUFFER_BIT);
}

export {
    Renderer,
}