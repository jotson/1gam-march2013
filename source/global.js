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

var STAGE_W = 700;
var STAGE_H = 500;
var FONTFACE = 'Offside';

var INVADER_WIDTH = 50;
var INVADER_HEIGHT = 50;
var INVADER_COLS = 11;
var INVADER_ROWS = 5;

var BLOCK_WIDTH = 4;
var BLOCK_HEIGHT = 4;

var HUMAN_WIDTH = 50;
var HUMAN_HEIGHT = 50;

var FPS = Crafty.timer.getFPS();
var T = 1.0/FPS;

function createBunker(x, y) {
    if (DEBUG) console.log("Creating bunker at " + x + ", " + y);

    var shape = [
        '     ***',
        '   *******',
        '  *********',
        ' ***********',
        '*************',
        '*************',
        '*****   *****',
        '****     ****',
        '***       ***',
        '***       ***'
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

function invadersWin() {
    if (DEBUG) console.log("Invaders win!");

    var invaders = Crafty(Crafty("invader-group")[0]);
    var human = Crafty(Crafty("human")[0]);

    invaders.unbind("EnterFrame");

    Crafty.e("explosion-human").attr({ x: human.x + HUMAN_WIDTH/2, y: human.y + HUMAN_HEIGHT/2 });
    human.destroy();

    Crafty.scene("playing");
}

function humansWin() {
    if (DEBUG) console.log("Humans win!");

    var invaders = Crafty(Crafty("invader-group")[0]);
    var human = Crafty(Crafty("human")[0]);

    invaders.unbind("EnterFrame");

    Crafty.scene("playing");
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
                this.sounds[id] = { n: 0, variations: 1 };
                v = 1;
            } else {
                this.sounds[id].variations++;
                v = this.sounds[id].variations;
            }
            name = id + "" + v;
            for(i = 0; i < this.CHANNELS; i++) {
                Crafty.audio.add(name + "-" + i, obj[id]);
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

        var n = s.n;
        var v = s.variations;
        var name = id + "" + Crafty.math.randomInt(1,v);

        this.sounds[id].n = (n+1) % this.CHANNELS;

        Crafty.audio.play(name + "-" + n, repeat, volume);
    }
}
