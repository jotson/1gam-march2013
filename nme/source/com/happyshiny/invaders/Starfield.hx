package com.happyshiny.invaders;

import org.flixel.FlxSprite;
import org.flixel.FlxGroup;
import org.flixel.FlxState;
import org.flixel.FlxG;
import nme.Lib;

class Starfield extends FlxGroup
{
    public function new(number : Int)
    {
        super();

        for (i in 0...number)
        {
            add(new Star());
        }
    }
}

class Star extends FlxSprite
{
    private var MIN_SPEED : Int = 2;
    private var MAX_SPEED : Int = 50;
    private var MAX_SIZE : Int = 4;

    private var size : Int = 1;

    public function new()
    {
        super();

        // Each star gets a random location, velocity, and alpha
        // Far away stars are dimmer and move more slowly
        x = Math.random() * FlxG.width;
        y = Math.random() * FlxG.height;
        size = Std.random(MAX_SIZE) + 1;
        width = size;
        height = size;
        makeGraphic(size, size, 0xffffffff);
        centerOffsets();

        alpha = Math.random() * 0.8 + 0.1;

        velocity.x = 0;
        velocity.y = alpha * (MAX_SPEED-MIN_SPEED) + MIN_SPEED;
        
    }

    public override function update()
    {
        super.update();
        
        if (y > FlxG.height) {
            y = -5;
            x = Math.random() * FlxG.width;
        }
    }
}
