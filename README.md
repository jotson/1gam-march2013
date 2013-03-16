# Reverse Invaders by John Watson

This is my March 2013 entry for [#OneGameAMonth](http://onegameamonth.com).
See CREDITS for full credits.

# Gameplay video

- [Watch video]() - COMING SOON

# Running the game

The game should run in most modern browsers. I've only tested it in Chrome and Firefox. Let me know if it runs for you or not.

- [Click here to play](http://flagrantdisregard.com/invaders/) - COMING SOON

# How to play

Move the mouse pointer over ships to activate their shields. Try to block incoming missiles and land as many ships on the surface as possible.

# Dev Notes

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
- Set DEBUG = true in global.js to see collision hitboxes and console logging.
