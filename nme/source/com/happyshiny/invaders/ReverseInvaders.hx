package com.happyshiny.invaders;

import nme.Lib;
import nme.display.StageAlign;
import nme.display.StageScaleMode;
import nme.display.Sprite;
import nme.events.Event;
import nme.display.FPS;import nme.display.FPS;
import nme.Lib;
import org.flixel.FlxGame;
import org.flixel.system.FlxDebugger;
import org.flixel.FlxG;
import org.flixel.FlxAssets;

class ReverseInvaders extends Sprite
{
    public function new()
    {
        super();
        
        if (stage != null) 
            init();
        else 
            addEventListener(Event.ADDED_TO_STAGE, init);
    }

    private function init(?e:Event = null):Void 
    {
        if (hasEventListener(Event.ADDED_TO_STAGE))
        {
            removeEventListener(Event.ADDED_TO_STAGE, init);
        }
        
        initialize();

        addChild(new Game());

        #if !android
        FlxG.mouse.show();
        #end

        // Frame rate display
        var fps = new FPS(0, 0, 0xff0000);
        Lib.current.stage.addChild(fps);

        // FlxG.debug = true;
        // FlxG.log("Game starting");
        // FlxG._game._debugger.visible = true;
        // FlxG._game._debuggerUp = true;
    }

    private function initialize():Void 
    {
        Lib.current.stage.align = StageAlign.TOP_LEFT;
        Lib.current.stage.scaleMode = StageScaleMode.NO_SCALE;

        // Load sounds
        SoundManager.add("crash", "crash");
        SoundManager.add("explosion1", "explosion1", 10);
        SoundManager.add("explosion2", "explosion2");
        SoundManager.add("railgun", "railgun", false, 20);
        SoundManager.add("ricochet", "ricochet1");
        SoundManager.add("ricochet", "ricochet2");
        SoundManager.add("ricochet", "ricochet3");
        SoundManager.add("ricochet", "ricochet4");
        SoundManager.add("warsounds", "warsounds", true);
        SoundManager.add("artillery", "artillery", true);
        SoundManager.add("music", "music", true);
    }

    public static function main()
    {
        Lib.current.addChild(new ReverseInvaders());
    }
}

class Game extends FlxGame
{   
    public function new()
    {
        var stageWidth:Int = Lib.current.stage.stageWidth;
        var stageHeight:Int = Lib.current.stage.stageHeight;
        var ratioX:Float = stageWidth / 800;
        var ratioY:Float = stageHeight / 500;
        var ratio:Float = Math.min(ratioX, ratioY);

        super(Math.ceil(stageWidth / ratio), Math.ceil(stageHeight / ratio), MenuScene, ratio, 60, 60);
    }
}
