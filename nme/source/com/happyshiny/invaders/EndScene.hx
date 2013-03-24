package com.happyshiny.invaders;

import nme.Assets;
import nme.geom.Rectangle;
import nme.net.SharedObject;
import org.flixel.FlxButton;
import org.flixel.FlxG;
import org.flixel.FlxPath;
import org.flixel.FlxSave;
import org.flixel.FlxSprite;
import org.flixel.FlxState;
import org.flixel.FlxText;
import org.flixel.FlxU;
import nme.display.FPS;
import nme.Lib;

class MenuScene extends FlxState
{
    public function new()
    {
        super();
    }
     
    public override function create():Void
    {
        FlxG.destroySounds(true);
        FlxG.play("assets/music/music.mp3", 1, true);
    }
    
    public override function destroy():Void
    {
        super.destroy();
    }

    public override function update():Void
    {
        super.update();
    }   
}
