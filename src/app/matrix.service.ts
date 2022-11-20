import { Parser } from '../../node_modules/expr-eval';




let equation:string = "y = sin (x) "

let canvas: any;
let ctx: any;


let X_MOUSE_OLD: number = 0;
let Y_MOUSE_OLD: number = 0;

// If i were to work on this project the first thing i would focus on is implementing zoom
// but due to it being hard to implement due to the limitations of typescript i chose not to

let Y_ZOOM_MULTIPLIER: number = 100;
let X_ZOOM_MULTIPLIER: number = 10;

let mouseDown: boolean = false;

let X_SIZE: number;
let Y_SIZE: number;

let X_OFFSET: number = 0;
let Y_OFFSET: number = 0;

let X_OFFSET_OLD: number = 0;
let Y_OFFSET_OLD: number = 0;

let xCenter: number = 0;
let yCenter: number = 0;

let xZeroOnScreen:number = 0;

let ableToRender: boolean = true;

let pixelMatrix: boolean[][] = [];


const parser = new Parser();

const _RED: string = "rgb(255,145.6,143.2)";
const _GREEN: string = "rgb(151.2,255,151.2)";
const _GRAY: string = " rgb(100,100,100)";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


export function InitMatrix(dimensionX: number = 0, dimensionY: number = 0) {
    canvas = <HTMLCanvasElement>document.getElementById('graph');
    ctx = canvas.getContext('2d');

    X_SIZE = (dimensionX == 0 ? window.innerWidth : dimensionX);
    Y_SIZE = dimensionY == 0 ? window.innerHeight : dimensionY;

    document.getElementById('graph')?.setAttribute("width", "" + X_SIZE)
    document.getElementById('graph')?.setAttribute("height", "" + Y_SIZE)

    for (let x = 0; x < X_SIZE; x++) {
        pixelMatrix.push([])
        for (let y = 0; y < Y_SIZE; y++) {
            pixelMatrix[x].push(false)
            pixelMatrix[x][y] = false
        }
    }


    xCenter = Math.round(X_SIZE / 2);
    yCenter = Math.round(Y_SIZE / 2);
    
X_OFFSET = 100;
X_OFFSET_OLD = X_OFFSET;

    Y_OFFSET = -200;
    Y_OFFSET_OLD = Y_OFFSET;

    console.log("Matrix  Size is " + X_SIZE + " : " + Y_SIZE)
    
    Render();
}


export function InitCanvasLogic() {
    document.addEventListener('mousemove', onMouseUpdate, false);
    document.addEventListener('mouseenter', onMouseUpdate, false);


    window.addEventListener("scroll", function () {
       console.log("asdf")
    }, false);
    document.body.onmousedown = function () {
        mouseDown = true;
    }
    document.onmouseup = function () {
        X_OFFSET_OLD = X_OFFSET;
        Y_OFFSET_OLD = Y_OFFSET;
        mouseDown = false;
    }


}



function DrawAxesToCanvas() {
    /// Y AXESE ///


    ctx.beginPath();
    ctx.moveTo(xZeroOnScreen - X_OFFSET, 0);
    ctx.strokeStyle = _RED;

    ctx.lineTo(xZeroOnScreen - X_OFFSET, Y_SIZE);
    ctx.stroke();


    /// X AXESE ///

              ctx.beginPath();
        ctx.moveTo(0, 0 - Y_OFFSET);
        ctx.strokeStyle = _GREEN;
    
           ctx.lineTo(X_SIZE, 0 - Y_OFFSET);
        ctx.stroke();
}

function DrawMatrixToCanvas() {


    let oldX: number = 0;
    let oldY: number = 0;

    ctx.strokeStyle = _GRAY;
    ctx.lineWidth = 3;

    for (let x = 0; x < X_SIZE; x++) {
        for (let y = 0; y < Y_SIZE; y++) {
            if (pixelMatrix[x][y] != true)
                continue;

             if (oldX != 0 || oldY != 0) {
                ctx.beginPath();
                ctx.moveTo(oldX, oldY);

                ctx.lineTo(x, y);
                ctx.stroke();
             }
            oldX = x;
            oldY = y;



        }
    }

}


function CalculateEquation(equation: string) {

    equation = equation.replace("y=", "");
    equation = equation.replace("²", "^2");
    equation = equation.replace("³", "^3");


   
    let expr = parser.parse(equation );

        for (let i = 0; i < X_SIZE; i++) {
            
       

        const centeredX =  i - xCenter;
        const x = ( centeredX+ X_OFFSET) / X_SIZE 
        // Getting position for Y Axese
        if(x == 0)
            xZeroOnScreen =    -centeredX  / X_SIZE+xCenter;

    
        pixelMatrix[ i    ][Math.round(expr.evaluate({ x: x * X_ZOOM_MULTIPLIER}) * Y_ZOOM_MULTIPLIER) - Y_OFFSET] = true;
    }





}
async function WaitForNextFrame() {
    ableToRender = false;
    //16ms == 60 fps
    await delay(16);
    ableToRender = true;
}

function onMouseUpdate(e: any) {
    if (mouseDown) {
        if (!ableToRender)
            return;

        X_OFFSET = -(e.pageX - X_MOUSE_OLD) + X_OFFSET_OLD;
        Y_OFFSET = -(e.pageY - Y_MOUSE_OLD) + Y_OFFSET_OLD;
        Render();
        WaitForNextFrame();
    } else {
        X_MOUSE_OLD = e.pageX;
        Y_MOUSE_OLD = e.pageY;
    }
}

function Render() {

    ClearCanvas();
    ClearMatrix();

    CalculateEquation(equation);

    DrawAxesToCanvas();
    DrawMatrixToCanvas();
}
function ClearMatrix() {
    for (let x = 0; x < pixelMatrix.length; x++) {
        for (let y = 0; y < pixelMatrix[x].length; y++) {
            pixelMatrix[x][y] = false;
        }
    }
}
function ClearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}



export function SetEquation() {
    let localEquation: string = "";

    localEquation += (<HTMLInputElement>document.getElementsByClassName("equation-input")[0]).value;
    console.log("Equation is = " + localEquation)

    equation = localEquation;

    Render();
}
