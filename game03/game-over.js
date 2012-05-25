player.lives = 3;
var gameOver = false;

function drawGameOver() {
	c.fillStyle = 'red';
	c.font = "bold 60pt Arial";
	var baseX = 120;
	var baseY = 140;
	c.fillText("GAME", baseX, baseY);
	c.fillText("OVER", baseX, baseY + 100);
}

function restart() {
	if (gameOver) {
		player.lives = 3;
		gameOver = false;
	}
}

key('w,a,s,d', restart);