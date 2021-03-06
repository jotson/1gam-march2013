package com.happyshiny.invaders;

import org.flixel.FlxSprite;
import org.flixel.FlxState;
import org.flixel.FlxG;
import org.flixel.FlxObject;
import org.flixel.FlxEmitter;
import org.flixel.FlxParticle;
import org.flixel.FlxPoint;
import com.happyshiny.invaders.InvaderGroup;
import com.happyshiny.invaders.Particles;
import nme.Lib;

class Human extends FlxSprite
{
    private var speed = 150;
    private var shotRecharge : Float = 0.2;
    private var shotTimer : Float = 0;
    private var dirTimer : Float = 0;
    private var fastMode : Bool = false;
    private var frozen : Bool = false;
    public var mode : String = 'normal';

    public function new(mode : String = 'normal')
    {
        super();

        this.mode = mode;

        width = 50;
        height = 50;

        loadGraphic("assets/images/human.png", true, true, 50, 50);

        x = FlxG.width/2 - width/2;
        y = FlxG.height - height/2;

        if (mode == 'normal')
        {
            freeze();
            shotTimer = 5;
            dirTimer = 3;
        }
        else
        {
            shotTimer = 99999;
            dirTimer = 0;
        }
    }

    public override function update()
    {
        super.update();

        // Collisions
        if (mode == 'normal')
        {
            FlxG.overlap(Reg.missileGroup, Reg.blockGroup, function(missile, block) {
                var explosion = cast(FlxG.state.recycle(BlockExplosion), BlockExplosion);
                explosion.goBoom(block);

                missile.kill();
                block.kill();
            });
            
            FlxG.overlap(Reg.missileGroup, Reg.invaderGroup, function(missile, invader) {
                var explosion = cast(FlxG.state.recycle(InvaderExplosion), InvaderExplosion);
                explosion.goBoom(invader);

                missile.kill();
                invader.kill();
            });
            
            FlxG.overlap(Reg.missileGroup, Reg.bombGroup, function(missile, bomb) {
                var explosion = cast(FlxG.state.recycle(BlockExplosion), BlockExplosion);
                explosion.goBoom(bomb);

                missile.kill();
                bomb.kill();
            });
            
            FlxG.overlap(Reg.missileGroup, Reg.shieldGroup, function(missile, shield) {
                var explosion = cast(FlxG.state.recycle(ShieldExplosion), ShieldExplosion);
                explosion.goBoom(missile);

                missile.kill();
            });
        }
        
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
        if (mode != 'normal') return;

        // Check for shot
        // If underneath invader, canFire = true
        // If underneath bunker, canFire = false
        if (this.fastMode) {
            shotTimer = shotRecharge/2;
        } else {
            shotTimer = shotRecharge;
        }

        if (!this.frozen) {
            var canFire = false;
            var C = x + width/2;

            var rect = new FlxSprite(C, 0);
            rect.height = FlxG.height;

            // Use a wide ray to look for invaders
            rect.x = C-100;
            rect.width = 200;
            if (FlxG.overlap(Reg.invaderGroup, rect)) canFire = true;

            // Use a narrow ray to look for blocks
            rect.x = C-2;
            rect.width = 4;
            if (FlxG.overlap(Reg.blockGroup, rect)) canFire = false;

            if (canFire) {
                var m : Missile = cast(Reg.missileGroup.recycle(Missile), Missile);
                if (m != null)
                {
                    m.x = x + width/2;
                    m.y = y;
                    m.revive();
                }
            }
        }
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

    public override function hurt(Damage:Float):Void
    {
        freeze();
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
    public function new()
    {
        super();

        makeGraphic(2, 4, 0xffff0000);
        centerOffsets();

        this.velocity.y = -200;
    }

    public override function update()
    {

        super.update();

        if (y < 0)
        {
            var explosion = cast(FlxG.state.recycle(ShieldExplosion), ShieldExplosion);
            explosion.goBoom(this);

            SoundManager.play("ricochet");

            kill();
        }
        
    }

    public override function revive()
    {
        super.revive();

        SoundManager.play("railgun");
    }
}
