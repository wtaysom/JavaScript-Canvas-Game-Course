var bullet = {
	x: 288,
	y: 256,
	color: '#44F',
	speed: 300,
	direction: -1
};

var bullet1 = {
	x: 100,
	y: 100,
	color: '#A88',
	speed: 300,
	direction: 1
};

var german = {
	x: 100,
	y: 100,
	color: '#FF4',
	speed: 200,
	width: 100,
	height: 100
}

bullet.width = 10;
bullet.height = 22;
bullet1.width = 10;
bullet1.height = 22;

var timeUntilBulletShoots = 1000;

function travel(bullet) {
	bullet.y += 10 * bullet.direction;
}

function bulletIsOutOfBounds(bullet) {
	var s = sides(bullet);
	var t = sides(boundingBox);
	return s.top < t.top || s.bottom > t.bottom;
}

function resetBullet(bullet, location) {
	if (location) {
		bullet.x = location.x;
		bullet.y = location.y;
	}
}

function update() {
	move(player);

	timeUntilBulletShoots -= 1000 / fps;
	if (timeUntilBulletShoots < 0) {
		travel(bullet);
		if (bulletIsOutOfBounds(bullet)) {
			resetBullet(bullet, player);
		}
	} else {
		move(bullet);
	}
	
	if (german) {
		german.x += 1;
	}
	
	travel(bullet1);
	if (bulletIsOutOfBounds(bullet1)) {
		resetBullet(bullet1, german);
	}
	
	if (intersects(bullet, german)) {
		german = null;
	}
	
	if (intersects(bullet1, player)) {
		player.x = NaN;
	}
	
	bound(player, boundingBox);
}

var pieces = ['player', 'bullet', 'german', 'bullet1'];

function fillPieces() {
	for (var i = 0; i < pieces.length; ++i) {
	 	var piece = window[pieces[i]];
		if (piece) {
	 		fillPiece(piece);
		}
	}
}

function redraw() {
	c.clearRect(0, 0, canvas.width, canvas.height);	
	fillPieces();
}




german.x = 150; // easy to hit player moving left.

function intersects(p, q) {
	if (!p || !q) {
		return false;
	}
	
	var s = sides(p);
	var t = sides(q);
	return (
		s.top    < t.bottom &&
		s.bottom > t.top    &&
		s.left   < t.right  &&
		s.right  > t.left
	);
}

state('random heldKeys player bullet timeUntilBulletShoots german bullet1');