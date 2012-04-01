var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mouseDown = false;
var width = 65;
var height = 65;
var x = (canvas.width - width) / 2;
var y = (canvas.height - height) / 2;

function animate() {
	if (isHoldingKey('d')) {
		x += 1;
	}
	redraw();
	setTimeout(animate, 10);
}
setTimeout(animate, 10)

key('w', function() {
	y -= 10;
	redraw();
});

key('a', function() {
	x -= 10;
	redraw();
});

key('s', function() {
	y += 10;
	redraw();
});

key('up', function() {
	height -= 10;
	redraw();
});

key('left', function() {
	width -= 10;
	redraw();
});

key('down', function() {
	height += 10;
	redraw();
});

key('right', function() {
	width += 10;
	redraw();
});

function redraw() {	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'red';
	ctx.fillRect(x, y, width, height);
}

redraw();