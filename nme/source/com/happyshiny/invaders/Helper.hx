package com.happyshiny.invaders;

import org.flixel.FlxG;
import nme.media.Sound;
import nme.media.SoundTransform;

class Helper {
    public static function play(sound : String, volume : Float, loop : Bool = false) {
        #if android
            // Looping and referencing sounds by ID doesn't seem to work on Android
            var t = new SoundTransform(volume);
            var sound = FlxG.addSound(sound);
            if (loop)
            {
                sound.play(0, -1, t);
            }
            else
            {
                sound.play(0, 1, t);
            }
        #else
            FlxG.play(sound, volume, loop);
        #end
    }

    public static function getClass(o)
    {
        var c = Type.getClass(o);
        if (c == null)
        {
            return "null";
        }
        else
        {
            return Type.getClassName(c);
        }
    }

    public static function humansWin()
    {

    }

    public static function invadersWin()
    {

    }
}
