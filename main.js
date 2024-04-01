var vShader=`
uniform mat4 myFinaleMatrix;//
attribute vec4 myPosition;
attribute vec4 myColor;
varying vec4 myColorVarying;
void main()
{
    gl_Position = myFinaleMatrix * myPosition;
    gl_PointSize = 10.0;
    myColorVarying = myColor;
}
`;

var fShader=`
precision mediump float;
varying vec4 myColorVarying;
void main()
{
    gl_FragColor = myColorVarying; 
}
`;

var tX =0.0,tY=0.0;
var distanceStepX = 3.0;
var distanceStepY = 3.0;
function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = getWebGLContext(canvas);
    initShaders(gl,vShader,fShader);

    var positionLocation = gl.getAttribLocation(gl.program,"myPosition");
    var colorLocation = gl.getAttribLocation(gl.program,"myColor");
    var finaleMatrixLocation = gl.getUniformLocation(gl.program,"myFinaleMatrix");
    
    var finaleMatrix= new Matrix4();

    var n= initBuffer(gl,positionLocation,colorLocation); 

    gl.clearColor(1,0.85,0.9,1.0);

    gl.uniformMatrix4fv(finaleMatrixLocation,false,finaleMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
    
    canvas.onmousedown = function(ev){click(gl,finaleMatrix,finaleMatrixLocation,n,canvas,ev)};
}

var x ,y;
var currentLocation=[-0.70,-0.05];
function click(gl,finaleMatrix,finaleMatrixLocation,n,canvas,ev)
{
    x = ev.clientX;
    y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();//
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2-(y - rect.top))/(canvas.height/2);

    distanceStepX = x - currentLocation[0]; 
    distanceStepY = y -  currentLocation[1];
   
    lastTime = Date.now();
    var tick =function(){
        animate();
        draw(gl,finaleMatrixLocation,finaleMatrix,n);
        var numberOfRequest = requestAnimationFrame(tick);
        if (Math.abs(x-currentLocation[0])<=0.01&&Math.abs(y-currentLocation[1])<=0.01)
        {
            cancelAnimationFrame(numberOfRequest);
        }
    };
    tick();


}



function draw(gl,finaleMatrixLocation,finaleMatrix,n)//n
{
    finaleMatrix.setTranslate(tX,tY,0.0);//0.0 has to be here
    gl.uniformMatrix4fv(finaleMatrixLocation,false,finaleMatrix.elements);////elements
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

var lastTime;
function animate()
{
   
    var now = Date.now();
    var elapse = now - lastTime;
    lastTime = now;

    tX= tX + (distanceStepX * elapse)/1000.0;
    tY= tY + (distanceStepY * elapse)/1000.0;
    currentLocation=[-0.70+tX,-0.05+tY];
}

function initBuffer(gl,positionLocation,colorLocation)
{
    var vertices = new Float32Array([
        -0.95,-0.25,Math.random(),Math.random(),Math.random(),
        -0.70,0.25,Math.random(),Math.random(),Math.random(),
        -0.45,-0.25,Math.random(),Math.random(),Math.random(),

        -0.95,-0.25,Math.random(),Math.random(),Math.random(),
        -0.70,0.25,Math.random(),Math.random(),Math.random(),
        -0.75,-0.05,Math.random(),Math.random(),Math.random(),

        -0.70,0.25,Math.random(),Math.random(),Math.random(),
        -0.45,-0.25,Math.random(),Math.random(),Math.random(),
        -0.65,-0.05,Math.random(),Math.random(),Math.random(),

        -0.95,-0.25,Math.random(),Math.random(),Math.random(),
        -0.45,-0.25,Math.random(),Math.random(),Math.random(),
        -0.70,-0.1,Math.random(),Math.random(),Math.random(),

        -0.75,-0.05,Math.random(),Math.random(),Math.random(),
        -0.65,-0.05,Math.random(),Math.random(),Math.random(),
        -0.70,-0.1,Math.random(),Math.random(),Math.random(),

        -0.75,-0.05,Math.random(),Math.random(),Math.random(),
        -0.65,-0.05,Math.random(),Math.random(),Math.random(),
        -0.70,0.01,Math.random(),Math.random(),Math.random(),

        -0.70,-0.05,Math.random(),Math.random(),Math.random(),
    ]);
    var n = 18;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    
    var FSize=vertices.BYTES_PER_ELEMENT;//

    gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,false,5*FSize,0);
    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(colorLocation,3,gl.FLOAT,false,5*FSize,2*FSize);
    gl.enableVertexAttribArray(colorLocation);

    return n;
}