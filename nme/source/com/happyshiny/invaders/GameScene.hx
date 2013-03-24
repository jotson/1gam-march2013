package com.happyshiny.invaders;

import nme.Assets;
import nme.geom.Rectangle;
import nme.net.SharedObject;
import nme.display.FPS;
import nme.Lib;
import org.flixel.FlxButton;
import org.flixel.FlxG;
import org.flixel.FlxPath;
import org.flixel.FlxSave;
import org.flixel.FlxSprite;
import org.flixel.FlxState;
import org.flixel.FlxText;
import org.flixel.FlxU;

class GameScene extends FlxState
{
    public function new()
    {
        super();
    }
     
    public override function create():Void
    {
        #if (flash || linux || mac || windows)
        FlxG.mouse.show();
        #end

        // Frame rate display
        var fps = new FPS(0, 0, 0xff0000);
        Lib.stage.addChild(fps);

        FlxG.destroySounds(true);
        Helper.play("assets/music/artillery.mp3", 1.0, true);
        // Helper.play("assets/music/war-sounds.mp3", 0.5, true);

        // Starfield
        new Starfield(this, 200);

        // Invaders
        add(new InvaderGroup(50, 0, false));

        // TODO Pause/play button
        // TODO Sound on/off button
        // TODO Return to menu button
        // TODO Android: Override back button
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
