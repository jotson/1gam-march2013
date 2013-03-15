# Meteor Defense by John Watson

This is my March 2013 entry for [#OneGameAMonth](http://onegameamonth.com).
See CREDITS for full credits.

# Gameplay video

- [Coming soon]()

# Running the game

The game should run in most modern browsers. I've only tested it in Chrome and Firefox. Let me know if it runs for you or not.

# How to play

Coming soon

# Dev Notes

- Crafty comes with a pretty sweet (but undocumented) particle system component
- It includes a very handy convex polygon collision detector that is very easy to use
- I really like the component/entity architecture
- Development is very fast with SublimeText 2 + LiveReload + Chrome. Every time I hit save in my editor, the browser instantly refreshes with the new version of the game.
- Working with text has a quirk where if you want multiple text entities with different attributes on screen at the same time then you *must* use DOM for text and you *must* use the css() method instead of textFont().
- The entity attachment system is wonderful. In this game, there is a single entity that all of the individual invaders are simply attached to. That parent entity contains the movement AI and all of the invaders are just carried along with it.
- Changing the width and height of an entity with attached sprites causes strange drawing glitches.
