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
        status.textColor("#ffffff");
        status.textFont({ size: '20px', weight: 'bold', family: FONTFACE });
        status.attr({ w: STAGE_W, h: 50, x: 0, y: STAGE_H*0.3 });
        status.css({ "text-align": "center" });

        console.log("Loading assets");

        // Preload assets
        Crafty.load(
            [
                "assets/images/invader1.png"
            ],

            function() {
                // onLoad
                console.log("Loading complete");

                Crafty.sprite(50, "assets/images/invader1.png", {
                    invader0: [0,0],
                    invader1: [0,0],
                    invader2: [0,0],
                    invader3: [0,0],
                    invader4: [0,0]
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
        console.log("Starting menu");

        // TODO Play button
        Crafty.scene("playing");
    }
);

Crafty.scene("playing",
    function() {
        console.log("Starting play");

        // Create invaders
        var yOffset = 50;
        var xOffset = STAGE_W/2 - INVADER_COLS*INVADER_WIDTH/2;

        // First, create entity to control movement of all invaders
        var group = Crafty.e("invader-group").attr({ x: xOffset, y: yOffset });

        for (y = 0; y < INVADER_ROWS; y++) {
            for (x = 0; x < INVADER_COLS; x++) {
                group.attach(
                    Crafty.e('invader' + y + ', invader')
                        .attr({ x: xOffset + x * INVADER_WIDTH, y: yOffset + y * INVADER_HEIGHT })
                        .fly(50)
                );
            }
        }

        // Create humans
        Crafty.e("")

        // Show FPS
        var fps = Crafty.e("2D, DOM, Text");
        fps.textColor("#333333");
        fps.textFont({ size: '12px', weight: 'bold', family: FONTFACE });
        fps.attr({ w: 50, x: 5, y: STAGE_H - 18 });
        fps.text("FPS: " + Crafty.timer.getFPS());
    }
);
