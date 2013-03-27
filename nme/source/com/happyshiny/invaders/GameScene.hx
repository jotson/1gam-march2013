package com.happyshiny.invaders;

import nme.Assets;
import nme.geom.Rectangle;
import nme.net.SharedObject;
import nme.events.KeyboardEvent;
import nme.Lib;
import org.flixel.FlxButton;
import org.flixel.FlxG;
import org.flixel.FlxPath;
import org.flixel.FlxSave;
import org.flixel.FlxSprite;
import org.flixel.FlxGroup;
import org.flixel.FlxState;
import org.flixel.FlxText;
import org.flixel.FlxU;

class GameScene extends FlxState
{
    public static var gameOver : Bool = false;

    public override function create():Void
    {
        GameScene.gameOver = false;

        // Keyboard events
        Lib.current.stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);

        SoundManager.stop();
        SoundManager.play("warsounds", 0.5);

        // Starfield
        add(new Starfield(200));

        // Groups for collision detection
        Reg.setupGroups();
        add(Reg.bombGroup);
        add(Reg.missileGroup);
        add(Reg.blockGroup);
        add(Reg.shieldGroup);

        // Invaders
        Reg.invaderGroup = new InvaderGroup(50, 50 * 0.3, false);
        add(Reg.invaderGroup);

        // Bunkers
        createBunker(Math.floor(FlxG.width/2) - 200, 400);
        createBunker(Math.floor(FlxG.width/2), 400);
        createBunker(Math.floor(FlxG.width/2) + 200, 400);

        // Human
        Reg.human = new Human();
        add(Reg.human);

        // TODO Pause/play button
        // TODO Sound on/off button
        // TODO Return to menu button
        // TODO Android: Override back button
    }
    
    public function onKeyUp(e : KeyboardEvent):Void
    {
        // Escape key is also Android back button
        if (e.keyCode == 27)
        {
            e.stopImmediatePropagation();
            
            Reg.clearStage();
            FlxG.switchState(new MenuScene());
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

    public function createBunker(x : Int, y: Int):Void
    {
        var shape = [
            '  **',
            ' ****',
            '******',
            '******',
            '**  **',
        ];

        var height = shape.length * Block.SIZE;
        var width = 0;
        for(yy in 0...shape.length) {
            width = Math.ceil(Math.max(width, shape[yy].length * Block.SIZE));
        }

        for(yy in 0...shape.length)
        {
            var row = shape[yy];
            for(xx in 0...row.length)
            {
                if (row.charAt(xx) == '*')
                {
                    Reg.blockGroup.add(new Block(x + xx * Block.SIZE - width/2, y + yy * Block.SIZE));
                }
            }
        }
    }

    public static function endGame(winner : String, ships : Int)
    {
        if (GameScene.gameOver) return;

        GameScene.gameOver = true;
        Reg.clearStage();
        var scene = new EndScene();
        scene.winner = winner;
        scene.shipsRemaining = ships;
        FlxG.switchState(scene);
    }
}
