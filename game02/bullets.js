var bullets = [];
var maxBullets = 30;
var maxBulletCoolDown = 20;
var bulletCoolDown = maxBulletCoolDown;

function addBullet() {
	bullets.push({
		x: player.x,
		y: sides(player).top,
		width: 4,
		height: 16,
		speed: 400,
		color: '#C84'
	});
}

function removeBullet(bullet) {
	var i = bullets.indexOf(bullet);
	if (i !== -1) {
		bullets.splice(i, 1);
	}
}

function maybeAddBullet() {
	if (bullets.length >= maxBullets) {
		return;
	}
	
	if (bulletCoolDown > 0) {
		--bulletCoolDown;
		return;
	}
	
	bulletCoolDown = maxBulletCoolDown;
	addBullet();
}

function updateBullets() {
	for (var i = 0; i < bullets.length; ++i) {
		var bullet = bullets[i];
		bullet.y -= bullet.speed / fps;
	}
}

function maybeRemoveBullets() {
	for (var i = 0; i < bullets.length; ++i) {
		var bullet = bullets[i];
		if (bullet.y < -bullet.height * 2) {
			removeBullet(bullet);
			--i; // so that we don't skip any.
		}
	}
}

function drawBullets() {
	for (var i = 0; i < bullets.length; ++i) {
		var bullet = bullets[i];
		fillPiece(bullet);
	}
}