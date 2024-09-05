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

    //Making a shaderprogram that webgl will use.
    const shaderProgram = CreateMaterial(gl, UVtest_Vshader, UVtest_Fshader);
    if (!shaderProgram) {
        console.error("Failed to create shader program inside the Renderer function...");
        return;
    }

    //Get references to the memory locations of variables in the shader program
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram,"a_position");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram,"u_resolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram,"u_color");

    //Making a position memory buffer
    const positionBuffer = gl.createBuffer();
    //Binding the buffer to the GLSL shader program
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //Buffer Positions Data for 2 tris use to be here
    //const positions = [x1, y1, x2, y1, x1, y2,x2, y1,x2, y2,x1, y2,];

    //webglUtils.resizeCanvasToDisplaySize(gl.canvas); for handling canvas size read more here > https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

    gl.useProgram(shaderProgram);

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

function RandomInt(minInclusive: number, maxInclusive: number) : number {
    return Math.floor(Math.random() * (maxInclusive - minInclusive + 1)) + minInclusive;
}

function RandomFloat(minInclusive: number, maxInclusive: number) : number {
    return Math.random() * (maxInclusive - minInclusive) + minInclusive;
}

function DrawRectangle(gl: WebGLRenderingContext, x1: number, y1: number, width: number, height: number,colorUniformPointer: WebGLUniformLocation | null, 
    index : number = 1, maxIndex : number = 10, isRandomColor : boolean = true) : void {
    const x2 = x1 + width;
    const y2 = y1 + height;

    const positions = [
        x1, y1,
        x2, y1,
        x1, y2,
        x2, y1,
        x2, y2,
        x1, y2,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    if(!isRandomColor)
    {
        //Color based on loop index
        const current = index/maxIndex;
        gl.uniform4f(colorUniformPointer, current, current, current, 1);
    }
    else
    {
        gl.uniform4f(colorUniformPointer, RandomFloat(0,1), RandomFloat(0,1), RandomFloat(0,1), 1);
    }

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
}

export {
    Renderer,
}
