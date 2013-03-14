Crafty.c("defender", {
    init: function() {
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("invader", {
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, solid");
        this.attr({ w: 100, h: 100 });

        this.bind("EnterFrame",
            function() {
            }
        );
    },

    fly: function(speed) {
        var max = 200;
        if (speed >= 100) { speed = 100; }
        if (speed <= 0) { speed = 0; }
        if (speed > 0) {
            this.animate("fly", 0, 0, 1);
            this.animate("fly", 1 + max - max*speed/100, -1);
        } else {
            this.stop();
        }
        return this;
    }
});

Crafty.c("block", {
    init: function() {
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("missile", {
    init: function() {
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("bomb", {
    init: function() {
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});
