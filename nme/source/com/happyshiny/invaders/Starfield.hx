package com.happyshiny.invaders;

import org.flixel.FlxSprite;
import org.flixel.FlxState;
import org.flixel.FlxG;
import nme.Lib;

class Starfield extends FlxSprite
{
    public function new(scene : FlxState, number : Int)
    {
        super();

        for (i in 0...number)
        {
            scene.add(new Star());
        }
    }
}

class Star extends FlxSprite
{
    private var MIN_SPEED : Int = 2;
    private var MAX_SPEED : Int = 50;
    private var MAX_SIZE : Int = 4;

    private var size : Float = 1;

    public function new()
    {
        super();

        // Each star gets a random location, velocity, and alpha
        // Far away stars are dimmer and move more slowly
        x = Math.random() * FlxG.width;
        y = Math.random() * FlxG.height;
        size = Math.random() * (MAX_SIZE-1) + 1;
        width = size;
        height = size;
        centerOffsets();
        setClipping(Math.ceil(width), Math.ceil(height));

        fill(0xffffffff);
        alpha = Math.random() * 0.8 + 0.1;

        velocity.x = 0;
        velocity.y = alpha * (MAX_SPEED-MIN_SPEED) + MIN_SPEED;
        
    }

    public override function update()
    {
        if (y > FlxG.height) {
            y = -5;
            x = Math.random() * FlxG.width;
        }
        super.update();
    }
}
