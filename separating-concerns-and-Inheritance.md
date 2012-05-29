# Separating Concerns and Inheritance

(Duplicate of an email.)

Hello John,

Greetings from Chicago.  What a start for a trip!  Four legs, four counties, only a few fights with airline officials, "What do you mean our luggage is on the carrousel?  We have a connecting flight."

I'm sorry I wasn't able to hear you clearly on the phone the other day and that we weren't able to meet up; but since I had two specific things I wanted to demonstrate, doing so by email will pose no trouble.

## Separating Concerns

When programming, we define high-level actions in terms of other more primitive actions.  For example given a list of pieces, when we want to do some thing with each of them, we write something like:

	for (var i = 0; i < pieces.length; ++i) {
		var piece = pieces[i];
		// do something with piece
	}

Array `length`, the index variable `i`, iteration with `for`, and array access `pieces[i]` are our primitive actions.  The high-level action is to do something with each piece.  So it makes sense to turn `doSomething` into a function and `forEach` into a function.  Something like this:

	function doSomething(piece) {
		// do something with piece
	}

	function forEach(array, action) {
		for (var i = 0; i < array.length; ++i) {
			var item = array[i];
			action(item);
		}
	}
	
	// Same as the `for` loop.
	forEach(pieces, doSomething);

That's a start.  We have separated how to step through each item in an array `forEach` from what we want to do with each piece `doSomething`.  Separation of concerns is a good thing, it can help make understanding a program and expressing ourselves easier.

Sometimes the situation can get a bit more tricky.  Sometimes high-level actions will interact in funny ways.  Recall this example:

	function maybeRemoveMissiles() {
		for (var i = 0; i < missiles.length; ++i) {
			var missile = missiles[i];
			removeIfHasRunOffTheBottom(missile, removeMissile);
		}
	}

	function removeIfHasRunOffTheBottom(piece, remove) {
		if (sides(piece).top > canvas.height) {
			remove(piece);
		}
	}

	function removeMissile(missile) {
		var i = missiles.indexOf(missile);
		if (i !== -1) {
			missiles.splice(i, 1);
		}
	}

The hope is that by having `removeMissile` and `removeIfHasRunOffTheBottom` we can simplify `maybeRemoveMissiles`, but we found an interaction between `removeMissile` and `maybeRemoveMissiles`.  Since `removeMissile` splices the `missiles` array, the index `i` in `maybeRemoveMissiles ` is made to refer to a different object which we end up skipping.

Let's see how `splice` affects `i`.  (We went through before, but I keep bringing it up because it's very common problem.)  Suppose instead of missiles we have an array of letters:

	letters = ["a", "b", "c", "d", "e"]

and an index:

	i = 2;

The letter at index `i` is "c":

	letters[i]; //> "c"

If we splice letters to get rid of "c"

	letters.splice(i, 1); //> ["c"]

then two things happen.  First, letters no longer contains "c":

	letters; //> ["a", "b", "d", "e"]

That's what we want.  But also letters after "c" shift down, so `i` refers to a different letter:

	letters[i]; //> "d"

Then after incrementing `i`:

	++i; //> 3

We skip "d":

	letters[i]; //> "e"

Oops.

When I first wrote some code for bullets, I remembered to account for how `splice` affects indices:

	function maybeRemoveBullets() {
		for (var i = 0; i < bullets.length; ++i) {
			var bullet = bullets[i];
			if (bullet.y < -bullet.height * 2) {
				removeBullet(bullet);
				--i; // so that we don't skip any.
			}
		}
	}

When we were working on `maybeRemoveMissiles` together, I forgot the `--i`.  It's an easily overlooked detail.  When you separate concerns properly, details can be understood and handled in one place so that they can be safely ignored thereafter.  

Let's write one function for conditionally rejecting items from an array.  Where the condition to `reject` is the interesting question `ifHasRunOffTheTop`:

	function maybeRemoveBullets() {
		reject(bullets, ifHasRunOffTheTop);
	}

	function reject(array, condition) {
		for (var i = 0; i < array; ++i) {
			var item = array[i];
			if (condition(item)) {
				array.splice(i, 1);
				--i; // so that we don't skip any.
			}
		}
	}

	function ifHasRunOffTheTop(piece) {
		//return piece.y < -piece.height * 2;
		// or more clearly:
		return sides(piece).bottom < 0;
	}

Likewise, we can fix up `maybeRemoveMissiles`:

	function maybeRemoveMissiles() {
		reject(missiles, ifHasRunOffTheBottom);
	}

	function ifHasRunOffTheBottom(piece) {
		return sides(piece).top > canvas.height;
	}

Notice that `maybeRemoveBullets` and `maybeRemoveMissiles` now have similar structure.  That's good because they also have a similar meaning.

Many programming languages have special constructs to share similarities.  Inheritance is a prominent one.  It's the other thing I want to tell you all about today.

## Inheritance

In most general terms, inheritance is the ability to share structure and behavior between similar though slightly different entities in a computer system.  There are many different ways to do inheritance.  It is a big topic.  I just want to show you a little bit.  JavaScript's has strong support for a particular kind of inheritance what some people call single prototypical inheritance with constructor initialization.  You'll see what that means by the time we're done, but we had better introduce inheritance by what it does for us rather than by what it is or how it works.

We can use inheritance to improve our game code.  I didn't plan this from the beginning.  Actually I said to myself, "we'll talk about inheritance only if and when it becomes really relevant toward making our game."  It has now.  Let me show you how.

In our game we have a bunch of different kinds of pieces.  Some work together in aggregate.  Specifically we have a lists of bullets, powerups, bad guys, and missiles.  All of the aggregates behave similarly.  For each, we have an add function, an update function, a remove function, maybe add, maybe remove, draw, etc.  Bullets and missiles are two of the most similar aggregates.  Remember how boring and tedious it was customizing a copy of all of the bullet code in order to make missiles.  (You may not remember because you were nodding off as anyone naturally would.)  In bullets.js we defined:

	bullets
	maxBullets
	maxBulletCoolDown
	bulletCoolDown
	addBullet()
	removeBullet(bullet)
	maybeAddBullet()
	updateBullets()
	maybeRemoveBullets()
	drawBullets()

In boss.js, we defined:

	missiles
	maxMissiles
	maxMissileCoolDown
	missileCoolDown
	addMissiles()
	removeMissile()
	maybeAddMissile()
	updateMissiles()
	maybeRemoveMissiles()
	drawMissiles()

The two kinds of projectile are basically the same.  They move, appear, and disappear a little bit differently, but the essential qualities of being a projectile are the same.  Projectiles have a prototypical way of behaving which bullets and missiles individually customize.  Let's define a prototypical aggregate projectiles object:

	projectiles = {
		members: [],
		max: 30,
		maxCoolDown: 20,
		coolDown: 20, // same as maxCoolDown.
		add: function() {
			this.members.push(this.newMember());
			// `this` refers to the object `add` is called on.
			// When we say `projectiles.add()`, `this` is `projectiles`.
		},
		// Make a generic projectile.
		newMember: function() {
			return {
				x: width / 2,
				y: height / 2,
				width: 4,
				height: 16,
				speed: 400,
				color '#AAA'
			};
		},
		remove: function(member) {
			var i = this.members.indexOf(member);
			if (i !== -1) {
				this.members.splice(i, 1);
			}
		},
		maybeAdd: function() {
			if (this.members.length >= this.max) {
				return;
			}
			
			if (this.coolDown > 0) {
				--this.coolDown;
				return;
			}
			
			this.coolDown = this.maxCoolDown;
			this.add();
		},
		update: function() {
			forEach(this.members, function(member) {
				member.y += member.speed / fps;
			});
		},
		maybeRemove: function() {
			reject(this.members, this.shouldBeRemoved);
		},
		// Decide whether a member should be removed.
		shouldBeRemoved: function(member) {
			return speed > 0 ? ifHasRunOffTheBottom(member) :
				ifHasRunOffTheTop(member);
		},
		draw: function() {
			forEach(this.members, fillPiece);
		}
	};

This looks a lot like the bullets and missiles definitions.  Biggest difference is the use of `this` instead of `bullet` and `missiles` suffixes.  (I mean that we write `this.add` instead of `addBullet` or `addMissiles`.)

With our prototypical `projectiles` in hand, we define a constructor function for making instances (like `bullets` and `missiles`) from the prototype.  A constructor function is a like a regular function with two differences: it has a `prototype` property and it is called with the `new` keyword.  See:

	function Projectiles(){
		// We will need to fill this in.
	};
	Projectiles.prototype = projectiles;
	bullets = new Projectiles();
	missiles = new Projectiles();

With these definitions of `bullets` and `missiles`, each inherits all the properties of the `projectiles` prototype.  For example:

	projectiles.max; //> 30
	bullets.max; //> 30
	missiles.max; //> 30

If you change a property for the prototype, all the instances change:

	projectiles.max = 20;
	projectiles.max; //> 20
	bullets.max; //> 20
	missiles.max; //> 20

If you change a property of an instance, all only its value changes:

	bullets.max = 66;
	projectiles.max; //> 20
	bullets.max; //> 66
	missiles.max; //> 20

Thereafter, changes to the prototype have no effect on the instance:

	projectiles.max = 10;
	projectiles.max; //> 10
	bullets.max; //> 66
	missiles.max; //> 10

That's the gist of it.  One tricky consequence (and a mistake) is that the `members` array will be the same for projectiles, bullets, and missiles.  Each should have its own `members` array.  It's the constructor function's job to initialize properties which should be different for each instance:

	function Projectiles(){
		this.members = []; // Assign a new array each time a Projectiles object is created.
	};
	Projectiles.prototype = projectiles;
	bullets = new Projectiles();
	missiles = new Projectiles();

We can override function properties too.  For example `missiles`, needs a special `newMember` function to distinguish itself from `bullets`:

	missiles.newMember = function() {
		return {
			x: boss.x,
			y: sides(boss).bottom,
			dx: randomBetween(-1, 2),
			dy: 1,
			width: 4,
			height: 16,
			speed: 400,
			color: '#8C4'
		} 
	}

Alternatively, we could have `missiles.newMember` delegate to its prototype's `newMember` function overriding individual properties to turn the generic projectile into a missile:

	missiles.newMember = function() {
		var missile = Object.getPrototypeOf(this).newMember();
		missile.x = boss.x;
		missile.y = sides(boss).bottom;
		missile.dx = randomBetween(-1, 2);
		missile.dy = 1;
		missile.color = '#8C4';
		return missile;
	}

And that's how we use inheritance in JavaScript.  In summary:

	JavaScript has single prototypical inheritance with constructor initialization.
	inheritance -- a mechanism for sharing structure and behavior between objects.
	prototypical -- an object serves a prototype for others.
	single -- each object has at most one prototype it delegates to.
	constructor -- a function with a `prototype` property used to make `new` instances of that prototype.
	initialization -- the constructor function sets initial values for properties which are not shared between instances.

In game03, I've gone ahead and made an `Aggregate` constructor with `powerups`, `badGuys`, and `projectiles` as instances.  Then `projectiles` serves as the prototype for the `Projectiles` constructor with `bullets` and `missiles` as instances.

## GitHub

Last but not least, I've put the whole project along with all the notes on GitHub.  Try using [GitHub for Mac](http://mac.github.com/), to clone a copy.

That's all for now,
William