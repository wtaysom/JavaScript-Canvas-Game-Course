var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

/*
c.fillStyle = 'blue';
c.strokeStyle = 'green'
c.lineWidth = 5;
c.strokeRect(40, 60, 150, 100);
c.fillRect(40, 60, 150, 100);
*/

/*
var x = 20;
var t0 = new Date();
function drawIt() {
	c.clearRect(0,0,canvas.width,canvas.height);
	c.fillStyle = "red";
	c.fillRect(x,200,200,200);
	x+=5;
	
	var t1 = new Date();
	//console.log(t1 - t0);
	t0 = t1;
}

setInterval(drawIt, 16);
*/

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
		part.x = Math.sin(part.y / 5) * 10 + 200;
	}
}

function killParticles() {
	for(var i in particles) {
		var part = particles[i];
		if(part.y > canvas.height) {
			part.y = 0;
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