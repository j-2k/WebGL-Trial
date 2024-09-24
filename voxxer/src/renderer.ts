import{ Time } from './time-manager';

function EngineRenderer(gl : WebGLRenderingContext)
{
    Start(gl);

    UpdateCore(gl);
}

function Start(gl : WebGLRenderingContext)
{
    //Enable Backface Culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    //Enable Depth Testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //Set Clear Color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function UpdateCore(gl: WebGLRenderingContext) {
    requestAnimationFrame(function() {
        Time.CalculateTimeVariables();

        Update(gl);

        UpdateCore(gl);
    });
}

function Update(gl: WebGLRenderingContext,)
{
    console.log("Updating... + DT = " + Time.deltaTime);
    console.log("Updating... + OT = " + Time.time);
}

export {
    EngineRenderer
}