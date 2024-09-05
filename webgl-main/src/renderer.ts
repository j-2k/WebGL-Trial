import { CreateMaterial } from "./render-utils";

import default_vertex_shader from "./shaders-glsl/defaultshader/vertexshader.glsl?raw";
import default_fragment_shader from "./shaders-glsl/defaultshader/fragmentshader.glsl?raw";

import UVtest_Vshader from "./shaders-glsl/UVtestshader/vertexshader.glsl?raw";
import UVtest_Fshader from "./shaders-glsl/UVtestshader/fragmentshader.glsl?raw";

function Renderer(gl: WebGLRenderingContext) : void {
    if (!gl) {
        console.error("Failed to get WebGL context/Might not be supported");
        return;
    }

    const shaderProgram = CreateMaterial(gl, UVtest_Vshader, UVtest_Fshader);
    if (!shaderProgram) {
        console.error("Failed to create shader program inside the Renderer function...");
        return;
    }

    //Supplying the data to the GLSL shader program
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram,"a_position");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram,"u_resolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram,"u_color");

    //Buffer creation
    const positionBuffer = gl.createBuffer();
    //Binding the buffer to the GLSL shader program
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Three 2d points (x,y)
    var positions = [
        600, 450,
        600, 150,
        200, 450,

        200, 150,
        200, 440,
        590, 150,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    //webglUtils.resizeCanvasToDisplaySize(gl.canvas); for handling canvas size read more here > https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

    gl.useProgram(shaderProgram);

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(colorUniformLocation, 0.2, 0.8, 0.4, 1.0);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

export {
    Renderer,
}
