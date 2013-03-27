# Reverse Invaders by John Watson

This is my March 2013 entry for [#OneGameAMonth](http://onegameamonth.com).
See CREDITS for full credits.

# Gameplay video

- [Watch video](http://www.youtube.com/watch?v=OQZ8xB8lYBI)

# Running the game

The game should run in most modern browsers. I've only tested it in Chrome and Firefox. Let me know if it runs for you or not.

- [Click here to play](http://flagrantdisregard.com/invaders/)

# How to play

Move the mouse pointer over ships to activate their shields. Try to block incoming missiles and land as many ships on the surface as possible.

# Build instructions

This project can be compiled to Android, Flash, and Linux targets. It will probably also work with Mac and Windows targets but I haven't tested them. The js version works in Firefox and Chrome. It may work in IE and others but I haven't tested.

The js version has no requirements and doesn't technically need a build. Just run the index.html file in the js folder.

The nme version requires [nme](http://nme.io). Once that is installed, you will also need to install the flixel library:

`haxelib install flixel`

./build.sh is a bash script that I used during development to test various targets. For example, `./build.sh flash` will build and run a debug version of the flash target.

./build.sh also builds the [HTML page](http://flagrantdisregard.com) by
combining the template /index.html, js, and nme builds into a single folder. Run that with `./build.sh html`.

You can also simply cd to the nme folder and compile with nme directly:

`nme build flash`

or

`nme build linux`

# Dev Notes

- The js/ folder contains a Javascript implementation of the game built with [Crafty](http://craftyjs.com)
- The nme/ folder contains an NME implementation of the game built with [NME and Haxe](http://nme.io)
- Crafty comes with a pretty sweet (but undocumented) particle system component
- It includes a very handy convex polygon collision detector that is very easy to use
- The WiredHitBox component is a very handy 
- I really like the component/entity architecture
- Development is very fast with SublimeText 2 + LiveReload + Chrome. Every time I hit save in my editor, the browser instantly refreshes with the new version of the game.
- Working with text has a quirk where if you want multiple text entities with different attributes on screen at the same time then you *must* use DOM for text and you *must* use the css() method instead of textFont().
- The entity attachment system is wonderful. In this game, there is a single entity that all of the individual invaders are simply attached to. That parent entity contains the movement AI and all of the invaders are just carried along with it. In turn, the shields are attached to the invaders.
- Changing the width and height of an entity with attached sprites causes strange drawing glitches.
- Using a mixture of Canvas and DOM. They each have strengths and weaknesses. For example, switching the starfield, missiles, and bombs to DOM improved the performance of the entire simulation. But the invaders are Canvas because it makes their movement smoother.
- DOM and Canvas entities appear to have separate z-orders. And DOM entities are always on top of Canvas entities.
- All entities with 2D are automatically destroyed when the scene changes. Entities without 2D are not.
- Having an AI component that can "play" your game can make testing easier.
- Chrome performance > Firefox performance
- Set DEBUG = true in global.js to see collision hitboxes and console logging.

About Haxe, NME, and HaxeFlixel

- HaxeFlixel has all of the basics and then some (object pools, particle systems). Swiss army knife of 2D games.
- HaxeFlixel uses an optimized rendering system that dramatically improves frame rates on mobile devices compared to just using the DisplayList.
- NME and HaxeFlixel docs aren't great.
- Source for HaxeFlixel and NME is on Github.
- HaxeFlixel manages scaling of your game to different screen sizes for you. You just need to set the game size when you init the Engine and then keep track of the game size in the HXP.screen.width and HXP.screen.height.
- NME always treats .mp3 files as MUSIC on some platforms (SDL) -- better to use WAVs