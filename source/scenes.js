/**
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

Crafty.scene("loading",
    function() {
        var status = Crafty.e("2D, DOM, Text");
        status.css({ 'color': '#ffffff', 'font-size': '20px', 'font-weight': 'bold', 'text-align': 'center', 'font-family': FONTFACE });
        status.attr({ w: STAGE_W, h: 50, x: 0, y: STAGE_H*0.3 });
        status.text("Loading");

        if (DEBUG) console.log("Loading assets");

        // Preload assets
        Crafty.load(
            [
                "assets/images/invaders.png",
                "assets/images/shield.png",
                "assets/images/human.png",
            ],

            function() {
                // onLoad
                if (DEBUG) console.log("Loading complete");

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

                Crafty.scene("menu");
            },

            function(e) {
                // onProgress
                status.text("Loading " + e.percent);
            }
        );
    }
);

Crafty.scene("menu",
    function() {
        if (DEBUG) console.log("Starting menu");

        // TODO Play button
        Crafty.scene("playing");
    }
);

Crafty.scene("playing",
    function() {
        if (DEBUG) console.log("Starting play");

        // Create invaders
        var yOffset = 50;
        var xOffset = 25;

        // First, create entity to control movement of all invaders
        var group = Crafty.e("invader-group").attr({ x: xOffset, y: yOffset });

        for (y = 0; y < INVADER_ROWS; y++) {
            for (x = 0; x < INVADER_COLS; x++) {
                group.attach(
                    Crafty.e('invader_sprite' + y + ', invader')
                        .attr({ x: xOffset + x * INVADER_WIDTH, y: yOffset + y * INVADER_HEIGHT })
                        .fly(Crafty.math.randomInt(50,75))
                );
            }
        }

        // Create bunkers
        createBunker(125, 400);
        createBunker(275, 400);
        createBunker(425, 400);
        createBunker(575, 400);

        // Add human to stage
        var h = Crafty.e("human");

        // Ready?
        var msg = Crafty.e("2D, DOM, Text, Delay, Tween, blink");
        msg.text("GET READY!");
        msg.css({ 'color': '#ff0000', 'font-size': '36px', 'text-align': 'center', 'font-family': FONTFACE });
        msg.attr({ w: STAGE_W, x: 0, y: 5 });
        msg.delay(function() {
            msg.destroy();

            // Start shooting!
            h.fire();
        }, 4700);

        // Show FPS
        var fps = Crafty.e("2D, DOM, Text");
        fps.text("FPS: " + Crafty.timer.getFPS());
        fps.attr({ w: 50, x: 5, y: STAGE_H - 18 });
        fps.css({ 'color': '#333333', 'font-size': '12px', 'font-family': FONTFACE });
    }
);
