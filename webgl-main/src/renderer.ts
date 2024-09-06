import { CreateMaterial } from "./render-utils";

//import default_vertex_shader from "./shaders-glsl/defaultshader/vertexshader.glsl?raw";
//import default_fragment_shader from "./shaders-glsl/defaultshader/fragmentshader.glsl?raw";

import UVtest_Vshader from "./shaders-glsl/UVtestshader/vertexshader.glsl?raw";
import UVtest_Fshader from "./shaders-glsl/UVtestshader/fragmentshader.glsl?raw";

import { DrawRectangle } from "./shapes";
import { RandomInt } from "./custom-math-utils";

function Renderer(gl: WebGLRenderingContext) : void {
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas); for handling canvas size read more here > https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    //Tell WebGL to convert from clip space (-1 to 1) to real pixel space (0 to canvas.width/height)
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

    //Making a shaderprogram that webgl will use.
    const shaderProgram = CreateMaterial(gl, UVtest_Vshader, UVtest_Fshader);
    if (!shaderProgram) {
        console.error("Failed to create shader program inside the Renderer function...");
        return;
    }

    //Tell WebGL to use the shader program with the final material we made above!
    gl.useProgram(shaderProgram);

    //Get references to the memory locations of variables in the shader program
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram,"a_position");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram,"u_resolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram,"u_color");

    //Making a position memory buffer
    const positionBuffer = gl.createBuffer();
    //Binding the newly created position buffer to the gl array buffer context, 
    //this is necessary for the buffer to be used by the shader program 
    //& gl.ARRAY_BUFFER will be used to pass in vertex data as we'll see later in drawing functions
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Enable the vertex attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    //Draw section!
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    for (let i = 0; i < 10; i++) {
    DrawRectangle(gl, 
        RandomInt(0,gl.canvas.width * 0.75), RandomInt(0,gl.canvas.height * 0.75),
        RandomInt(20,gl.canvas.width * 0.25), RandomInt(20,gl.canvas.height * 0.25),
        colorUniformLocation,i,10,true);
    }
}

export {
    Renderer,
}
