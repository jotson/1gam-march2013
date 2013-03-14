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
