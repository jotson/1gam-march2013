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

Crafty.c("defender", {
    init: function() {
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("invader", {
    _startX: null,
    _startY: null,
    _speed: 50,
    _dodging: false,

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Mouse, solid");
        this.attr({ w: INVADER_WIDTH, h: INVADER_HEIGHT });

        this.bind("EnterFrame",
            function() {
            }
        );

        this.bind("MouseMove",
            function(e) {
                if (!this._dodging) {
                    // TODO Dodge for x seconds and then go back into position
                    // this._dodging = true;
                }
            }
        );
    },

    fly: function(speed) {
        this._startX = this.x;
        this._startY = this.y;

        var max = 200;
        if (speed >= 100) { speed = 100; }
        if (speed <= 0) { speed = 0; }
        this._speed = speed;
        if (speed > 0) {
            this.animate("fly", 0, 0, 1);
            this.animate("fly", 1 + max - max*speed/100, -1);
        } else {
            this.stop();
        }
        return this;
    }
});

Crafty.c("invader-group", {
    _speed: 10, // pixels/s
    _dir: -1, // left

    init: function() {
        this.requires("2D, Canvas");
        this.attr({ w: INVADER_WIDTH * INVADER_COLS, h: INVADER_HEIGHT * INVADER_ROWS })

        // TODO Change height and width based on locations of attached invaders
        
        this.bind("EnterFrame",
            function() {
                if (this.y + this.attr('h') >= STAGE_H) {
                    // TODO Invaders win
                    console.log("You win!");
                    return;
                }

                this.x += this._dir * this._speed * 1/Crafty.timer.getFPS();
                if (this.x <= 0 || this.x + this.attr('w') >= STAGE_W) {
                    // Change direction and move down
                    this._dir = this._dir * -1;
                    this.y += INVADER_HEIGHT * 0.2;

                    this._speed += 5;

                    for(var i = 0; i < this._children.length; i++) {
                        var invader = this._children[i];
                        invader.fly(invader._speed + 1);
                    }
                }
            }
        );
    }
});

Crafty.c("human", {
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, solid");
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("block", {
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, solid");
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("missile", {
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, solid");
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});

Crafty.c("bomb", {
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, solid");
        this.bind("EnterFrame",
            function() {
            }
        );
    }
});
