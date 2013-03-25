package com.happyshiny.invaders;

import org.flixel.system.input.FlxTouchManager;
import org.flixel.tweens.misc.ColorTween;
import org.flixel.FlxSprite;
import org.flixel.FlxPoint;
import org.flixel.FlxGroup;
import org.flixel.FlxState;
import org.flixel.FlxG;
import nme.filters.GlowFilter;
import nme.Lib;

class InvaderGroup extends FlxGroup
{
    private var leftEdge : Invader = null;
    private var rightEdge : Invader = null;
    private var bottomEdge : Invader = null;

    public var y : Float = 0;
    public var dir = 1;
    public var speed = 10;
    public var descend : Float = 0;

    public function new(y : Int, descend : Float = 50, demo : Bool = false)
    {
        super();

        Helper.invaderGroup = this;

        for(i in 0...11)
        {
            if (demo)
            {
                add(new Invader(60 + 50 * i, y, 2));
                add(new Invader(60 + 50 * i, y + 50, 1));
                add(new Invader(60 + 50 * i, y + 100, 3));
            }
            else
            {
                add(new Invader(60 + 50 * i, y, 2));
                add(new Invader(60 + 50 * i, y + 50, 1));
                add(new Invader(60 + 50 * i, y + 100, 1));
                add(new Invader(60 + 50 * i, y + 150, 3));
                add(new Invader(60 + 50 * i, y + 200, 3));
            }
        }

        this.descend = descend;
        this.y = y;

        findEdges();

        for(i in 0...length)
        {
            var invader = cast(members[i], Invader);
            if (invader.alive) invader.updateMovement(0);
        }
    }

    public override function update()
    {
        super.update();

        if (leftEdge == null || rightEdge == null || bottomEdge == null)
        {
            findEdges();
        }
        else
        {
            if (leftEdge.x <= 0 || rightEdge.x + rightEdge.width >= FlxG.width) {
                // Change direction and move down
                dir = -dir;

                if (descend != 0) speed += 5;
                for(i in 0...length)
                {
                    if (!Helper.isClass(members[i], "com.happyshiny.invaders.Invader")) continue;
                    var invader = cast(members[i], Invader);
                    if (invader.alive) invader.updateMovement(descend);
                }
            }

            if (bottomEdge.y + bottomEdge.height >= FlxG.height)
            {
                Helper.invadersWin();
            }
        }
    }

    public function findEdges()
    {
        leftEdge = null;
        rightEdge = null;
        bottomEdge = null;

        for(i in 0...length)
        {
            if (!Helper.isClass(members[i], "com.happyshiny.invaders.Invader")) continue;
            var invader = cast(members[i], Invader);
            if (invader.alive)
            {
                if (leftEdge == null || invader.x < leftEdge.x)
                {
                    leftEdge = invader;
                }
                if (rightEdge == null || invader.x > rightEdge.x)
                {
                    rightEdge = invader;
                }
                if (bottomEdge == null || invader.y > bottomEdge.y)
                {
                    bottomEdge = invader;
                }
                
            }
        }

        if (length == 0) {
            Helper.humansWin();
        }
    }
}

class Invader extends FlxSprite
{
    private var shield : Bool = false;
    private var bombTimer : Float = 0;
    private var talkTimer : Float = 0;
    private var z = 200;
    public var hasShield : Bool = false;

    public function new(x : Int, y: Int, kind : Int)
    {
        super(x, y);

        loadGraphic("assets/images/invaders.png", true, true, 50, 50);

        // addFilter(new GlowFilter(0x3399ff, 0.5, 10, 10, 0.5, 1), new FlxPoint(0, 0));

        width = 30;
        height = 30;
        centerOffsets();

        var animSpeed = Std.random(4) + 1;
        if (kind == 1)
        {
            addAnimation("default", [0,1], animSpeed, true);
        }
        if (kind == 2)
        {
            addAnimation("default", [2,3], animSpeed, true);
        }
        if (kind == 3)
        {
            addAnimation("default", [4,5], animSpeed, true);
        }

        play("default");
    }

    public override function update()
    {
        super.update();

        var dt:Float = FlxG.elapsed;
        bombTimer += dt;
        talkTimer += dt;

        if (bombTimer > 1)
        {
            bombTimer = 0;
            bomb();
        }

        if (talkTimer > 1)
        {
            talkTimer = 0;
            talk();
        }

        if (!hasShield)
        {
            var points = [];
            #if (ios || android)
            for (touch in FlxG.touchManager.touches)
            {
                if (touch.pressed())
                {
                    points.push(touch.getScreenPosition());
                }
            }
            #else
            points.push(new FlxPoint(FlxG.mouse.screenX, FlxG.mouse.screenY));
            #end
            if (points.length != 0)
            {
                for(point in points)
                {
                    if (overlapsPoint(point) && !hasShield)
                    {
                        hasShield = true;
                        var shield : Shield = cast(Helper.shieldGroup.recycle(Shield), Shield);
                        shield.parent = this;
                        shield.revive();
                    }
                }
            }
        }
    }

    public function updateMovement(y : Float)
    {
        this.y += y;
        velocity.x = Helper.invaderGroup.dir * Helper.invaderGroup.speed;
    }

    public function bomb()
    {
        if (Std.random(50) == 0) {
            var bomb = Helper.bombGroup.recycle(Bomb);
            if (bomb != null)
            {
                var bomb : Bomb = cast(bomb, Bomb);
                bomb.revive();
                bomb.x = x + this.width/2;
                bomb.y = y + this.width/2;
            }
        }
    }

    public function talk()
    {
        // TODO Talk
    }

    public override function kill()
    {
        super.kill();

        Helper.invaderGroup.findEdges();
    }
}

class Bomb extends FlxSprite
{
    private var z = 100;

    public function new()
    {
        super();

        makeGraphic(8, 8, 0xff3399ff);
        centerOffsets();
        alpha = 1;
        velocity.y = 200;
    }

    public override function update()
    {
        super.update();

        FlxG.overlap(Helper.bombGroup, Helper.blockGroup, function(bomb, block) {
            bomb.kill();
            block.kill();
        });

        FlxG.overlap(Helper.bombGroup, Helper.human, function(bomb, human) {
            bomb.kill();
            human.hurt(0);
        });

        if (y > FlxG.height)
        {
            // TODO Explosion
            kill();
        }
    }
}

class Shield extends FlxSprite
{
    public var parent : Invader = null;
    private var lifetime = 2.0; // seconds
    private var tween : ColorTween = null;
    private var z = 200;

    public function new()
    {
        super();

        loadGraphic("assets/images/shield.png", true, true, 50, 50);
        addAnimation("default", [0,1,2,3], 20, true);
        play("default");

        width = 50;
        height = 50;
    }

    public override function update()
    {
        super.update();

        if (parent != null)
        {
            x = parent.x - 10;
            y = parent.y + 15;
        }
    }

    public override function kill()
    {
        super.kill();

        parent.hasShield = false;
        parent = null;
    }

    public override function revive()
    {
        super.revive();

        update();

        alpha = 1;
        
        FlxG.tween(this, { alpha: 0.3 }, lifetime, { complete: kill });
    }
}