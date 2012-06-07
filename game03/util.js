/** Array Util **/

function reject(array, condition) {
	for (var i = 0; i < array.length; ++i) {
		var item = array[i];
		if (condition(item)) {
			array.splice(i, 1);
			--i; // so that we don't skip any.
		}
	}
}

/** Game Util **/

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var fps = 60;

var boundingBox = {
	x: canvas.width / 2,
	y: canvas.height / 2,
	width: canvas.width,
	height: canvas.height
}

function sides(p) {
	return {
		top: p.y - p.height / 2,
		bottom: p.y + p.height / 2,
		left: p.x - p.width / 2,
		right: p.x + p.width / 2
	};
}

function intersects(p, q) {
	var s = sides(p);
	var t = sides(q);
	return !(
		s.top    > t.bottom || // below
		s.bottom < t.top    || // above
		s.left   > t.right  || // to right of
		s.right  < t.left      // to left of
	);
}

function bound(p, q) {
	var s = sides(p);
	var t = sides(q);

	if (s.top < t.top) {
		p.y = t.top + p.height / 2;
	}
	if (s.bottom > t.bottom) {
		p.y = t.bottom - p.height / 2;
	}
	if (s.left < t.left) {
		p.x = t.left + p.width / 2;
	}
	if (s.right > t.right) {
		p.x = t.right - p.width / 2;
	}
}

function move(p) {
	if (isHoldingKey('w')) {
		p.y -= p.speed / fps;
	}
	if (isHoldingKey('a')) {
		p.x -= p.speed / fps;
	}
	if (isHoldingKey('s')) {
		p.y += p.speed / fps;
	}
	if (isHoldingKey('d')) {
		p.x += p.speed / fps;
	}
}

function fillPiece(p) {
	c.fillStyle = p.color;
	var x = p.x - p.width / 2;
	var y = p.y - p.height / 2;
	c.fillRect(x, y, p.width, p.height);
}

function ifHasRunOffTheTop(piece) {
	return sides(piece).bottom < 0;
}

function ifHasRunOffTheBottom(piece) {
	return sides(piece).top > canvas.height;
}