import { CreateMaterial } from "./render-utils";

//import default_vertex_shader from "./shaders-glsl/defaultshader/vertexshader.glsl?raw";
//import default_fragment_shader from "./shaders-glsl/defaultshader/fragmentshader.glsl?raw";

import UVtest_Vshader from "./shaders-glsl/UVtestshader/vertexshader.glsl?raw";
import UVtest_Fshader from "./shaders-glsl/UVtestshader/fragmentshader.glsl?raw";

import { DrawGeometry } from "./shapes";
import { RandomFloat, m4 } from "./custom-math-utils";
import { GameObjectTransforms } from "./engineobjects";

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

    let objectF: GameObjectTransforms = {
        translation: [400, 300, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        color: [RandomFloat(0, 1), RandomFloat(0, 1), RandomFloat(0, 1), 1]
    }

    Renderer(gl, objectF);

    UpdateSliderValues(objectF);

    function Renderer(gl: WebGLRenderingContext, Transform : GameObjectTransforms): void {

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
        let size = 3;          // 3 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        
        DrawGeometry(gl);

        //Draw section!
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(colorUniformLocation, Transform.color);

        //Offset the pivot to the center of the object
        var moveOriginMatrix = m4.translation(-50, -75, 0);

        //Read this from bottom to top, or right to left for easier understanding
        //1. move the origin to the center of the object //2. rotate the object //3. scale the object //4. translate the object // 5. multiply by the projection matrix to get the clip space positions
        let matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
        matrix = m4.translate(matrix, Transform.translation[0], Transform.translation[1], Transform.translation[2]);
        matrix = m4.xRotate(matrix, Transform.rotation[0]);
        matrix = m4.yRotate(matrix, Transform.rotation[1]);
        matrix = m4.zRotate(matrix, Transform.rotation[2]);
        matrix = m4.scale(matrix, Transform.scale[0], Transform.scale[1], Transform.scale[2]);
        matrix = m4.multiply(matrix, moveOriginMatrix);
        
        
        //Scroll to the gifs shown on https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html to see a better visual of matrix transformations

        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.drawArrays(gl.TRIANGLES, 0, 18);

    }

    function UpdateSliderValues(GameObjectTransform: GameObjectTransforms) {
            //Event listeners for the sliders
    const sliders = ['RangeTX', 'RangeTY','RangeTZ', 'RangeRX','RangeRY','RangeRZ', 'RangeS', 'RangeC'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId) as HTMLInputElement;
        if (slider) {
            slider.addEventListener('input', () => {
                handleSliderChange(sliderId, parseFloat(slider.value),parseFloat(slider.max), GameObjectTransform);
            });
        }
    });

    function handleSliderChange(sliderId: string, value: number, maxSliderValue: number, GameObjectTransform: GameObjectTransforms) {
        const nValue = value / maxSliderValue;
        switch (sliderId) {
            case 'RangeTX':
                // Handle X change
                GameObjectTransform.translation[0] = value - 100;
                break;
            case 'RangeTY':
                // Handle translation change
                GameObjectTransform.translation[1] = value - 100;
                break;
            case 'RangeTZ':
                // Handle translation change
                GameObjectTransform.translation[2] = value - 100;
                break;
            case 'RangeRX':
                // Handle rotation change
                //rotation[0] = value * Math.PI / 50; // old Convert to radians
                GameObjectTransform.rotation[0] = nValue * (Math.PI*2); //Already in radians
                break;
            case 'RangeRY':
                // Handle rotation change
                //rotation[1] = value * Math.PI / 50; // old Convert to radians
                GameObjectTransform.rotation[1] = nValue * (Math.PI*2); //Already in radians
                break;
            case 'RangeRZ':
                // Handle rotation change
                //rotation[2] = value * Math.PI / 50; // old Convert to radians
                GameObjectTransform.rotation[2] = nValue * (Math.PI*2); //Already in radians
                break;
            case 'RangeS':
                // Handle scale change
                const maxScale = (nValue*2-1) * 2;
                GameObjectTransform.scale = [maxScale,maxScale,maxScale]; // Adjust scale factor as needed
                break;
            case 'RangeC':
                // Handle color change
                const nPI = nValue * Math.PI;
                // triangle formation  //2pi/3 = 2.094   //4pi/3 = 4.188
                GameObjectTransform.color = [Math.sin(nPI)*0.5+0.5, Math.sin(nPI+2.094)*0.5+0.5, Math.sin(nPI+4.188)*0.5+0.5, 1];
                break;
        }
        Renderer(gl, GameObjectTransform);
    }
}
}



export {
    InitializeRenderer,
}
