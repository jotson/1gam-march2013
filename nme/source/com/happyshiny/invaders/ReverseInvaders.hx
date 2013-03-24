package com.happyshiny.invaders;

import nme.Lib;
import nme.display.StageAlign;
import nme.display.StageScaleMode;
import nme.display.Sprite;
import nme.events.Event;
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

        // FlxG.debug = true;
        // FlxG.log("Game starting");
        // FlxG._game._debugger.visible = true;
        // FlxG._game._debuggerUp = true;
    }

    private function initialize():Void 
    {
        Lib.current.stage.align = StageAlign.TOP_LEFT;
        Lib.current.stage.scaleMode = StageScaleMode.NO_SCALE;
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
