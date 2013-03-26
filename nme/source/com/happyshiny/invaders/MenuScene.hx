package com.happyshiny.invaders;

import nme.Assets;
import nme.geom.Rectangle;
import nme.net.SharedObject;
import nme.Lib;
import nme.ui.Mouse;
import nme.events.KeyboardEvent;
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
    public override function create():Void
    {
        
        // Keyboard events
        Lib.current.stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);

        FlxG.destroySounds(true);
        Reg.play("assets/music/artillery.mp3", 1.0, true);
        // Reg.play("assets/music/war-sounds.mp3", 0.5, true);

        // Starfield
        add(new Starfield(200));

        // Titles
        // TODO Graphic titles
        add(new FlxText(0, 10, FlxG.width, "Reverse Invaders")
            .setFormat("assets/fonts/Offside-Regular.ttf", 50, 0xff0000, "center", 0, false));
        add(new FlxText(0, 70, FlxG.width, "John Watson")
            .setFormat("assets/fonts/Offside-Regular.ttf", 20, 0xff0000, "center", 0, false));

        // Groups for collision detection
        Reg.setupGroups();
        add(Reg.bombGroup);
        add(Reg.missileGroup);
        add(Reg.blockGroup);
        add(Reg.shieldGroup);

        // Invaders
        Reg.invaderGroup = new InvaderGroup(130, 0, true);
        add(Reg.invaderGroup);

        // Buttons
        #if (flash || html)
        add(new Button(FlxG.width/2, 350, "assets/images/play-button.png", startGame));
        #else
        add(new Button(FlxG.width/2 - 100, 350, "assets/images/play-button.png", startGame));
        add(new Button(FlxG.width/2 + 100, 350, "assets/images/quit-button.png",
                        function() { Lib.exit(); }));
        #end
        
        // TODO Sound on/off button
    }
    
    public function startGame()
    {
        FlxG.switchState(new GameScene());
    }

    public function onKeyUp(e : KeyboardEvent):Void
    {
        // Space bar
        if (e.keyCode == 32)
        {
            startGame();
        }

        // Escape key (also Android back button)
        if (e.keyCode == 27)
        {
            Lib.exit();
        }
    }

    public override function destroy():Void
    {
        Lib.current.stage.removeEventListener(KeyboardEvent.KEY_UP, onKeyUp);
        kill();

        super.destroy();
    }

    public override function update():Void
    {
        super.update();
    }   
}
