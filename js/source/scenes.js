/**
Reverse Invaders
Copyright 2013 John Watson <john@flagrantdisregard.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/

Crafty.scene("loading", function() {
    var status = Crafty.e("2D, DOM, Text");
    status.css({ 'color': '#ffffff', 'font-size': '20px', 'font-weight': 'bold', 'text-align': 'center', 'font-family': FONTFACE });
    status.attr({ w: STAGE_W, h: 50, x: 0, y: STAGE_H*0.3 });
    status.text("Loading");

    // Sprites
    Crafty.sprite(50, "assets/images/invaders.png", {
        invader_sprite0: [0,1],
        invader_sprite1: [0,0],
        invader_sprite2: [0,0],
        invader_sprite3: [0,2],
        invader_sprite4: [0,2],
    });

    Crafty.sprite(50, "assets/images/shield.png", {
        shield_sprite: [0,0],
    });

    Crafty.sprite(50, "assets/images/human.png", {
        human_sprite: [0,0],
    });

    Crafty.sprite(1, "assets/images/play-button.png", {
        play_btn: [0, 0, 100, 50]
    });

    Crafty.sprite(1, "assets/images/ok-button.png", {
        ok_btn: [0, 0, 100, 50]
    });

    Crafty.sprite(1, "assets/images/speech-bubble.png", {
        speech_bubble: [0, 0, 130, 68]
    });

    Crafty.sprite(1, "assets/images/background.png", {
        background: [0, 0, 700, 500]
    });

    // Sounds
    SoundManager.add({
        missile: ["assets/sounds/railgun.ogg", "assets/sounds/railgun.mp3"],
        war: ["assets/sounds/war-sounds.ogg", "assets/sounds/war-sounds.mp3"],
        artillery: ["assets/sounds/artillery.ogg", "assets/sounds/artillery.mp3"],
        explosion1: ["assets/sounds/explosion1.ogg", "assets/sounds/explosion1.mp3"],
        explosion2: ["assets/sounds/explosion2.ogg", "assets/sounds/explosion2.mp3"],
        crash: ["assets/sounds/crash.ogg", "assets/sounds/crash.mp3"],
        music: ["assets/sounds/music.ogg", "assets/sounds/music.mp3"],
    });

    // Ricochet variations
    SoundManager.add({ ricochet: ["assets/sounds/ricochet1.ogg", "assets/sounds/ricochet1.mp3"] });
    SoundManager.add({ ricochet: ["assets/sounds/ricochet2.ogg", "assets/sounds/ricochet2.mp3"] });
    SoundManager.add({ ricochet: ["assets/sounds/ricochet3.ogg", "assets/sounds/ricochet3.mp3"] });
    SoundManager.add({ ricochet: ["assets/sounds/ricochet4.ogg", "assets/sounds/ricochet4.mp3"] });

    if (DEBUG) console.log("Loading assets");
    if (DEBUG) console.log("Support audio: " + Crafty.support.audio);
    if (DEBUG) console.log("Support mp3: " + Crafty.audio.supported['mp3']);
    if (DEBUG) console.log("Support ogg: " + Crafty.audio.supported['ogg']);
    if (DEBUG) console.log("Support wav: " + Crafty.audio.supported['wav']);

    // Preload assets
    Crafty.load(
        [
            "assets/images/invaders.png",
            "assets/images/shield.png",
            "assets/images/human.png",
            "assets/sounds/railgun.ogg",
            "assets/sounds/railgun.mp3",
            "assets/sounds/war-sounds.ogg",
            "assets/sounds/war-sounds.mp3",
            "assets/sounds/artillery.mp3",
            "assets/sounds/artillery.ogg",
            "assets/sounds/explosion1.mp3",
            "assets/sounds/explosion1.ogg",
            "assets/sounds/explosion2.mp3",
            "assets/sounds/explosion2.ogg",
            "assets/sounds/music.mp3",
            "assets/sounds/music.ogg",
            "assets/sounds/crash.mp3",
            "assets/sounds/crash.ogg",
            "assets/images/play-button.png",
            "assets/images/ok-button.png",
            "assets/images/speech-bubble.png",
            "assets/images/background.png",
        ],

        function() {
            // onLoad
            if (DEBUG) console.log("Loading complete");

            Crafty.scene("menu");
        },

        function(e) {
            // onProgress
            if (DEBUG) console.log(e);
            status.text("Loading " + Math.ceil(e.percent) + '%');
        },

        function(e) {
            // onError
            if (DEBUG) console.log(e);
        }
    );
});

Crafty.scene("menu", function() {
    if (DEBUG) console.log("Starting menu");

    // Start ambient sounds
    SoundManager.stop();
    SoundManager.play("war", -1, 0.4);
    SoundManager.play("artillery", -1, 1);

    Crafty.e("2D, Canvas, background").attr({ z: -1000 });
    Crafty.e("starfield");

    // Invaders
    var yOffset = 50;
    var xOffset = 75;
    for (y = 0; y < INVADER_ROWS; y++) {
        for (x = 0; x < INVADER_COLS; x++) {
            ObjectPool.get('invader_sprite' + y + ', invader')
                .attr({ x: xOffset + x * INVADER_WIDTH, y: yOffset + y * INVADER_HEIGHT })
                .fly(Crafty.math.randomInt(50,75))
        }
    }

    // Play button
    var playButton = Crafty.e("button, play_btn").attr({ x: 300, y: 350, w: 100, h: 50 });
    playButton.click = function() {
        Crafty.scene("playing");
    };

    // Show stats
    var stats = Crafty.e("2D, DOM, Text");
    stats.attr({ w: STAGE_W-10, x: 5, y: 5 });
    stats.css({ 'color': '#444444', 'font-size': '12px', 'text-align': 'right', 'font-family': FONTFACE });
    stats.bind("MessureFPS", function(fps) {
        stats.text("FPS: " + fps.value + " — Entities: " + Crafty('*').length);
    });
});

Crafty.scene("gameover", function() {
    if (DEBUG) console.log("Game over");

    Crafty.e("2D, Canvas, background").attr({ z: -1000 });
    Crafty.e("starfield");

    SoundManager.stop("war");
    SoundManager.stop("artillery");
    SoundManager.play("music", -1);

    var win_text = '';
    var invader_text = '';
    if (winner == 'invaders') {
        var max_ships = INVADER_COLS * INVADER_ROWS;
        win_text = 'Invaders win!';
        if (ships_remaining == 1) {
            invader_text = 'You landed a single, pathetic little ship on the planet.';
        } else {
            invader_text = 'You landed ' + ships_remaining + ' of ' + max_ships + ' ships on the planet. ';
            if (ships_remaining >= max_ships) {
                invader_text += 'Perfect!';
            } else if (ships_remaining >= 50) {
                invader_text += 'Amazing!';
            } else if (ships_remaining >= 40) {
                invader_text += 'Pretty good!';
            } else if (ships_remaining >= 30) {
                invader_text += 'Not bad!';
            } else if (ships_remaining >= 20) {
                invader_text += 'So so.';
            } else if (ships_remaining >= 10) {
                invader_text += 'You can do better.';
            } else if (ships_remaining > 0) {
                invader_text += 'Seriously? Try again.';
            }
        }
        for(var i = 0; i < ships_remaining; i++) {
            ObjectPool.get('invader_sprite' + Crafty.math.randomInt(0,4) + ', invader, bouncy')
                .attr({ x: Crafty.math.randomInt(0 + INVADER_WIDTH, STAGE_W - INVADER_WIDTH), y: STAGE_H - INVADER_HEIGHT })
                .fly(75);
        }
    }

    if (winner == 'humans') {
        win_text = 'Humans win!';
        invader_text = 'Better luck next time.';
        Crafty.e("human");
    }

    Crafty.e("2D, DOM, Text")
        .attr({ x: 0, y: 50, w: STAGE_W, h: 50 })
        .css({ 'text-align': 'center', 'font-family': FONTFACE, 'font-size': '40px', 'color': '#ff0000' })
        .text(win_text);
    Crafty.e("2D, DOM, Text")
        .attr({ x: 0, y: 100, w: STAGE_W, h: 50 })
        .css({ 'text-align': 'center', 'font-family': FONTFACE, 'font-size': '20px', 'color': '#ff0000' })
        .text(invader_text);

    var playButton = Crafty.e("button, ok_btn").attr({ x: 300, y: 150, w: 100, h: 50 });
    playButton.click = function() {
        Crafty.scene("menu");
    };

    // Show stats
    var stats = Crafty.e("2D, DOM, Text");
    stats.attr({ w: STAGE_W-10, x: 5, y: 5 });
    stats.css({ 'color': '#444444', 'font-size': '12px', 'text-align': 'right', 'font-family': FONTFACE });
    stats.bind("MessureFPS", function(fps) {
        stats.text("FPS: " + fps.value + " — Entities: " + Crafty('*').length);
    });
});

Crafty.scene("playing", function() {
    if (DEBUG) console.log("Starting play");

    // Create starfield
    Crafty.e("2D, Canvas, background").attr({ z: -1000 });
    Crafty.e("starfield");

    // Create bunkers
    createBunker(125, 400);
    createBunker(350, 400);
    createBunker(575, 400);

    // Add human to stage
    var h = Crafty.e("human");

    Crafty.e("shield2");
    Crafty.e("mouse-catcher");

    // Create invaders
    var yOffset = 50;
    var xOffset = 25;

    // First, create entity to control movement of all invaders
    var group = Crafty.e("invader-group").attr({ x: xOffset, y: yOffset });

    for (y = 0; y < INVADER_ROWS; y++) {
        for (x = 0; x < INVADER_COLS; x++) {
            group.attach(
                ObjectPool.get('invader_sprite' + y + ', invader')
                    .attr({ x: xOffset + x * INVADER_WIDTH, y: yOffset + y * INVADER_HEIGHT })
                    .fly(Crafty.math.randomInt(50,75))
            );
        }
    }

    // Ready?
    var msg = Crafty.e("2D, DOM, Text, Delay, Tween, blink");
    msg.text("GET READY!");
    msg.css({ 'color': '#ff0000', 'font-size': '36px', 'text-align': 'center', 'font-family': FONTFACE });
    msg.attr({ w: STAGE_W, x: 0, y: 5 });
    msg.delay(function() {
        msg.destroy();

        // Start shooting!
        h.fire();

        // Ship counter
        var ships = Crafty.e("2D, DOM, Text");
        ships.attr({ w: STAGE_W, x: 0, y: 5 });
        ships.css({ 'color': '#ff0000', 'font-size': '20px', 'text-align': 'center', 'font-family': FONTFACE });
        ships.bind("EnterFrame", function() {
            ships.text("Ships remaining: " + Crafty("invader").length);
        });
    }, 4700);

    // Show stats
    var stats = Crafty.e("2D, DOM, Text");
    stats.attr({ w: STAGE_W-10, x: 5, y: 5 });
    stats.css({ 'color': '#444444', 'font-size': '12px', 'text-align': 'right', 'font-family': FONTFACE });
    stats.bind("MessureFPS", function(fps) {
        stats.text("FPS: " + fps.value + " — Entities: " + Crafty('*').length);
    });
});