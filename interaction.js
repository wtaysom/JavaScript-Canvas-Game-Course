var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;
var key = 0;

function handleMouse(event) {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
	
	if (event.type == 'mousedown') {
		mouseDown = true;
	} else if (event.type == 'mouseup') {
		mouseDown = false;
	}
	
	redraw();
}

function handleKey(event) {
	if (event.type == 'keydown') {
		key = event.which;
	}
	
	// Disable navigation (e.g. delete key).
	event.preventDefault();
	
	redraw();
}

function redraw() {	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawCursor();
	drawLabel();
}

var cursorStartAngle = Math.PI;
var cursorEndAngle = Math.PI * 1.75;
function drawCursor() {
	var radius = mouseDown ? 15 : 10;
	ctx.beginPath();
	ctx.arc(mouseX, mouseY, radius, cursorStartAngle, cursorEndAngle)
	ctx.closePath();
	ctx.fillStyle = 'white';
	ctx.fill();
}

function drawLabel() {
	var labelTypeface = 'Menlo';
	var labelSize = 14;
	var labelOffset = 3;
	var text = mouseX+","+mouseY+" -- "+key+" "+String.fromCharCode(key);
	
	ctx.font = labelSize+'pt '+labelTypeface;
	ctx.fillStyle = 'white';
	ctx.fillText(text, labelOffset, labelOffset + labelSize);
}