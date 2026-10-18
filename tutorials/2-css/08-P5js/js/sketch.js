
let canvas; 

function setup(){
    canvas = createCanvas(windowWidth, 300, WEBGL);
    canvas.position(0, 260);
    angleMode(DEGREES);
    canvas.style("z-index", -2);
    // background(225);
}

function windowResized(){
    resizeCanvas(windowWidth, windoHeight);
}

function draw(){
   background(0);

   rotateX(60)

   noFill()
   stroke(0)
   strokeWeight(3)

   for (var i = 0; i < 50; i++){

    var r = map(sin(frameCount / 2), -1, 1, 100, 200)
    var g = map(i, 0, 50, 100, 200)
    var b = map(cos(frameCount), -1, 1, 200, 100)

    stroke(r, g, b)

    rotate(frameCount / 20)


    beginShape()
    for (var j = 0; j < 360; j += 60){
        var rad = i * 5
        var x = rad * cos(j)
        var y = rad * sin(j)
        var z = sin(frameCount * 2 + i * 10) * 50

        vertex(x, y, z)
    }
    endShape(CLOSE);
   }
}

// function mouseMoved(){
//     drawThing(mouseX, mouseY);
//     drawThing(mouseX - 50, mouseY + 75);
// }

// function drawThing(_x, _y){
//      strokeWeight(0);
//     fill(random(200, 255), random(200, 255), random(200, 255));
//     ellipse(_x, _y, 30, 30);
// }