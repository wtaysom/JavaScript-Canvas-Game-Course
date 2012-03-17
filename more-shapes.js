var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

// Triangle
c.fillStyle = "#ccddff";
c.beginPath();
c.moveTo(100,100);
c.lineTo(400,50);
c.lineTo(400,300);
c.closePath();
c.fill();
c.strokeStyle = "rgb(0,128,0)";
c.lineWidth = 5.0;
c.stroke();

// Gradient
var grad = c.createLinearGradient(0,0,200,200);
grad.addColorStop(0, "white");
grad.addColorStop(1, "black");
c.fillStyle = grad;
c.fillRect(0,0,400,300);

// Image
var img = new Image();
img.onload = function() {
    var pat = c.createPattern(img,'repeat');    
    c.fillStyle = pat;
    c.fillRect(10,10,100,100);    
    
    var pat2 = c.createPattern(img,'repeat-y');    
    c.fillStyle = pat2;
    c.fillRect(10,150,100,100);    
    
}
img.src = 'smile.png';

// Opacity
c.fillStyle = "red";
c.fillRect(100,100,400,300);
c.globalAlpha = 0.5;
c.fillStyle = "white";
c.fillRect(100,100,400,300);
c.globalAlpha = 1.0;

// Paths
c.fillStyle = "red";
 
c.beginPath();
c.moveTo(10,100);
c.bezierCurveTo(20,200, 500,200, 500,100);
c.lineTo(500,300);
c.lineTo(10,300);
c.closePath();
c.fill();
 
c.lineWidth = 4;
c.strokeStyle = "black";
c.stroke();

// Pixel Adjustment
// python -m SimpleHTTPServer
var img = new Image();
img.onload = function() {
    //draw the image to the canvas
    c.drawImage(img,0,0);
    //get the canvas data
    var data = c.getImageData(0,0,canvas.width,canvas.height);
    //invert each pixel
    for(n=0; n<data.width*data.height; n++) {
        var index = n*4; 
        data.data[index]   = 255-data.data[index];
        data.data[index+1] = 255-data.data[index];
        data.data[index+2] = 255-data.data[index];
        //don't touch the alpha
    }
    
    //set the data back
    c.putImageData(data,0,0);
}
img.src = "baby_original.png";