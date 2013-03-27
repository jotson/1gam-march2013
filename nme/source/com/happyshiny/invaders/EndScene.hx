package com.happyshiny.invaders;

import nme.Assets;
import nme.geom.Rectangle;
import nme.net.SharedObject;
import nme.events.KeyboardEvent;
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
import com.happyshiny.invaders.InvaderGroup;

class EndScene extends FlxState
{
    public var winner : String;
    public var shipsRemaining : Int;

    public override function create():Void
    {
        // Keyboard events
        Lib.current.stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);

        SoundManager.stop();
        SoundManager.play("music", 1.0);

        // Starfield
        add(new Starfield(200));

        var winText = '';
        var invaderText = '';
        if (winner == 'invaders') {
            var maxShips = 55;
            winText = 'Invaders win!';
            if (shipsRemaining <= 0) shipsRemaining = 0;
            if (shipsRemaining == 1) {
                invaderText = 'You landed a single, pathetic little ship on the planet.';
            } else {
                invaderText = 'You landed ' + shipsRemaining + ' of ' + maxShips + ' ships on the planet. ';
                if (shipsRemaining >= maxShips) {
                    invaderText += 'Perfect!';
                } else if (shipsRemaining >= 50) {
                    invaderText += 'Amazing!';
                } else if (shipsRemaining >= 40) {
                    invaderText += 'Pretty good!';
                } else if (shipsRemaining >= 30) {
                    invaderText += 'Not bad!';
                } else if (shipsRemaining >= 20) {
                    invaderText += 'So so.';
                } else if (shipsRemaining >= 10) {
                    invaderText += 'You can do better.';
                } else if (shipsRemaining > 0) {
                    invaderText += 'Seriously? Try again.';
                }
            }

            Reg.setupGroups();
            add(Reg.bombGroup);

            for(i in 0...shipsRemaining) {
                add(new Invader(Std.random(FlxG.width - 30), FlxG.height - 30, Std.random(3)+1, 'jumping'));
            }
        }

        if (winner == 'humans') {
            winText = 'Humans win!';
            invaderText = 'Better luck next time.';
            add(new Human());
        }

        // Buttons and text
        add(new Button(FlxG.width/2, 200, "assets/images/ok-button.png", startGame));

        add(new FlxText(0, 50, FlxG.width, winText)
            .setFormat("assets/fonts/Offside-Regular.ttf", 50, 0xff0000, "center", 0, false));
        add(new FlxText(0, 110, FlxG.width, invaderText)
            .setFormat("assets/fonts/Offside-Regular.ttf", 20, 0xff0000, "center", 0, false));

    }
    
    public function startGame()
    {
        Reg.clearStage();
        FlxG.switchState(new MenuScene());
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
            startGame();
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
