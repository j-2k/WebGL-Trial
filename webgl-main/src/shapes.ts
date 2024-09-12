import { RandomFloat } from "./custom-math-utils";

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

    /*
    var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    */
}

function DrawGeometry(gl: WebGLRenderingContext) {
    gl.bufferData(
     gl.ARRAY_BUFFER,
     new Float32Array([
         // left column
           0,   0,  0,
          30,   0,  0,
           0, 150,  0,
           0, 150,  0,
          30,   0,  0,
          30, 150,  0,

         // top rung
          30,   0,  0,
         100,   0,  0,
          30,  30,  0,
          30,  30,  0,
         100,   0,  0,
         100,  30,  0,

         // middle rung
          30,  60,  0,
          67,  60,  0,
          30,  90,  0,
          30,  90,  0,
          67,  60,  0,
          67,  90,  0]),
     gl.STATIC_DRAW);
}

export {
    DrawRectangle,
    DrawGeometry
}