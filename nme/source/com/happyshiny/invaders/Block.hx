package com.happyshiny.invaders;

import org.flixel.FlxSprite;
import org.flixel.FlxState;
import org.flixel.FlxG;
import nme.Lib;

class Block extends FlxSprite
{
    public static var SIZE = 8;

    public function new(x, y)
    {
        super(x, y);

        makeGraphic(SIZE, SIZE, 0xffff0000);
    }
}
