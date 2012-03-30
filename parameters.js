var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var particles = [];
var tick = 0;
function loop() {
	createParticles();
	updateParticles();
	killParticles();
	drawParticles();
	setTimeout(loop, 30);
}
setTimeout(loop, 30);

function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function randomColor() {
	return '#'+Math.round(randomBetween(0, 0xFFF)).toString(16)
}

function createParticles() {
	//check on every 10th tick check
	if(tick % 10 == 0) {
		//add particle if fewer than 100
		if(particles.length < 1) {
			particles.push({
					x: randomBetween(0, canvas.width),
					y: 0,
					speed: randomBetween(2, 5),
					radius: randomBetween(5, 10),
					color: "white",
			});
		}
	}
	++tick;
}

function updateParticles() {
	for(var i in particles) {
		var part = particles[i];
		part.y += part.speed;
		part.x = Math.sin(part.y / param('sin-factor', 5, 0)) *
			param('scale', 10, 0) + 200;
	}
}

function killParticles() {
	for(var i in particles) {
		var part = particles[i];
		if(part.y > canvas.height) {
			part.y = 0;
			part.color = randomColor();
		}
	}
}

function drawParticles() {
	var c = canvas.getContext('2d');
	c.fillStyle = "black";
	//c.fillRect(0,0,canvas.width,canvas.height);
	for(var i in particles) {
		var part = particles[i];
		c.beginPath();
		c.arc(part.x, part.y, part.radius, 0, Math.PI*2);
		c.closePath();
		c.fillStyle = part.color;
		c.fill();
	}
}

function clearCanvas() {
	c.clearRect(0, 0, canvas.width, canvas.height);
}