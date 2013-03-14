var STAGE_W = 700;
var STAGE_H = 500;
var FONTFACE = 'Offside';

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
                    invader1: [0,0]
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

        for (i = 0; i <= 10; i++) {
            Crafty.e("invader, invader1").attr({ x: 75 + 50 * i, y: 100 }).fly(50);
        }
        for (i = 0; i <= 10; i++) {
            Crafty.e("invader, invader1").attr({ x: 75 + 50 * i, y: 150 }).fly(50);
        }
        for (i = 0; i <= 10; i++) {
            Crafty.e("invader, invader1").attr({ x: 75 + 50 * i, y: 200 }).fly(50);
        }

        // TODO Awesome graphics
        // TODO Music
        // TODO Instructions
        // TODO Play button
        // Crafty.scene("playing");
    }
);

Crafty.scene("playing",
    function() {
        console.log("Starting play");

        // Show FPS
        var fps = Crafty.e("2D, DOM, Text");
        fps.textColor("#333333");
        fps.textFont({ size: '12px', weight: 'bold', family: FONTFACE });
        fps.attr({ w: 50, x: 5, y: STAGE_H - 18 });
        fps.text("FPS: " + Crafty.timer.getFPS());
    }
);


Crafty.scene("gameover",
    function() {
        console.log("Game over");
    }
);
