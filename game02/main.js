function update() {
	move(player);
	
	// maybeAddBadGuys();
	// updateBadGuys();
	// maybeRemoveBadGuys();
	
	maybeAddBullet();
	updateBullets();
	maybeRemoveBullets();
	
	maybeAddMissile();
	updateMissiles();
	maybeRemoveMissiles();
	
	// maybeAddPowerup();
	// updatePowerups();
	// maybeRemovePowerup();
	
	updateBoss();
	
	bound(player, boundingBox);
}

function redraw() {
	c.clearRect(0, 0, canvas.width, canvas.height);
	if (gameOver) {
		drawGameOver();
	} else {
		drawPowerups();
		drawBadGuys();
		drawBullets();
		drawMissiles();
		drawBoss();
		drawPlayer();
		drawScore();
	}
}

/** State **/

random.seed = 2074710737;

state('random heldKeys player bullets bulletCoolDown maxBulletCoolDown badGuys marchDirection powerups maxPowerupCoolDown powerupCoolDown gameOver boss missiles missilesCoolDown');