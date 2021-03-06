package com.happyshiny.invaders;

import org.flixel.FlxSprite;
import org.flixel.FlxEmitter;
import org.flixel.FlxState;
import org.flixel.FlxG;
import org.flixel.FlxObject;
import org.flixel.FlxParticle;
import org.flixel.FlxPoint;
import org.flixel.tweens.util.Ease;
import nme.Lib;

class FadingParticle extends FlxParticle
{
    public function new()
    {
        super();
    }

    public override function onEmit()
    {
        super.onEmit();

        var size = Std.random(2)+1;
        scale = new FlxPoint(size, size);
        angularVelocity = Std.random(1440)-720;

        FlxG.tween(this, { alpha: 0 }, lifespan);
    }

    public override function revive()
    {
        super.revive();

        alpha = 1;
    }
}

class ColorfulParticle extends FadingParticle
{
    public function new()
    {
        super();
    }

    public override function onEmit()
    {
        super.onEmit();

        color = Std.random(0xffffff);
    }

    public override function revive()
    {
        super.revive();

        alpha = 1;
    }
}

class InvaderExplosion extends FlxEmitter
{
    var COUNT = 25;

    public function new()
    {
        super();

        minParticleSpeed = new FlxPoint(-250,-250);
        maxParticleSpeed = new FlxPoint(250,250);
        gravity = 500;

        particleClass = FadingParticle;

        makeParticles("assets/images/particle-green.png", COUNT);
    }

    public function goBoom(o : FlxObject)
    {
        at(o);
        start(true, 0.5);

        SoundManager.play("explosion1");
    }
}

class BombExplosion extends FlxEmitter
{
    var COUNT = 25;

    public function new()
    {
        super();

        minParticleSpeed = new FlxPoint(-250,-250);
        maxParticleSpeed = new FlxPoint(250,0);
        gravity = 500;

        particleClass = FadingParticle;

        makeParticles("assets/images/particle-blue.png", COUNT);
    }

    public function goBoom(o : FlxObject)
    {
        at(o);
        start(true, 1);

        SoundManager.play("explosion1", 1.0);
    }
}

class ShieldExplosion extends FlxEmitter
{
    var COUNT = 10;

    public function new()
    {
        super();

        minParticleSpeed = new FlxPoint(-50,0);
        maxParticleSpeed = new FlxPoint(50,100);
        gravity = 500;

        particleClass = FadingParticle;

        makeParticles("assets/images/particle-white.png", COUNT);
    }

    public function goBoom(o : FlxObject)
    {
        at(o);
        start(true, 0.25);

        SoundManager.play("ricochet");
    }
}

class HumanExplosion extends FlxEmitter
{
    var COUNT = 50;

    public function new()
    {
        super();

        minParticleSpeed = new FlxPoint(-250,-250);
        maxParticleSpeed = new FlxPoint(250,0);
        gravity = 500;

        particleClass = ColorfulParticle;

        makeParticles("assets/images/particle-white.png", COUNT);
    }

    public function goBoom(o : FlxObject)
    {
        at(o);
        start(true, 1);

        SoundManager.play("explosion1");
    }
}

class BlockExplosion extends FlxEmitter
{
    var COUNT = 25;

    public function new()
    {
        super();

        minParticleSpeed = new FlxPoint(-150,-150);
        maxParticleSpeed = new FlxPoint(150,0);
        gravity = 500;

        particleClass = FadingParticle;

        makeParticles("assets/images/particle-red.png", COUNT);
    }

    public function goBoom(o : FlxObject)
    {
        at(o);
        start(true, 1);

        SoundManager.play("explosion2");
    }
}

class Smoke extends FlxEmitter
{
    var COUNT = 25;

    public function new()
    {
        super();

        minParticleSpeed = new FlxPoint(-25,0);
        maxParticleSpeed = new FlxPoint(25,20);
        gravity = -50;

        particleClass = FadingParticle;

        makeParticles("assets/images/particle-white.png", COUNT);
    }
}
