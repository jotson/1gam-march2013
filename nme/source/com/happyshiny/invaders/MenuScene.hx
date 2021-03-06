package com.happyshiny.invaders;

import nme.Assets;
import nme.geom.Rectangle;
import nme.net.SharedObject;
import nme.Lib;
import nme.ui.Mouse;
import nme.display.BitmapData;
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
        #if (desktop || flash)
        FlxG.mouse.show();
        #end

        #if html
        var cursor:BitmapData = new BitmapData(1, 1, FlxG.TRANSPARENT);
        FlxG.mouse.show(cursor);
        FlxG.mouse.useSystemCursor = true;
        #end

        // Keyboard events
        Lib.current.stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);

        SoundManager.playMusic("warsounds", 0.5);

        // Starfield
        add(new Starfield(200));

        // Title
        add(new FlxSprite(FlxG.width/2 - 687/2, 25, "assets/images/title.png"));

        // Groups for collision detection
        Reg.setupGroups();
        add(Reg.bombGroup);
        add(Reg.missileGroup);
        add(Reg.blockGroup);
        add(Reg.shieldGroup);

        // Invaders
        Reg.invaderGroup = new InvaderGroup(160, 0, true);
        add(Reg.invaderGroup);

        // Buttons
        #if (flash || html)
        add(new Button(FlxG.width/2, 350, "assets/images/play-button.png", startGame));
        #else
        add(new Button(FlxG.width/2 - 100, 350, "assets/images/play-button.png", startGame));
        add(new Button(FlxG.width/2 + 100, 350, "assets/images/quit-button.png",
                        function() { Lib.exit(); }));
        #end
    }
    
    public function startGame()
    {
        Reg.clearStage();
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

        super.destroy();
    }

    public override function update():Void
    {
        super.update();
    }   
}
