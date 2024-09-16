import { CreateMaterial } from "./render-utils";

//import default_vertex_shader from "./shaders-glsl/defaultshader/vertexshader.glsl?raw";
//import default_fragment_shader from "./shaders-glsl/defaultshader/fragmentshader.glsl?raw";

import UVtest_Vshader from "./shaders-glsl/UVtestshader/vertexshader.glsl?raw";
import UVtest_Fshader from "./shaders-glsl/UVtestshader/fragmentshader.glsl?raw";

import { DrawF3DCW, DrawF3DCCW, SetColorsOfF3D } from "./shapes";
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
    const colorLocation = gl.getAttribLocation(shaderProgram, "a_color");
    
    // lookup uniforms
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
    const matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create a buffer for colors.
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // Put the colors in the buffer.
    SetColorsOfF3D(gl);


    {// Nice to see WebGL do all the work, compared to the Software Rasterizer I did where this had to be done manually
        //Culling section
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        //Explanation of what is going in inside culling
        //Good explanation here > https://learnopengl.com/Advanced-OpenGL/Face-culling
        //The theory is that depending on the winding the triangle is made in CCW or CW, 
        //the normal that is created from that triangle will be put in a dot product with the camera's view direction (mathf.dot(normal, viewDirection)), 
        //if the dot product is negative, then that means the normal is facing away from the camera, and thus the triangle is not visible so it is culled else show!
        //Thinking of the theory helped me understand it a lot more!

        //Test the Depth Buffer
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        //Explanation of what is going in inside depth testing
        //Good Explanation here > https://learnopengl.com/Advanced-OpenGL/Depth-testing
        //Depth testing works by comparing the depth value of the fragment with the depth value in the depth buffer.
        //If the comparison is true based on the depth function chosen, for example LEQUAL, then update the color buffer & the depth buffer.
        //Look at the Z Buffer algorithim to see how this works, other algorithms such as Painters algorithim & Scan Line Rendering can help you understand why depth testing is necessary
    }

    let objectF: GameObjectTransforms = {
        translation: [0, 0, -200],
        rotation: [0, Math.PI, Math.PI],
        scale: [1, 1, 1],
        color: [RandomFloat(0, 1), RandomFloat(0, 1), RandomFloat(0, 1), 1]
    }

    var fieldOfViewRadians = 90 * Math.PI/180; //Fov takes degrees and converts to radians
    var aspect = gl.canvas.width / gl.canvas.height;
    var zNear = 1;
    var zFar = 2000;

    Renderer(gl, objectF);

    UpdateSliderValues(objectF);

    function Renderer(gl: WebGLRenderingContext, Transform : GameObjectTransforms): void {

        //webglUtils.resizeCanvasToDisplaySize(gl.canvas); for handling canvas size read more here > https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
        //Tell WebGL to convert from clip space (-1 to 1) to real pixel space (0 to canvas.width/height)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        //Now clearing both color & depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //Tell WebGL to use the shader program with the final material we made above!
        gl.useProgram(shaderProgram);

        {   
            // Turn on the color attribute
            gl.enableVertexAttribArray(colorLocation);

            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
            var size = 3;                 // 3 components per iteration
            var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
            var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
            var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;               // start at the beginning of the buffer
            gl.vertexAttribPointer(
            colorLocation, size, type, normalize, stride, offset);
        }

        {
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
        }

        {
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform4fv(colorUniformLocation, Transform.color);
        }



        let matrix;
        {
            //Offset the pivot to the center of the object
            var moveOriginMatrix = m4.translation(-50, -75, 0);

            //Read this from bottom to top, or right to left for easier understanding
            //1. move the origin to the center of the object //2. rotate the object //3. scale the object //4. translate the object // 5. multiply by the projection matrix to get the clip space positions
            //matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
            {
                var left = 0;
                var right = gl.canvas.width;
                var bottom = gl.canvas.height;
                var top = 0;
                var near = 400;
                var far = -400;
                matrix = m4.orthographic(left, right, bottom, top, near, far);
            }



            matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

            matrix = m4.translate(matrix, Transform.translation[0], Transform.translation[1], Transform.translation[2]);
            matrix = m4.xRotate(matrix, Transform.rotation[0]);
            matrix = m4.yRotate(matrix, Transform.rotation[1]);
            matrix = m4.zRotate(matrix, Transform.rotation[2]);
            matrix = m4.scale(matrix, Transform.scale[0], Transform.scale[1], Transform.scale[2]);
            matrix = m4.multiply(matrix, moveOriginMatrix);

            //Scroll to the gifs shown on https://webglfundamentals.org/webgl/lessons/webgl-2d-matrices.html to see a better visual of matrix transformations
            gl.uniformMatrix4fv(matrixLocation, false, matrix);
        }

        {
            //Draw section!
            //Check the culling section above to see how to cull the triangles, you can set the instructions to cull front or back faces and set the order of the triangles verts with gl.frontFace(gl.CCW);
            //RED IS THE FRONT FACE OF THE F WHILE THE PURPLE IS THE BACK
            
            const isCorrectWinding = true; // change this to see results of different winding direction
            if(isCorrectWinding){
                DrawF3DCCW(gl); //CCW TRIANGLES CULLING BACKFACE! 
            }
            else{
                DrawF3DCW(gl); //IF THIS IS INVISIBLE THEN THE FACES ARE CULLING CORRECTLY! CW TRIANGLES ON THE F TRY TO ROT Y AND SEE THEM CULL FRONT FACING TRIS!
                matrix = m4.yRotate(matrix, 40);
                gl.uniformMatrix4fv(matrixLocation, false, matrix);
            }
        }

        {
            // Draw the geometry.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 16 * 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    function UpdateSliderValues(GameObjectTransform: GameObjectTransforms) {
            //Event listeners for the sliders
    const sliders = ['RangeFOV','RangeTX', 'RangeTY','RangeTZ', 'RangeRX','RangeRY','RangeRZ', 'RangeS', 'RangeC'];
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
            case 'RangeFOV':
                fieldOfViewRadians = value * Math.PI/180;
                break;
            case 'RangeTX':
                // Handle X change
                GameObjectTransform.translation[0] = value;
                break;
            case 'RangeTY':
                // Handle translation change
                GameObjectTransform.translation[1] = value;
                break;
            case 'RangeTZ':
                // Handle translation change
                GameObjectTransform.translation[2] = value;
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
