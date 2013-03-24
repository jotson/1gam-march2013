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

class MenuScene extends FlxState
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

        // Titles
        // TODO Graphic titles
        add(new FlxText(0, 10, FlxG.width, "Reverse Invaders")
            .setFormat("assets/fonts/Offside-Regular.ttf", 50, 0xff0000, "center", 0, false));
        add(new FlxText(0, 70, FlxG.width, "John Watson")
            .setFormat("assets/fonts/Offside-Regular.ttf", 20, 0xff0000, "center", 0, false));

        // Invaders
        add(new InvaderGroup(130, 0, true));

        // Buttons
        var playButton = new Button(FlxG.width/2 - 50/2 - 100, 350, "assets/images/play-button.png", function() { FlxG.switchState(new GameScene()); });
        var quitButton = new Button(FlxG.width/2 - 50/2 + 100, 350, "assets/images/quit-button.png", function() { Lib.exit(); });

        // TODO Don't show button in flash || html
        add(playButton);
        add(quitButton);

        // TODO Sound on/off button
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
