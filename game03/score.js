player.score = 0;

function score(points) {
	player.score += points;
}

function drawScore() {
	var div = document.getElementById('score');
	div.innerHTML = player.score;
}