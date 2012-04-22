/** Random Numbers **/

var random = new PMCRandom();

function randomBetween(min, max) {
	return random.between(min, max);
}