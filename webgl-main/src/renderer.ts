import { default_vertex_shader } from "./shaders-glsl/defaultshader/vertexshader.glsl?raw";
import { default_fragment_shader } from "./shaders-glsl/defaultshader/fragmentshader.glsl?raw";

function Renderer(gl: WebGLRenderingContext) : void {
    if (!gl) {
        console.error("Failed to get WebGL context/Might not be supported");
        return;
    }

    gl?.clearColor(0.5,0.2,0.1,1.);
    gl?.clear(gl.COLOR_BUFFER_BIT);

    //const vertexshader = CreateShader(gl, gl.VERTEX_SHADER, default_vertex_shader);
}

function CreateShader(gl: WebGLRenderingContext, type: number, source: string) : WebGLShader | null {
    const shader = gl.createShader(type) as WebGLShader | null;
    if (!shader) {
        console.error("Failed to create shader");
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compileStatus : boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compileStatus) {
        return shader;
    }
    
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

export {
    Renderer,
}
