/** Bad Guys **/

var badGuys = [];
var maxBadGuys = 10;
var marchDirection = 1;

function addBadGuy(i) {
	badGuys.push({
		x: (i + 1) / (maxBadGuys + 1) * canvas.width,
		y: 20,
		width: 24,
		height: 24,
		speed: 80,
		approach: 18,
		color: '#2C2'
	});
}

function removeBadGuy(badGuy) {
	var i = badGuys.indexOf(badGuy);
	if (i !== -1) {
		badGuys.splice(i, 1);
	}
}

function maybeAddBadGuys() {
	if (badGuys.length > 0) {
		return;
	}
	
	for (var i = 0; i < maxBadGuys; ++i) {
		addBadGuy(i);
	}
}

function updateBadGuys() {
	var firstBadGuy = badGuys[0]; 
	var lastBadGuy = badGuys[badGuys.length - 1];
	if (firstBadGuy.x < 0 || lastBadGuy.x > canvas.width) {
		for (var i = 0; i < badGuys.length; ++i) {
			var badGuy = badGuys[i];
			badGuy.y += badGuy.approach;
		}
		marchDirection *= -1;
	}
	
	for (var i = 0; i < badGuys.length; ++i) {
		var badGuy = badGuys[i];
		badGuy.x += marchDirection * badGuy.speed / fps;
	}
}

function maybeRemoveBadGuys() {
	for (var i = 0; i < bullets.length; ++i) {
		var bullet = bullets[i];
		for (var j = 0; j < badGuys.length; ++j) {
			var badGuy = badGuys[j];
			if (intersects(badGuy, bullet)) {
				removeBullet(bullet);
				--i;
				removeBadGuy(badGuy);
				--j;
			}
		}
	}
}

function update() {
	move(player);
	
	maybeAddBadGuys();
	updateBadGuys();
	maybeRemoveBadGuys();
	
	maybeAddBullet();
	updateBullets();
	maybeRemoveBullets();
	
	bound(player, boundingBox);
}

/** Drawing **/

function drawBadGuys() {
	for (var i = 0; i < badGuys.length; ++i) {
		var badGuy = badGuys[i];
		fillPiece(badGuy);
	}
}

function redraw() {	
	c.clearRect(0, 0, canvas.width, canvas.height);
	drawBadGuys();
	drawBullets();
	drawPlayer();
}