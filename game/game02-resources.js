/** Pause and Resume **/

var info = document.getElementById('info');
var infoOriginalHTML;

function animate() {
	if (!paused) {
		update();
		redraw();
		setTimeout(animate, 1000 / fps);
	}
}

function pause() {
	if (paused) {
		return;
	}
	paused = true;
	infoOriginalHTML = info.innerHTML;
	info.innerHTML = "paused";
}

function resume() {
	if (!paused) {
		return;
	}
	paused = false;
	info.innerHTML = infoOriginalHTML;
	animate();
}


function togglePaused() {
	if (paused) {
		resume();
	} else {
		pause();
	}
}

function spacePressed() {
	togglePaused();
}

/** Random Numbers **/

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function randomX() {
	return randomBetween(0, canvas.width);
}

function randomY() {
	return randomBetween(0, canvas.height);
}

function randomColor() {
	return '#'+Math.round(randomBetween(0, 0xFFF)).toString(16)
}

/** Game **/

player.width = 32;
player.height = 46;

/** Resources **/

player.gathered = 0;
var resources = [];
var maxResources = 10;
var maxResourceCoolDown = 600;
var resourceCoolDown = maxResourceCoolDown;

function newResource() {
	var size = randomBetween(20, 40);
	resources.push({
		x: randomX(),
		y: randomY(),
		width: size,
		height: size,
		color: '#881'
	});
}

function maybeSpawnResource() {
	if (resources.length >= maxResources) {
		return;
	}
	
	if (randomBetween(0, resourceCoolDown) < 10) {
		resourceCoolDown = maxResourceCoolDown;
		newResource();
	} else {
		--resourceCoolDown;
	}
}

function removeResource(resource) {
	var i = resources.indexOf(resource);
	if (i !== -1) {
		resources.splice(i, 1);
	}
}

function gatherResource(resource) {
	removeResource(resource);
	++player.gathered;
}

function update() {
	maybeSpawnResource();

	// Move player.
	move(player);

	for (var i = 0; i < resources.length; ++i) {
		var resource = resources[i];
		if (intersects(resource, player)) {
			gatherResource(resource);
		}
	}

	// Keep the player on screen.
	bound(player, boundingBox);
}

/** Drawing **/

function drawResources() {
	for (var i = 0; i < resources.length; ++i) {
		var resource = resources[i];
		fillPiece(resource);
	}
}

function redraw() {	
	c.clearRect(0, 0, canvas.width, canvas.height);
	drawResources();
	drawPlayer();
	if (player.gathered > 0) {
		info.innerHTML = "Gather Resources: "+player.gathered
	}
}