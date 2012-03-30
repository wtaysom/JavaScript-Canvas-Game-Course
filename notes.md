# Saturday March 17

## Assignment

1. Play some games on [MozillaLabs](https://gaming.mozillalabs.com/games/)
2. Pick out two or three you would like to take apart.  Pay special attention to the ones with a "SEE THE SOURCE" button.  Those are specifically designed for easy examination.  The others may be tricky.
3. Make some notes describing how the game works.  How would you explain it to someone who hasn't seen or played it before?  How would you describe it to someone who has never played a game before?  Programming a computer is like giving directions to a perfectly obedient idiot who hardly knows anything and takes everything you say literally.
4. Just to add to it, if there's any specific game or genre you want to talk about.  Please let me know.

## History

* [Tim Burners-Lee](http://en.wikipedia.org/wiki/Tim_Berners-Lee)
	* invents [World Wide Web](http://en.wikipedia.org/wiki/World_Wide_Web)
	* combines Hypertext and the Internet
		1. URLs
		2. HTTP
		3. HTML
		4. Links
	* [Validate HTML](http://validator.w3.org/)

## Topics

Variables, expressions, statements, function calls, HTML canvas.

## Tools

* [Sublime Text 2](http://www.sublimetext.com/2)
* [SubEthaEdit](http://www.codingmonkeys.de/subethaedit/)
* [Google Chrome Developer Tools](http://code.google.com/chrome/devtools/docs/overview.html)
* [Firefox Aurora](http://www.mozilla.org/en-US/firefox/aurora/)

## Tutorials

* [HTML 5 Canvas Deep Dive](http://projects.joshy.org/presentations/HTML/CanvasDeepDive/presentation.html)
* [Dive into HTML5 canvas](http://diveintohtml5.info/canvas.html)
* [Mozilla Canvas Tutorial](https://developer.mozilla.org/en/Canvas_tutorial)
* For manipulating pixels `python -m SimpleHTTPServer`.

## Canvas Examples

* [21 Ridiculously Impressive Experiments](http://net.tutsplus.com/articles/web-roundups/21-ridiculously-impressive-html5-canvas-experiments/)
* [Canvas Demos](http://www.canvasdemos.com/)

## Canvas Reference

* [Cheat Sheet](http://blog.nihilogic.dk/2009/02/html5-canvas-cheat-sheet.html)
* [Mozilla Reference](https://developer.mozilla.org/en/DOM/HTMLCanvasElement)
* [WebKit Reference](https://developer.apple.com/library/mac/#documentation/AppleApplications/Conceptual/SafariJSProgTopics/Tasks/Canvas.html)
* [W3C Reference](http://dev.w3.org/html5/2dcontext/)

## Other

* [Nobody wants to learn how to program.](http://inventwithpython.com/blog/2012/03/03/nobody-wants-to-learn-how-to-program/)
* [Little Programming Problems](http://coderbyte.com)
* [7 Javascript Resources](http://accidentaltechnologist.com/javascript/7-resources-every-javascript-developer-should-know/)

# Saturday March 24

## Assignment

* Read over the [HTML 5 Canvas Deep Dive](http://projects.joshy.org/presentations/HTML/CanvasDeepDive/presentation.html) tutorial.

## Topics

`setTimeout`, `setInterval`, console.log, function definitions, loops, conditionals.

## Example

[Fractal Machine](http://www.cs.utoronto.ca/~noam/fractal_machine.html) is not perfect, but it does do some interesting things.  We'll ignore the jQuery and iPhone check box parts.

# Saturday March 31

## Assignment

Thanks for forwarding the code John.  I have a few ideas of things to try out over the week:

* Assign the particles random colors.
* Instead of falling, have the particles bounce around a bit.
* Factor out a `forEachParticle` function so that instead of
		
		for (var i in particles) {
			var part = particles[i];
			// do stuff with part...
		}
		
	you just write
		
		forEachParticle(function(part) {
			// do stuff with part...
		});
		
* Assign particles random shapes (triangle, pentagon, weird curves with gradient fills)
* Get the particles to interact with each other.  The trick is to make how a particle changes in `updateParticles` depend on other particles:
		
		function updateParticles() {
			forEachParticle(function(part) {
				// Update part in the normal way.
				part.y += part.speed;
				part.x = Math.sin(part.y / 5) * 10 + 200;
				
				forEachParticle(function(otherPart) {
					// You need to define `isCloseTo`.
					if (isCloseTo(part, otherPart)) {
						// You need to define `updateInResponseTo`.
						updateInResponseTo(part, otherPart);
					}
				});
			});
		}
	For lots of games, the behavior of `updateInResponseTo` basically defines the rules.

Feel free to email me or find me on Skype (username wtaysom) for more hints.

## Topics

Mouse events, keyboard events, libraries.

!! parameter slider using [Dragdealer JS](http://code.ovidiu.ch/dragdealer/)

## Example

* interaction.html.
* keys.html.
* [BrowserQuest](https://hacks.mozilla.org/2012/03/browserquest/) is a demo massively multiplayer game.
* [Dragdealer JS](http://code.ovidiu.ch/dragdealer/) is an awesome little slider.

## Tools

* DigitalColor Meter application to get a pixel level inspection of what's going on.
* [keymaster.js](https://github.com/madrobby/keymaster) for nice keyboard handling.

## Tutorials

* [Canvas Mouse Tutorial](http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/) provides one way complete way to find mouse where the mouse is.
