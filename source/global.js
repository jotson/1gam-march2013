var DEBUG = true;

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
    Crafty(human).destroy();
}

function humansWin() {
    if (DEBUG) console.log("Humans win!");

    var invaders = Crafty(Crafty("invader-group")[0]);
    var human = Crafty(Crafty("human")[0]);

    invaders.unbind("EnterFrame");
}
