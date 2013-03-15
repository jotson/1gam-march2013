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

// TODO Sounds
// TODO Music
// TODO Menu
// TODO Restart menu
// TODO Bombs
// TODO Bombs hitting missiles
// TODO Bombs hitting human
// TODO Bombs hitting bottom of stage
// TODO Invader hitting human
// TODO Invader hitting block

Crafty.c("invader", {
    _startX: null,
    _startY: null,
    _speed: 50,

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Mouse, solid");
        this.attr({ w: INVADER_WIDTH, h: INVADER_HEIGHT });

        this.requires("Collision").collision([10,10], [40,10], [45,38], [5,38]);
        if (DEBUG) this.requires("WiredHitBox");
        this.onHit("solid", function(hits) {
            if (!this.has("invader")) return;

            for(var i = 0; i < hits.length; i++) {
                var other = hits[i].obj;
                if (other.has("block")) {
                    other.destroy();
                }

                if (other.has("human")) {
                    invadersWin();
                }
            }
        });

        this.bind("EnterFrame", function() {
            // TODO Collision with human
            // if (collides with human) {
                // this._parent._speed = 0;
                // if (DEBUG) console.log("You win!");
                // if (DEBUG) console.log("You landed X ships on the puny humans!");
                // return;
            // }
            
            // TODO Collision with block
        });

        this.bind("MouseMove", function(e) {
            // Activate shield if we don't already have one
            if (!this.hasShield()) {
                this.attach(Crafty.e("shield").attr({ x: this.x, y: this.y + 25 }));
            }
        });
    },

    hasShield: function() {
        if (this._children.length) {
            for(var i = 0; i < this._children.length; i++) {
                var c = this._children[i];

                // Need typeof() because Collision adds a Polygon child that doesn't have has()
                if (typeof(c.has) != 'undefined' && c.has("shield")) {
                    return true;
                }
            }
        }

        return false;
    },

    fly: function(speed) {
        this._startX = this.x;
        this._startY = this.y;

        var max = 200;
        if (speed >= 100) { speed = 100; }
        if (speed <= 0) { speed = 0; }
        this._speed = speed;
        if (speed > 0) {
            if (this.isPlaying()) {
                this.stop();
            } else {
                this.animate("fly", 0, this.__coord[1]/INVADER_HEIGHT, 1);
            }
            this.animate("fly", 1 + max - max*speed/100, -1);
        } else {
            this.stop();
        }
        return this;
    }
});

Crafty.c("shield", {
    _lifetime: 50,

    init: function() {
        if (DEBUG) console.log("Shield activated");

        this.requires("2D, Tween, Canvas, SpriteAnimation, shield_sprite, solid");
        this.animate("activate", 0, 0, 3);
        this.animate("activate", 10, -1);
        this.attr({ w: INVADER_WIDTH, h: INVADER_HEIGHT });
        this.tween({ alpha: 0.0 }, this._lifetime);

        this.requires("Collision").collision([0,25], [50,25], [50,30], [0,30]);
        if (DEBUG) this.requires("WiredHitBox");

        this.bind("TweenEnd", function(property) {
            if (DEBUG) console.log("Shield deactivated");
            this.detach(this._parent);
            this.destroy();
        });
    }
});

Crafty.c("invader-group", {
    _speed: 10, // pixels/s
    _dir: 1, // right

    // Invaders on the outer edges of the group
    _leftEdge: null,
    _rightEdge: null,
    _bottomEdge: null,

    init: function() {
        this.requires("2D, Canvas");
        this.attr({ w: INVADER_WIDTH * INVADER_COLS, h: INVADER_HEIGHT * INVADER_ROWS })
        // this.requires("Color").color('#00300');

        this.bind("EnterFrame", function() {
            this.x += this._dir * this._speed * 1.0/Crafty.timer.getFPS();

            if (this._leftEdge == null || this._rightEdge == null || this._bottomEdge == null) {
                this.findEdges();
            } else {
                if (this._leftEdge.x <= 0 || this._rightEdge.x + INVADER_WIDTH >= STAGE_W) {
                    if (DEBUG) console.log("Invaders descending");

                    // Change direction and move down
                    this._dir = this._dir * -1;
                    this.y += INVADER_HEIGHT * 0.3;

                    this._speed += 10;

                    // for(var i = 0; i < this._children.length; i++) {
                    //     var invader = this._children[i];
                    //     invader.fly(invader._speed + 3);
                    // }
                }

                if (this._bottomEdge.y + INVADER_HEIGHT >= STAGE_H) {
                    invadersWin();
                }
            }
        });
    },

    findEdges: function() {
        if (DEBUG) console.log("Resizing invader-group");

        this._leftEdge = null;
        this._rightEdge = null;
        this._bottomEdge = null;

        var invaders = Crafty("invader");        
        for(var i = 0; i < invaders.length; i++) {
            var invader = Crafty(invaders[i]);
            if (this._leftEdge == null || invader.x < this._leftEdge.x) {
                this._leftEdge = invader;
            }
            if (this._rightEdge == null || invader.x > this._rightEdge.x) {
                this._rightEdge = invader;
            }
            if (this._bottomEdge == null || invader.y > this._bottomEdge.y) {
                this._bottomEdge = invader;
            }
        }

        if (invaders.length == 0) {
            humansWin();
        }
    }
});

Crafty.c("block", {
    init: function() {
        this.requires("2D, Canvas, Color, solid");
        this.attr({ w: BLOCK_WIDTH, h: BLOCK_HEIGHT });
        this.color("#ff0000");

        this.bind("EnterFrame", function() {
            
        });
    }
});

Crafty.c("human", {
    _dir: -1,
    _speed: 200, // pixels/s
    _shotRecharge: 150, // milliseconds

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Delay, Tween, human_sprite, solid");
        this.attr({ w: HUMAN_WIDTH, h: HUMAN_HEIGHT, x: STAGE_W/2 - HUMAN_WIDTH/2, y: 475 });
        this.changeDirection();

        this.bind("EnterFrame", function() {
            this.x += this._dir * this._speed * 1.0/Crafty.timer.getFPS();

            if (this.x <= 0) {
                this._dir = 1;
            }

            if (this.x + HUMAN_WIDTH >= STAGE_W) {
                this._dir = -1;
            }
        });
    },

    fire: function() {
        // Check for shot
        // If underneath invader, canFire = true
        // If underneath bunker, canFire = false
        var center = this.x + HUMAN_WIDTH/2;
        var invaders = Crafty('invader');
        var canFire = false;
        for(var i = 0; i < invaders.length; i++) {
            // Use a 200px wide ray to test if we're under an invader
            if (Crafty(invaders[i]).intersect(center-100, 0, 200, STAGE_H)) {
                canFire = true;
                break;
            }
        }
        var blocks = Crafty('block');
        for(var i = 0; i < blocks.length; i++) {
            // Use a narrow ray to test if we're under a block
            if (Crafty(blocks[i]).intersect(center-BLOCK_WIDTH, 0, BLOCK_WIDTH*2, STAGE_H)) {
                canFire = false;
                break;
            }
        }

        if (canFire) {
            if (DEBUG) console.log("Fire missile");
            Crafty.e("missile").attr({ x: this.x + HUMAN_WIDTH/2, y: this.y });
        }

        this.delay(this.fire, this._shotRecharge);
    },

    changeDirection: function() {
        var max_delay = 6000;

        this._dir = Crafty.math.randomInt(-1,1);
        if (this._dir == 0) max_delay = 2000;

        this.delay(this.changeDirection, Crafty.math.randomInt(1000,max_delay));
    }
});

Crafty.c("missile", {
    _speed: 200, // pixels/s
    _max_speed: 500, // pixels/s
    _acceleration: 50, // pixels/s/s
    
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Color, missile_sprite, solid");
        this.attr({ w: 2, h: 4 });
        this.color('#ff0000');

        this.requires("Collision").collision();

        this.onHit("solid", function(hits) {
            for(var i = 0; i < hits.length; i++) {
                var other = hits[i].obj;
                if (other.has("invader")) {
                    Crafty.e("explosion-invader").attr({ x: other.x + other.attr('w')/2, y: other.y + other.attr('h')/2 });
                    // other.destroy();
                    other.addComponent("crash");
                    other.removeComponent("invader");
                    other.attr({ z: 0 });
                    this.destroy();

                    var invaders = Crafty('invader-group');
                    Crafty(invaders[0]).findEdges();
                }
                if (other.has("shield")) {
                    Crafty.e("explosion-shield").attr({ x: this.x, y: this.y });
                    this.destroy();
                }
                if (other.has("block")) {
                    Crafty.e("explosion-block").attr({ x: this.x, y: this.y });
                    this.destroy();
                    other.destroy();
                }

            }
        });

        this.bind("EnterFrame", function() {
            this._speed += this._acceleration * 1.0/Crafty.timer.getFPS();
            if (this._speed > this._max_speed) this._speed = this._max_speed;
            this.y -= this._speed * 1.0/Crafty.timer.getFPS();

            if (this.y <= 0) {
                Crafty.e("explosion-shield").attr({ x: this.x, y: this.y });
                this.destroy();
            }
        });
    }
});

Crafty.c("bomb", {
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, bomb_sprite, solid");
        this.bind("EnterFrame", function() {

        });
    }
});

Crafty.c("blink", {
    _n: 0,

    init: function() {
        this.bind("EnterFrame", function() {
            this.alpha = Math.abs(Math.sin(this._n)) * 1.0;
            this._n += Math.PI * 1.0/Crafty.timer.getFPS();
        });
    }
});

Crafty.c("crash", {
    _speed: -100, // pixels/s
    _gravity: 15, // pixels/s/s
    _vx: 0,
    _vr: 0,

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Mouse");

        if (this._parent) {
            this._parent.detach(this);
        }

        this._vx = Crafty.math.randomInt(-100, 100);
        this._vr = Crafty.math.randomInt(-360, 360);
        this.stop();

        this.attr({ w: INVADER_WIDTH, h: INVADER_HEIGHT });

        var sparks = Crafty.e("sparks").attr({ x: this.x + INVADER_WIDTH/2, y: this.y + INVADER_HEIGHT/2 });

        this.bind("EnterFrame", function() {
            this._speed += this._gravity;
            this.y += this._speed * 1.0/Crafty.timer.getFPS();
            this.x += this._vx * 1.0/Crafty.timer.getFPS();
            this.origin(INVADER_WIDTH/2, INVADER_HEIGHT/2);
            this.rotation += this._vr * 1.0/Crafty.timer.getFPS();

            sparks.x = this.x + INVADER_WIDTH/2;
            sparks.y = this.y + INVADER_HEIGHT/2;

            if (this.y > STAGE_W) {
                this.destroy();
            }
        });
    }
});

Crafty.c("explosion-invader", {
    init: function() {
        this.requires("Particles");
        this.particles({
            maxParticles: 100,
            size: 2,
            speed: 1,
            lifeSpan: 50,
            angleRandom: 360,
            startColour: [100, 255, 0, 1],
            endColour: [255, 255, 0, 0],
            sharpness: 20,
            fastMode: true,
            sharpnessRandom: 10,
            spread: 10,
            duration: 10,
            gravity: { x: 0, y: 0.1 },
            jitter: 0
        });

        this.timeout(function() { this.destroy(); }, 1000);
    }
});

Crafty.c("explosion-shield", {
    init: function() {
        this.requires("Particles");
        this.particles({
            maxParticles: 50,
            size: 2,
            speed: 0.2,
            lifeSpan: 25,
            angle: 180,
            angleRandom: 45,
            startColour: [255, 255, 255, 1],
            endColour: [255, 255, 255, 0],
            sharpness: 20,
            fastMode: true,
            sharpnessRandom: 10,
            spread: 10,
            duration: 10,
            gravity: { x: 0, y: 0.1 },
            jitter: 0
        });

        this.timeout(function() { this.destroy(); }, 1000);
    }
});

Crafty.c("explosion-human", {
    init: function() {
        this.requires("Particles");
        this.particles({
            maxParticles: 100,
            size: 2,
            speed: 1,
            lifeSpan: 50,
            angleRandom: 360,
            startColour: [255, 255, 255, 1],
            startColourRandom: [255, 255, 255, 1],
            endColour: [0, 0, 0, 0],
            sharpness: 20,
            fastMode: true,
            sharpnessRandom: 10,
            spread: 10,
            duration: 10,
            gravity: { x: 0, y: 0.1 },
            jitter: 0
        });

        this.timeout(function() { this.destroy(); }, 1000);
    }
});

Crafty.c("explosion-block", {
    init: function() {
        this.requires("Particles");
        this.particles({
            maxParticles: 20,
            size: 2,
            speed: 0.2,
            lifeSpan: 25,
            angle: 180,
            angleRandom: 45,
            startColour: [255, 0, 0, 1],
            endColour: [255, 0, 0, 0],
            sharpness: 20,
            fastMode: true,
            sharpnessRandom: 10,
            spread: 10,
            duration: 10,
            gravity: { x: 0, y: 0.1 },
            jitter: 0
        });

        this.timeout(function() { this.destroy(); }, 1000);
    }
});

Crafty.c("sparks", {
    init: function() {
        this.requires("Particles");
        this.particles({
            maxParticles: 200,
            size: 1,
            speed: 0.2,
            lifeSpan: 200,
            angle: 180,
            angleRandom: 45,
            startColour:       [255, 0, 0, 1],
            startColourRandom: [255, 255, 0, 1],
            endColour: [255, 255, 255, 0],
            sharpness: 20,
            fastMode: true,
            sharpnessRandom: 10,
            spread: 10,
            duration: 200,
            gravity: { x: 0, y: 0.1 },
            jitter: 0
        });

        this.timeout(function() { this.destroy(); }, 3000);
    }
});
