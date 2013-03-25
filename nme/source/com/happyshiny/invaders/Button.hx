package com.happyshiny.invaders;

import org.flixel.FlxG;
import org.flixel.FlxPoint;
import org.flixel.FlxButton;
import org.flixel.tweens.FlxTween;
import org.flixel.tweens.util.Ease;

class Button extends FlxButton
{
    public function new(X:Float, Y:Float, Graphic:String, OnClick:Void->Void = null)
    {
        super(X, Y, null, OnClick);

        loadGraphic(Graphic);
        x = x - width/2;
        y = y - height/2;

        FlxG.tween(this, { alpha: 0.6 }, 0.5, { type: FlxTween.PINGPONG, ease: Ease.quadInOut });
        FlxG.tween(this, { y: y + 2 }, 0.25, { type: FlxTween.PINGPONG, ease: Ease.quadInOut });
        onOver = function() { scale = new FlxPoint(1.2, 1.2); }
        onOut = function() { scale = new FlxPoint(1.0, 1.0); }
    }
}
