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
import org.flixel.FlxGroup;
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
        add(new Starfield(200));

        // Groups for collision detection
        Helper.setupGroups();
        add(Helper.bombGroup);
        add(Helper.missileGroup);
        add(Helper.blockGroup);
        add(Helper.shieldGroup);

        // Invaders
        Helper.invaderGroup = new InvaderGroup(50, 50 * 0.3, false);
        add(Helper.invaderGroup);

        // Bunkers
        createBunker(175, 400);
        createBunker(400, 400);
        createBunker(625, 400);

        // Human
        Helper.human = new Human();
        add(Helper.human);

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

        #if !android
        if (FlxG.keys.justPressed("ESCAPE"))
        {
            FlxG.switchState(new MenuScene());
        }
        #end
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

        for(yy in 0...shape.length) {
            var row = shape[yy];
            for(xx in 0...row.length) {
                if (row.charAt(xx) == '*') {
                    Helper.blockGroup.add(new Block(x + xx * Block.SIZE - Math.floor(width/2), y + yy * Block.SIZE));
                }
            }
        }
    }
}
