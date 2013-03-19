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

Crafty.c("invader", {
    _startX: null,
    _startY: null,
    _speed: 50,

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Mouse, solid");
        this.attr({ w: INVADER_WIDTH, h: INVADER_HEIGHT });
        this.timeout(this.bomb, 1000);
        this.timeout(this.talk, 1000);

        this.requires("Collision").collision([10,10], [40,10], [45,38], [5,38]);
        if (DEBUG) this.requires("WiredHitBox");
        this.onHit("solid", function(hits) {
            if (!this.visible) return;
            if (!this.has("invader")) return;

            for(var i = 0; i < hits.length; i++) {
                var other = hits[i].obj;
                if (!other.visible) continue;

                if (other.has("block")) {
                    ObjectPool.recycle(other);
                }

                if (other.has("human")) {
                    invadersWin();
                }
            }
        });

        this.bind("EnterFrame", function() {
            if (!this.visible) return;
        });

        this.bind("MouseMove", function(e) {
            if (!this.visible) return;

            // Activate shield if we don't already have one
            if (!this.hasShield()) {
                this.attach(ObjectPool.get("shield").attr({ x: this.x, y: this.y + 25 }));
            }
        });
    },

    hasShield: function() {
        if (this._children.length) {
            for(var i = 0; i < this._children.length; i++) {
                var c = this._children[i];

                // Need typeof() because Collision adds a Polygon child that doesn't have has()
                if (typeof(c.has) != 'undefined' && c.has("shield") && c.visible) {
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
    },

    bomb: function() {
        this.timeout(this.bomb, 500);

        if (!this.visible) return;

        if (Crafty.isPaused()) return;

        if (Crafty.math.randomInt(1,50) == 1) {
            ObjectPool.get("bomb").attr({ x: this.x + INVADER_WIDTH/2, y: this.y + INVADER_HEIGHT });
        }
    },

    talk: function() {
        this.timeout(this.talk, 1000);

        if (!this.visible) return;
        if (Crafty.isPaused()) return;

        if (Crafty.math.randomInt(1, Crafty("invader").length * 3) == 1) {
            var bubble = ObjectPool.get("speech-bubble")
            bubble.connect(this);
        }
    }
});

Crafty.c("shield", {
    _lifetime: 2 * FPS, // 2 seconds

    init: function() {
        if (DEBUG) console.log("Shield activated");

        this.requires("2D, Tween, Canvas, SpriteAnimation, shield_sprite, solid");
        this.animate("activate", 0, 0, 3);
        this.animate("activate", 10, -1);
        this.attr({ w: INVADER_WIDTH, h: INVADER_HEIGHT });

        this.revive();

        this.requires("Collision").collision([0,25], [50,25], [50,30], [0,30]);
        if (DEBUG) this.requires("WiredHitBox");

        this.bind("TweenEnd", function(property) {
            if (DEBUG) console.log("Shield deactivated");
            if (this._parent) this._parent.detach(this);
            ObjectPool.recycle(this);
        });
    },

    revive: function() {
        this.alpha = 1;
        this.tween({ alpha: 0.2 }, this._lifetime);
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
            this.x += this._dir * this._speed * T;

            if (this._leftEdge == null || this._rightEdge == null || this._bottomEdge == null) {
                this.findEdges();
            } else {
                if (this._leftEdge.x <= 0 || this._rightEdge.x + INVADER_WIDTH >= STAGE_W) {
                    if (DEBUG) console.log("Invaders descending");

                    // Change direction and move down
                    this._dir = this._dir * -1;
                    this.y += INVADER_HEIGHT * 0.3;

                    this._speed += 5;

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
        this.attr({ w: BLOCK_WIDTH, h: BLOCK_HEIGHT, z: 100 });
        this.color("#ff0000");
    },

    recycle: function() {
        this.removeComponent("solid");
    },

    revive: function() {
        this.addComponent("solid");
    }
});

Crafty.c("human", {
    _dir: -1,
    _speed: 150, // pixels/s
    _shotRecharge: 200, // milliseconds
    _fastMode: false,
    _frozen: false,

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Delay, human_sprite, solid");
        this.attr({ w: HUMAN_WIDTH, h: HUMAN_HEIGHT, x: STAGE_W/2 - HUMAN_WIDTH/2, y: 475, z: 10 });
        this.changeDirection();

        this.bind("EnterFrame", function() {
            if (!this.visible) return;

            this.x += this._dir * this._speed * T;

            if (this.x <= 0) {
                this._dir = 1;
            }

            if (this.x + HUMAN_WIDTH >= STAGE_W) {
                this._dir = -1;
            }

            if (this._frozen) {
                this.alpha = Crafty.math.randomNumber(0.1, 1);
            } else {
                this.alpha = 1;
            }
        });
    },

    fire: function() {
        // Check for shot
        // If underneath invader, canFire = true
        // If underneath bunker, canFire = false
        if (this._fastMode) {
            this.delay(this.fire, this._shotRecharge/2);
        } else {
            this.delay(this.fire, this._shotRecharge);
        }

        if (!this.visible) return;

        if (!this._frozen) {
            var canFire = false;
            var center = this.x + HUMAN_WIDTH/2;

            var invaders = Crafty('invader');
            for(var i = 0; i < invaders.length; i++) {
                // Use a 200px wide ray to test if we're under an invader
                if (!Crafty(invaders[i].visible)) continue;
                
                if (Crafty(invaders[i]).intersect(center-100, 0, 200, STAGE_H)) {
                    canFire = true;
                    break;
                }
            }
            var blocks = Crafty('block');
            for(var i = 0; i < blocks.length; i++) {
                // Use a narrow ray to test if we're under a block
                // Only test a sample of all of the blocks
                if (!Crafty(blocks[i]).visible) continue;
                if (Crafty.math.randomInt(1,5) != 1) continue;

                if (Crafty(blocks[i]).intersect(center-BLOCK_WIDTH, 0, BLOCK_WIDTH*2, STAGE_H)) {
                    canFire = false;
                    break;
                }
            }

            if (canFire) {
                if (DEBUG) console.log("Fire missile");
                ObjectPool.get("missile").attr({ x: this.x + HUMAN_WIDTH/2, y: this.y });
            }
        }
    },

    changeDirection: function() {
        var max_delay = 6000;

        this._fastMode = false;

        this._dir = Crafty.math.randomInt(-1,1);
        if (this._dir == 0) {
            max_delay = 500;
            this._fastMode = true;
        }

        if (this._frozen) {
            this.y -= 5;
        }
        this._frozen = false;

        this.delay(this.changeDirection, Crafty.math.randomInt(1000,max_delay));
    },

    freeze: function() {
        if (!this._frozen) {
            this.y += 5;
        }
        this._frozen = true;
        this._dir = 0;
    }
});

Crafty.c("missile", {
    _speed: 200, // pixels/s
    
    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, Color, missile_sprite, solid");
        this.attr({ w: 2, h: 4 });
        this.color('#ff0000');

        this.revive();

        this.requires("Collision").collision();

        this.onHit("solid", function(hits) {
            if (!this.visible) return;

            for(var i = 0; i < hits.length; i++) {
                var other = hits[i].obj;
                if (!other.visible) continue;

                if (other.has("invader")) {
                    ObjectPool.get("explosion-invader").attr({ x: other.x + other.attr('w')/2, y: other.y + other.attr('h')/2 });
                    other.addComponent("crash");
                    other.removeComponent("invader");
                    other.attr({ z: 0 });
                    ObjectPool.recycle(this);

                    var invaders = Crafty('invader-group');
                    Crafty(invaders[0]).findEdges();
                }
                if (other.has("shield")) {
                    ObjectPool.get("explosion-shield").attr({ x: this.x, y: this.y });
                    ObjectPool.recycle(this);
                }
                if (other.has("block")) {
                    ObjectPool.get("explosion-block").attr({ x: this.x, y: this.y });
                    ObjectPool.recycle(this);
                    ObjectPool.recycle(other);
                }

            }
        });

        this.bind("EnterFrame", function() {
            if (!this.visible) return;

            this.y -= this._speed * T;

            if (this.y <= 0) {
                ObjectPool.get("explosion-shield").attr({ x: this.x, y: this.y });
                ObjectPool.recycle(this);
            }
        });
    },

    revive: function() {
        SoundManager.play("missile", 1, 0.7);
    }
});

Crafty.c("bomb", {
    _speed: 250, // pixels/s
    _hp: 1,

    init: function() {
        this.requires("2D, Canvas, SpriteAnimation, bomb_sprite, solid");
        this.attr({ w: 8, h: 8, z: -1 });

        this.requires("Collision").collision();
        this.onHit("solid", function(hits) {
            if (!this.visible) return;

            for(var i = 0; i < hits.length; i++) {
                var other = hits[i].obj;
                if (!other.visible) continue;

                if (other.has("human")) {
                    ObjectPool.get("explosion-human").attr({ x: other.x + HUMAN_WIDTH/2, y: other.y });
                    ObjectPool.recycle(this);
                    other.freeze();
                }

                if (other.has("block")) {
                    ObjectPool.recycle(other);
                    this._hp--;
                    if (this._hp <= 0) {
                        ObjectPool.get("explosion-block").attr({ x: this.x, y: this.y });
                        ObjectPool.recycle(this);
                    }
                }

                if (other.has("missile")) {
                    ObjectPool.get("explosion-block").attr({ x: this.x, y: this.y });
                    ObjectPool.recycle(other);
                    this._hp--;
                    if (this._hp <= 0) ObjectPool.recycle(this);
                }

            }
        });

        this.requires("Color").color('#3399ff');

        this.bind("EnterFrame", function() {
            if (!this.visible) return;

            this.y += this._speed * T;

            if (this.y > STAGE_H) {
                ObjectPool.get("explosion-bomb").attr({ x: this.x, y: this.y });

                ObjectPool.recycle(this);
            }
        });
    },

    revive: function() {
        this._hp = 1;
    }
});

Crafty.c("blink", {
    _n: 0,

    init: function() {
        this.bind("EnterFrame", function() {
            this.alpha = Math.abs(Math.sin(this._n)) * 1.0;
            this._n += Math.PI * T;
        });
    }
});

Crafty.c("blink-fast", {
    _n: 0,

    init: function() {
        this.bind("EnterFrame", function() {
            this.alpha = Math.abs(Math.sin(this._n)) * 1.0;
            this._n += 2 * Math.PI * T;
        });
    }
});

Crafty.c("crash", {
    _speed: -100, // pixels/s
    _gravity: 15, // pixels/s
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

        var smoke = ObjectPool.get("smoke").attr({ x: this.x + INVADER_WIDTH/2, y: this.y + INVADER_HEIGHT/2 });
        
        this.bind("EnterFrame", function() {
            if (!this.visible) return;

            this.alpha = Crafty.math.randomNumber(0, 1);
            this._speed += this._gravity;
            this.y += this._speed * T;
            this.x += this._vx * T;
            this.origin(INVADER_WIDTH/2, INVADER_HEIGHT/2);
            this.rotation += this._vr * T;

            // smoke.x = this.x + INVADER_WIDTH/2;
            // smoke.y = this.y + INVADER_HEIGHT/2;

            if (this.y > STAGE_W) {
                ObjectPool.recycle(this);
            }
        });
    }
});

Crafty.c("starfield", {
    _stars: 100,
    _minSpeed: 1, // pixels/s
    _maxSpeed: 20, // pixels/s
    _maxSize: 3,

    init: function() {
        if (CHROME) this._stars = 400;
        for(var i = 0; i < this._stars; i++) {
            this.addStar();
        }
    },

    addStar: function(x, y) {
        if (x == null || x == undefined) x = Crafty.math.randomInt(1, STAGE_W);
        if (y == null || y == undefined) y = Crafty.math.randomInt(1, STAGE_H);
        var speed = Crafty.math.randomInt(this._minSpeed, this._maxSpeed);
        var alpha = speed / this._maxSpeed * 1;
        var size =  Crafty.math.randomInt(1, this._maxSize);

        var star = Crafty.e("2D, Canvas, Color")
        star.attr({ x: x, y: y, z: 0, w: size, h: size, alpha: alpha, speed: speed });
        star.color('#ffffff');
        star.bind("EnterFrame", function() {
            this.y += this.attr('speed') * T;

            // When star reaches edge, recycle it
            if (this.y > STAGE_H) {
                this.x = Crafty.math.randomInt(1, STAGE_W);
                this.y = -10;
            }
        });
    },
});

Crafty.c("explosion-invader", {
    init: function() {
        this.requires("2D, Particles");
        this.particles({
            maxParticles: 25,
            size: 2,
            speed: 250 * T,
            lifeSpan: 0.5 * FPS,
            angleRandom: 360,
            startColour: [100, 255, 0, 1],
            endColour:   [255, 255, 0, 0],
            sharpness: 20,
            fastMode: true,
            spread: 0,
            duration: 1,
            gravity: { x: 0, y: 5 * T },
            jitter: 0
        });
        this._Particles.emissionRate = 1000;
        this.revive();
    },

    revive: function() {
        SoundManager.play("explosion1");
        if (Crafty.math.randomInt(1,5) == 1) SoundManager.play("crash");
        this._Particles.particleCount = 0;
        this._Particles.active = true;
        this.timeout(function() { ObjectPool.recycle(this); }, 1000);
    }
});

Crafty.c("explosion-bomb", {
    init: function() {
        this.requires("2D, Particles");
        this.particles({
            maxParticles: 25,
            size: 2,
            speed: 250 * T,
            lifeSpan: 1 * FPS,
            angle: 0,
            angleRandom: 90,
            startColour: [60, 120, 255, 1],
            endColour: [0, 0, 0, 0],
            sharpness: 20,
            fastMode: true,
            spread: 0,
            duration: 1,
            gravity: { x: 0, y: 5 * T },
            jitter: 0
        });
        this._Particles.emissionRate = 1000;
        this.revive();
    },

    revive: function() {
        SoundManager.play("explosion1");
        this._Particles.particleCount = 0;
        this._Particles.active = true;
        this.timeout(function() { ObjectPool.recycle(this); }, 1000);
    }
});

Crafty.c("explosion-shield", {
    init: function() {
        this.requires("2D, Particles");
        this.particles({
            maxParticles: 25,
            size: 2,
            speed: 50 * T,
            lifeSpan: 0.5 * FPS,
            angle: 180,
            angleRandom: 90,
            startColour: [255, 255, 255, 1],
            endColour: [0, 0, 0, 0],
            sharpness: 20,
            fastMode: true,
            spread: 5,
            duration: 1,
            gravity: { x: 0, y: 5 * T },
            jitter: 0
        });
        this._Particles.emissionRate = 1000;
        this.revive();
    },

    revive: function() {
        SoundManager.play("ricochet");
        this._Particles.particleCount = 0;
        this._Particles.active = true;
        this.timeout(function() { ObjectPool.recycle(this); }, 1000);
    }
});

Crafty.c("explosion-human", {
    init: function() {
        this.requires("2D, Particles");
        this._Particles.emissionRate = 9999;
        this.particles({
            maxParticles: 50,
            size: 2,
            speed: 250 * T,
            lifeSpan: 1 * FPS,
            angle: 0,
            angleRandom: 90,
            startColour: [255, 255, 255, 1],
            startColourRandom: [255, 255, 255, 1],
            endColour: [0, 0, 0, 0],
            sharpness: 20,
            fastMode: true,
            spread: 0,
            duration: 1,
            gravity: { x: 0, y: 5 * T },
            jitter: 0
        });
        this._Particles.emissionRate = 1000;
        this.revive();
    },

    revive: function() {
        SoundManager.play("explosion1");
        this._Particles.particleCount = 0;
        this._Particles.active = true;
        this.timeout(function() { ObjectPool.recycle(this); }, 1000);
    }
});

Crafty.c("explosion-block", {
    init: function() {
        this.requires("2D, Particles");
        this.particles({
            maxParticles: 20,
            size: 2,
            speed: 150 * T,
            lifeSpan: 0.5 * FPS,
            angle: 0,
            angleRandom: 90,
            startColour: [255, 0, 0, 1],
            endColour: [255, 0, 0, 0],
            sharpness: 20,
            fastMode: true,
            spread: 0,
            duration: 1,
            gravity: { x: 0, y: 5 * T },
            jitter: 0
        });
        this._Particles.emissionRate = 1000;
        this.revive();
    },

    revive: function() {
        SoundManager.play("explosion2");
        this._Particles.particleCount = 0;
        this._Particles.active = true;
        this.timeout(function() { ObjectPool.recycle(this); }, 1000);
    }
});

Crafty.c("smoke", {
    init: function() {
        this.requires("2D, Particles");
        this.particles({
            maxParticles: 100,
            size: 1,
            sizeRandom: 5,
            speed: 0,
            lifeSpan: 0.5 * FPS,
            angle: 0,
            angleRandom: 45,
            startColour:       [120, 120, 180, 0.7],
            startColourRandom: [000, 000, 000, 0.7],
            endColour: [255, 255, 255, 0],
            sharpness: 20,
            fastMode: true,
            spread: 5,
            duration: 0.5 * FPS,
            gravity: { x: 0, y: -1.25 * T },
            jitter: 0
        });
        this.revive();
    },

    revive: function() {
        this._Particles.particleCount = 0;
        this._Particles.active = true;
        this.timeout(function() { ObjectPool.recycle(this); }, 3000);
    }
});

Crafty.c("button", {
    init: function() {
        this.requires("2D, Canvas, Mouse");

        this.alpha = 0.7;

        this.bind("MouseOver", function(e) { this.alpha = 1.0; });
        this.bind("MouseOut", function(e) { this.alpha = 0.7; });
        this.bind("MouseDown", function(e) { this.click(); });
    },

    click: function() {
        // Override this
    }
});

Crafty.c("bouncy", {
    _vx: 0,
    _vy: 0,
    _gy: 10,
    _friction: 10,

    init: function() {
        this.jump();

        this.bind("EnterFrame", function() {
            // Gravity
            this._vy += this._gy;

            // Boundaries
            if (this.y > STAGE_H - INVADER_HEIGHT) {
                this.y = STAGE_H - INVADER_HEIGHT;
                this._vy = 0;
            }

            if (this.x > STAGE_W - INVADER_WIDTH) {
                this.x = STAGE_W - INVADER_WIDTH - 1;
                this._vx = -this._vx;
            }

            if (this.x < 0) {
                this.x = 1;
                this._vx = -this._vx;
            }

            // Friction
            if (this._vx > 0) {
                this._vx -= this._friction * T;
            }
            if (this._vx < 0) {
                this._vx += this._friction * T;
            }
            if (Math.abs(this._vx) <= this._friction) {
                this._vx = 0;
            }

            // Update position
            this.x += this._vx * T;
            this.y += this._vy * T;
        });
    },

    jump: function() {
        this.timeout(this.jump, Crafty.math.randomInt(1000,3000));

        if (this.y < STAGE_H - INVADER_HEIGHT) return;

        this._vx = Crafty.math.randomInt(-200, 200);
        this._vy = -500;
    }
})

Crafty.c("speech-bubble", {
    message: null,

    init: function() {
        this.requires("2D, Canvas, Tween, Collision, speech_bubble");
        this.attr({ w: 130, h: 68 });

        this.bind("TweenEnd", function() {
            if (this._parent) this._parent.detach(this);
            ObjectPool.recycle(this);
        })
    },

    connect: function(e) {
        if (e.y < this.h + 25) {
            ObjectPool.recycle(this);
            return;
        }
        if (!e.visible) {
            ObjectPool.recycle(this);
            return;
        }

        this.x = e.x + e.w/2 - this.w/2;
        this.y = e.y - this.h + 5;

        // Prevent overlapping bubbles
        if (this.hit("speech-bubble")) {
            ObjectPool.recycle(this);
            return;
        }

        // Create new message entity if necessary
        if (this.message == null) {
            this.message = Crafty.e("2D, DOM, Text, Tween");
            this.message.css({
                'font-size': '10px',
                'font-family': FONTFACE,
                'color': '#ffffff',
                'text-align': 'center' });
            this.attach(this.message);
        }

        // Choose a message
        var nonsense = Crafty.math.randomElementOfArray(THINGS_INVADERS_SAY);
        var offset = 0;
        if (nonsense.length < 60) offset = 5;
        if (nonsense.length < 50) offset = 8;
        if (nonsense.length < 30) offset = 12;
        if (nonsense.length < 20) offset = 18;
        this.message.attr({ x: this.x + 5, y: this.y + 3 + offset, w: 120, h: 60 });
        this.message.text(nonsense);

        // Attach to entity
        e.attach(this);

        // Start tween
        this.alpha = 0.95;
        this.message.alpha = 1;
        this.timeout(function() {
            this.tween({ alpha: 0 }, 0.5 * FPS);
            this.message.tween({ alpha: 0 }, 0.5 * FPS);
        }, 4000);
    }
})