var bullet = {
	x: 288,
	y: 256,
	color: '#44F',
	speed: 300
};

var bullet1 = {
	x: 100,
	y: 100,
	color: '#44F',
	speed: 300
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
	bullet.y -= 10;
}

function travel1(bullet1) {
	bullet1.y += 10;
}

function bulletIsOutOfBounds() {
	var s = sides(bullet);
	var t = sides(boundingBox);
	return s.top < t.top;
}

function bulletIsOutOfBounds1() {
	var s = sides(bullet1);
	var t = sides(boundingBox);
	return s.bottom > t.bottom;
}

function resetBullet(bullet) {
	bullet.x = player.x;
	bullet.y = player.y;
}

function resetBullet1(bullet1) {
	if (german) {
		bullet1.x = german.x;
		bullet1.y = german.y;
	}
}

function intersects(p, q) {
	if (!p || !q) {
		return false;
	}
	
	var s = sides(p);
	var t = sides(q);
	return !(
		s.top    > t.bottom || // below
		s.bottom < t.top    || // above
		s.left   > t.right  || // to right of
		s.right  < t.left      // to left of
	);
}

function update() {
	move(player);

	timeUntilBulletShoots -= 1000 / fps;
	if (timeUntilBulletShoots < 0) {
		travel(bullet);
		if (bulletIsOutOfBounds()) {
			resetBullet(bullet);
		}
	} else {
		move(bullet);
	}
	
	if (german) {
		german.x += 1;
	}
	
	travel1(bullet1);
	if (bulletIsOutOfBounds1()) {
		resetBullet1(bullet1);
	}
	
	if (intersects(bullet, german)) {
		german = null;
	}
	
	if (intersects(bullet1, player)) {
		player.x = NaN;
	}
	
	bound(player, boundingBox);
}

function drawBullet() {
	fillPiece(bullet);
}

function drawBullet1() {
	fillPiece(bullet1);
}

function drawGerman() {
	if (german) {
		fillPiece(german);
	}
}

function redraw() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	drawPlayer();
	drawBullet();
	drawGerman();
	drawBullet1();
}