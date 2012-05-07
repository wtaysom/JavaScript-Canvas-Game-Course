// Simple reproducable random numbers.
//
// See <http://www.newkind.co.uk/articles/game-programming/random-numbers.php> and
// <http://www.firstpr.com.au/dsp/rand31/>.
;(function(global) {

var TWO_26 = Math.pow(2, 26);
var TWO_31 = Math.pow(2, 31);
var TWO_53 = Math.pow(2, 53);

var A = 16807;
var MASK = TWO_31 - 1;

function PMCRandom(seed) {
	if (seed === undefined) {
		seed = Math.floor(Math.random() * TWO_31);
	}
	this.seed = seed;
}

PMCRandom.prototype.rand = function(limit) {
	if (limit === undefined) {
		limit = TWO_31;
	}
	
	var lo = A * (this.seed & 0xffff);
	var hi = A * (this.seed >> 16);
	
	lo += (hi & 0x7fff) << 16;
	lo += hi >> 15;
	if (lo > MASK) lo -= MASK;
	
	this.seed = lo;
	return lo % limit;
}

PMCRandom.prototype.random = function() {
	var r53 = (this.rand() >> 4) * TWO_26 + (this.rand() >> 5);
	return r53 / TWO_53;
}

PMCRandom.prototype.between = function(lowerLimit, upperLimit) {
	return this.rand(upperLimit - lowerLimit) + lowerLimit;
}

global.PMCRandom = PMCRandom;

})(window);