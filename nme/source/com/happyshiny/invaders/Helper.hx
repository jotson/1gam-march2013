package com.happyshiny.invaders;

import org.flixel.FlxG;
import org.flixel.FlxGroup;
import org.flixel.FlxState;
import nme.media.Sound;
import nme.media.SoundTransform;

class Helper {
    public static var bombGroup : FlxGroup = null;
    public static var missileGroup : FlxGroup = null;
    public static var invaderGroup : InvaderGroup = null;
    public static var blockGroup : FlxGroup = null;
    public static var shieldGroup : FlxGroup = null;
    public static var human : Human = null;

    public static function setupGroups()
    {
        bombGroup = new FlxGroup();
        missileGroup = new FlxGroup();
        blockGroup = new FlxGroup();
        shieldGroup = new FlxGroup();
    }

    public static function play(sound : String, volume : Float, loop : Bool = false) {
        if (!FlxG.mute) return;

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

    public static function isClass(o, className : String) : Bool
    {
        if (Helper.getClass(o) == className)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public static function humansWin()
    {

    }

    public static function invadersWin()
    {

    }
}
