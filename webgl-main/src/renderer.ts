import { CreateMaterial } from "./render-utils";

//import default_vertex_shader from "./shaders-glsl/defaultshader/vertexshader.glsl?raw";
//import default_fragment_shader from "./shaders-glsl/defaultshader/fragmentshader.glsl?raw";

import UVtest_Vshader from "./shaders-glsl/UVtestshader/vertexshader.glsl?raw";
import UVtest_Fshader from "./shaders-glsl/UVtestshader/fragmentshader.glsl?raw";

import { DrawRectangle, DrawGeometry } from "./shapes";
import { RandomFloat, m3 } from "./custom-math-utils";



function InitializeRenderer(gl: WebGLRenderingContext): void {
    //Making a shaderprogram that webgl will use.
    const shaderProgram = CreateMaterial(gl, UVtest_Vshader, UVtest_Fshader);
    if (!shaderProgram) {
        console.error("Failed to create shader program inside the Renderer function...");
        return;
    }

    //Get references to the memory locations of variables in the shader program
    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");

    // lookup uniforms
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
    const matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var translation = [400, 300];
    var angleInRadians = 3.14 * 0;
    var scale = [1, 1];
    var color = [RandomFloat(0, 1), RandomFloat(0, 1), RandomFloat(0, 1), 1];

    Renderer(gl);

    UpdateSliderValues();

    function Renderer(gl: WebGLRenderingContext): void {

        //webglUtils.resizeCanvasToDisplaySize(gl.canvas); for handling canvas size read more here > https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
        //Tell WebGL to convert from clip space (-1 to 1) to real pixel space (0 to canvas.width/height)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clear(gl.COLOR_BUFFER_BIT);

        //Tell WebGL to use the shader program with the final material we made above!
        gl.useProgram(shaderProgram);

        //Enable the vertex attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        //Binding the newly created position buffer to the gl array buffer context, 
        //this is necessary for the buffer to be used by the shader program 
        //& gl.ARRAY_BUFFER will be used to pass in vertex data as we'll see later in drawing functions
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        DrawGeometry(gl);

        //Draw section!
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(colorUniformLocation, color);



        // Compute the matrices
        let translationMatrix = m3.translation(translation[0], translation[1]);
        let rotationMatrix = m3.rotation(angleInRadians);
        let scaleMatrix = m3.scaling(scale[0], scale[1]);

        // Multiply the matrices.
        let matrix = m3.multiply(translationMatrix, rotationMatrix);
        matrix = m3.multiply(matrix, scaleMatrix);

        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, 18);

    }

    function UpdateSliderValues() {
            //Event listeners for the sliders
    const sliders = ['RangeTX', 'RangeTY', 'RangeR', 'RangeS', 'RangeC'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId) as HTMLInputElement;
        if (slider) {
            slider.addEventListener('input', () => {
                handleSliderChange(sliderId, parseFloat(slider.value));
            });
        }
    });

    function handleSliderChange(sliderId: string, value: number) {
        switch (sliderId) {
            case 'RangeTX':
                // Handle X change
                translation[0] = value;

                break;
            case 'RangeTY':
                // Handle translation change
                translation[1] = value;

                break;
            case 'RangeR':
                // Handle rotation change
                angleInRadians = value * Math.PI / 50; // Convert to radians

                break;
            case 'RangeS':
                // Handle scale change
                scale = [value / 50, value / 50]; // Adjust scale factor as needed

                break;
            case 'RangeC':
                // Handle color change
                color = [value / 100, color[1], color[2], 1];

                break;
        }
        Renderer(gl);
    }
}
}



export {
    InitializeRenderer,
}
