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

var DEBUG = false;

var STAGE_W = 800;
var STAGE_H = 500;
var FONTFACE = 'Offside';

var INVADER_WIDTH = 50;
var INVADER_HEIGHT = 50;
var INVADER_COLS = 11;
var INVADER_ROWS = 5;

var BLOCK_WIDTH = 8;
var BLOCK_HEIGHT = 8;

var HUMAN_WIDTH = 50;
var HUMAN_HEIGHT = 50;

var FPS = Crafty.timer.getFPS();
var T = 1.0/FPS;

var CHROME = false;
if (navigator.userAgent.indexOf('Chrome') !== -1) {
    CHROME = true;
}

function createBunker(x, y) {
    if (DEBUG) console.log("Creating bunker at " + x + ", " + y);

    var shape = [
        '  **',
        ' ****',
        '******',
        '******',
        '**  **',
    ];

    var height = shape.length * BLOCK_HEIGHT;
    var width = 0;
    for(var yy = 0; yy < shape.length; yy++) {
        width = Math.max(width, shape[yy].length * BLOCK_WIDTH);
    }

    for(var yy = 0; yy < shape.length; yy++) {
        var row = shape[yy];
        for(var xx = 0; xx < row.length; xx++) {
            if (row[xx] == '*') {
                Crafty.e("block").attr({
                    x: x + xx * BLOCK_WIDTH - Math.floor(width/2),
                    y: y + yy * BLOCK_HEIGHT
                });
            }
        }
    }
}

var winner = null;
var ships_remaining = null;
function invadersWin() {
    if (DEBUG) console.log("Invaders win!");

    var invaders = Crafty(Crafty("invader-group")[0]);
    var human = Crafty(Crafty("human")[0]);

    winner = 'invaders';
    ships_remaining = Crafty("invader").length;

    Crafty.scene("gameover");
}

function humansWin() {
    if (DEBUG) console.log("Humans win!");

    var invaders = Crafty(Crafty("invader-group")[0]);
    var human = Crafty(Crafty("human")[0]);

    winner = 'humans';
    ships_remaining = Crafty("invader").length;

    Crafty.scene("gameover");
}

/**
 * This is a thin wrapper around Crafty.audio to enable playing the same sound multiple times at once
 * Each sound can be played simultaneously up to CHANNELS times.
 */
var SoundManager = {
    CHANNELS: 5,

    sounds: {},

    /**
     * Add a sound to be played
     * If you add multiple sounds with the same id, they will be added as variations and will be played randomly by play()
     * @param Object obj  Add a sound with an object like: { sound1: ['sound.mp3', 'sound.ogg', 'sound.wav'], sound2: ... }
     */
    add: function(obj) {
        for (var id in obj) {
            var v;
            if (this.sounds[id] == undefined) {
                this.sounds[id] = { channel: 0, variations: 1 };
                v = 1;
            } else {
                this.sounds[id].variations++;
                v = this.sounds[id].variations;
            }
            name = id + "" + v;
            for(channel = 0; channel < this.CHANNELS; channel++) {
                Crafty.audio.add(name + "-" + channel, obj[id]);
            }
        }
    },

    /**
     * Play a sound using each channel consecutively
     * @param  string id  Play a sound using the id from add()
     */
    play: function(id, repeat, volume) {
        var s = this.sounds[id];

        if (s == undefined) return;

        var channel = s.channel;
        var v = s.variations;
        var name = id + "" + Crafty.math.randomInt(1,v);

        this.sounds[id].channel = (channel+1) % this.CHANNELS;

        Crafty.audio.play(name + "-" + channel, repeat, volume);
    },

    stop: function(id) {
        if (!id) {
            Crafty.audio.stop();
        } else {
            var s = this.sounds[id];

            if (s == undefined) return;

            var n = s.n;
            var v = s.variations;
            
            for(var i = 1; i <= v; i++) {
                var name = id + "" + i;
                for(var channel = 0; channel < this.CHANNELS; channel++) {
                    Crafty.audio.stop(name + '-' + channel);
                }
            }
        }
    }
}

var ObjectPool = {
    /**
     * Get a cached entity or create a new one
     * @param  string component Component string (e.g. "player")
     * @return entity
     */
    get: function(component) {
        var objects = Crafty(component);
        for(var i = 0; i < objects.length; i++) {
            var e = Crafty(objects[i]);
            if (!e.visible) {
                e.visible = true;
                e.active = true;
                if (typeof(e.revive) == 'function') {
                    e.revive();
                }
                return e;
            }
        }

        if (DEBUG) console.log("Creating new " + component);
        var e = Crafty.e(component);
        e.setName(component);
        e.visible = true;
        e.active = true;
        return e;
    },

    /**
     * Recycle
     * @param  entity o Entity
     */
    recycle: function(e) {
        e.visible = false;
        e.active = false;

        if (typeof(e.recycle) == 'function') {
            e.recycle();
        }
    }
}
