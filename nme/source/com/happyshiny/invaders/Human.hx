package com.happyshiny.invaders;

import org.flixel.FlxSprite;
import org.flixel.FlxState;
import org.flixel.FlxG;
import nme.Lib;

class Human extends FlxSprite
{
    private var speed = 150;
    private var shotRecharge : Float = 0.2;
    private var shotTimer : Float = 0;
    private var dirTimer : Float = 0;
    private var fastMode : Bool = false;
    private var frozen : Bool = false;
    private var scene : FlxState = null;

    public function new(scene : FlxState)
    {
        super();

        this.scene = scene;

        width = 50;
        height = 50;

        loadGraphic("assets/images/human.png", true, true, 50, 50);

        y = FlxG.height - height/2;

        changeDirection();
    }

    public override function update()
    {
        super.update();

        shotTimer -= FlxG.elapsed;
        dirTimer -= FlxG.elapsed;

        if (dirTimer < 0) changeDirection();
        if (shotTimer < 0) fire();

        if (x <= 0) {
            velocity.x = speed;
        }

        if (x + width >= FlxG.width) {
            velocity.x = -speed;
        }

        if (frozen) {
            alpha = Math.random() * 0.9 + 0.1;
        } else {
            alpha = 1;
        }
    }

    public function fire()
    {
        // TODO Fire missile
        // Check for shot
        // If underneath invader, canFire = true
        // If underneath bunker, canFire = false
        // if (this._fastMode) {
        //     this.delay(this.fire, this._shotRecharge/2);
        // } else {
        //     this.delay(this.fire, this._shotRecharge);
        // }

        // if (!this.visible) return;

        // if (!this._frozen) {
        //     var canFire = false;
        //     var center = this.x + HUMAN_WIDTH/2;

        //     var invaders = Crafty('invader');
        //     for(var i = 0; i < invaders.length; i++) {
        //         // Use a 200px wide ray to test if we're under an invader
        //         if (!Crafty(invaders[i].visible)) continue;
                
        //         if (Crafty(invaders[i]).intersect(center-100, 0, 200, STAGE_H)) {
        //             canFire = true;
        //             break;
        //         }
        //     }
        //     var blocks = Crafty('block');
        //     for(var i = 0; i < blocks.length; i++) {
        //         // Use a narrow ray to test if we're under a block
        //         // Only test a sample of all of the blocks
        //         if (!Crafty(blocks[i]).visible) continue;
        //         if (Crafty.math.randomInt(1,5) != 1) continue;

        //         if (Crafty(blocks[i]).intersect(center-BLOCK_WIDTH, 0, BLOCK_WIDTH*2, STAGE_H)) {
        //             canFire = false;
        //             break;
        //         }
        //     }

        //     if (canFire) {
        //         if (DEBUG) console.log("Fire missile");
        //         ObjectPool.get("missile").attr({ x: this.x + HUMAN_WIDTH/2, y: this.y });
        //     }
        // }
    }

    public function changeDirection()
    {
        var maxDelay = 6.0;

        fastMode = false;

        var dir = Std.random(3) - 1;
        if (dir == 0) {
            maxDelay = 0.5;
            fastMode = true;
            velocity.x = 0;
        } else {
            velocity.x = dir * speed;
        }

        if (frozen) {
            y -= 5;
        }
        frozen = false;

        dirTimer = Math.random() * maxDelay + 1;
    }

    public function freeze()
    {
        if (!frozen) {
            y += 5;
        }
        frozen = true;
        velocity.x = 0;
    }
}

class Missile extends FlxSprite
{

}
