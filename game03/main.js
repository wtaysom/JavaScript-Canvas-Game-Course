function update() {
	move(player);
	
	// maybeAddBadGuys();
	// updateBadGuys();
	// maybeRemoveBadGuys();
	
	bullets.maybeAdd();
	bullets.update();
	bullets.maybeRemove();
	
	missiles.maybeAdd();
	missiles.update();
	missiles.maybeRemove();
	
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
		bullets.draw();
		missiles.draw();
		drawBoss();
		drawPlayer();
		drawScore();
	}
}

/** State **/

random.seed = 2074710737;

state('random heldKeys player bullets bulletCoolDown maxBulletCoolDown badGuys marchDirection powerups maxPowerupCoolDown powerupCoolDown gameOver boss missiles missilesCoolDown');