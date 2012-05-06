/** Random Numbers **/

function randomX() {
	return randomBetween(0, canvas.width);
}

function randomY() {
	return randomBetween(0, canvas.height);
}

/** Game **/

player.width = 30;
player.height = 40;

random.seed = 2074710737;

var powerups = [];
var maxPowerups = 3;
var maxPowerupCoolDown = 600;
var powerupCoolDown = 20;

function addPowerup() {
	var size = randomBetween(10, 20);
	powerups.push({
		x: randomX(),
		y: -30,
		width: size,
		height: size,
		color: '#881'
	});
}

function removePowerup(powerup) {
	var i = powerups.indexOf(powerup);
	if (i !== -1) {
		powerups.splice(i, 1);
	}
}

function maybeAddPowerup() {
	if (powerups.length >= maxPowerups) {
		return;
	}
	
	if (randomBetween(0, powerupCoolDown) < 10) {
		powerupCoolDown = maxPowerupCoolDown;
		addPowerup();
	} else {
		--powerupCoolDown;
	}
}

function updatePowerups() {
	for (var i = 0; i < powerups.length; ++i) {
		var powerup = powerups[i];
		powerup.y += 2;
		
		if (intersects(powerup, player)) {
			removePowerup(powerup);
			powerupBullets();
		}
	}
}

function powerupBullets() {
	if (maxBulletCoolDown > 5) {
		maxBulletCoolDown *= 0.8;
	}
}

function removeIfHasRunOffTheBottom(piece, remove) {
	if (sides(piece).top > canvas.height) {
		remove(piece);
	}
}

function maybeRemovePowerup() {
	for (var i = 0; i < powerups.length; ++i) {
		var powerup = powerups[i];
		removeIfHasRunOffTheBottom(powerup, removePowerup);
	}
}

player.score = 0;

function score(points) {
	player.score += points;
}

var original = {x: player.x, y: player.y};

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
				score(100);
			}
			removeIfHasRunOffTheBottom(badGuy, removeBadGuy);
			
			if (intersects(badGuy, player)) {
				player.score = 0;
				badGuys = [];
				player.x = original.x;
				player.y = original.y;
				
				if (--player.lives === 0) {
					gameOver = true;
				}
			}
		}
	}
}

/** Update **/

function update() {
	move(player);
	
	maybeAddBadGuys();
	updateBadGuys();
	maybeRemoveBadGuys();
	
	maybeAddBullet();
	updateBullets();
	maybeRemoveBullets();
	
	maybeAddPowerup();
	updatePowerups();
	maybeRemovePowerup();
	
	bound(player, boundingBox);
}

function drawPowerups() {
	for (var i = 0; i < powerups.length; ++i) {
		var powerup = powerups[i];
		fillPiece(powerup);
	}
}

player.lives = 3;
var gameOver = false;

function redraw() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	if (gameOver) {
		c.fillStyle = 'red';
		c.font = "bold 60pt Arial";
		var baseX = 120;
		var baseY = 140;
		c.fillText("GAME", baseX, baseY);
		c.fillText("OVER", baseX, baseY + 100);
	} else {
		drawPowerups();
		drawBadGuys();
		drawBullets();
		drawPlayer();
		
		var div = document.getElementById('score');
		div.innerHTML = player.score;
	}
}

function restart() {
	if (gameOver) {
		player.lives = 3;
		gameOver = false;
	}
}

key('w', restart);
key('a', restart);
key('s', restart);
key('d', restart);

/** State **/

state('random heldKeys player bullets bulletCoolDown maxBulletCoolDown badGuys marchDirection powerups maxPowerupCoolDown powerupCoolDown gameOver');
