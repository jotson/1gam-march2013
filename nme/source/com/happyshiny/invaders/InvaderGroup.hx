package com.happyshiny.invaders;

import com.happyshiny.invaders.Particles;
import org.flixel.system.input.FlxTouchManager;
import org.flixel.FlxSprite;
import org.flixel.FlxPoint;
import org.flixel.FlxGroup;
import org.flixel.FlxState;
import org.flixel.FlxG;
import org.flixel.tweens.util.Ease;
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

        Reg.invaderGroup = this;

        var xOffset = Math.floor(FlxG.width/2 - (50*11)/2);
        
        for(i in 0...11)
        {
            if (demo)
            {
                add(new Invader(xOffset + 50 * i, y, 2, 'demo'));
                add(new Invader(xOffset + 50 * i, y + 50, 1, 'demo'));
                add(new Invader(xOffset + 50 * i, y + 100, 3, 'demo'));
            }
            else
            {
                add(new Invader(xOffset + 50 * i, y, 2));
                add(new Invader(xOffset + 50 * i, y + 50, 1));
                add(new Invader(xOffset + 50 * i, y + 100, 1));
                add(new Invader(xOffset + 50 * i, y + 150, 3));
                add(new Invader(xOffset + 50 * i, y + 200, 3));
            }
        }

        this.descend = descend;
        this.y = y;

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

        if (leftEdge != null && rightEdge != null && bottomEdge != null)
        {
            if (bottomEdge.y + bottomEdge.height >= FlxG.height)
            {
                GameScene.endGame("invaders", countLiving());
                return;
            }

            if (leftEdge.x <= 0 || rightEdge.x + rightEdge.width >= FlxG.width)
            {
                // Change direction and move down
                dir = -dir;

                if (descend != 0) speed += 5;
                for(i in 0...length)
                {
                    if (!Reg.isClass(members[i], "com.happyshiny.invaders.Invader")) continue;
                    var invader = cast(members[i], Invader);
                    if (invader.alive) invader.updateMovement(descend);
                }
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
            if (!Reg.isClass(members[i], "com.happyshiny.invaders.Invader")) continue;
            var invader = cast(members[i], Invader);
            if (invader.alive && invader.mode != 'crashing')
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

        if (length > 0 && countLiving() <= 0) {
            GameScene.endGame('humans', countLiving());
        }
    }
}

class Invader extends FlxSprite
{
    private var shield : Bool = false;
    private var bombTimer : Float = 0;
    private var talkTimer : Float = 0;
    private var jumpTimer : Float = 0;
    public var kind : Int = 1;
    public var mode : String = 'normal';
    public var hasShield : Bool = false;
    public var smoke : Smoke = null;

    public function new(x : Int, y: Int, kind : Int, mode : String = 'normal')
    {
        super(x, y);

        loadGraphic("assets/images/invaders.png", true, true, 50, 50);

        // addFilter(new GlowFilter(0x3399ff, 0.5, 10, 10, 0.5, 1), new FlxPoint(0, 0));
        
        this.mode = mode;

        width = 30;
        height = 30;
        centerOffsets();

        this.kind = kind;
        var animSpeed = Std.random(4) + 1;
        addAnimation("default1", [0,1], animSpeed, true);
        addAnimation("default2", [2,3], animSpeed, true);
        addAnimation("default3", [4,5], animSpeed, true);

        play("default" + kind);
    }

    public override function update()
    {
        super.update();

        if (mode == 'crashing')
        {
            alpha = Math.random();

            if (y > FlxG.height * 2)
            {
                kill();
            }

            if (smoke != null)
            {
                smoke.at(this);
            }
        }
        else
        {
            var dt:Float = FlxG.elapsed;
            bombTimer += dt;
            talkTimer += dt;
            jumpTimer -= dt;

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

            if (mode == 'jumping')
            {
                if (jumpTimer < 0)
                {
                    jump();
                }

                if (y + height > FlxG.height)
                {
                    y = FlxG.height - height;
                    velocity.y = 0;
                }

                if (x + width > FlxG.width)
                {
                    x = FlxG.width - width - 1;
                    velocity.x = -velocity.x;
                }

                if (x < 0)
                {
                    x = 1;
                    velocity.x = -velocity.x;
                }
            }

            // Collisions
            if (mode == 'normal')
            {
                // TODO This is killing performance!
                // FlxG.overlap(Reg.invaderGroup, Reg.blockGroup, function(invader, block) {
                //     block.kill();
                // });

                // FlxG.overlap(Reg.invaderGroup, Reg.human, function(bomb, human) {
                //     var explosion = cast(FlxG.state.recycle(HumanExplosion), HumanExplosion);
                //     explosion.goBoom(human);

                //     human.kill();

                //     GameScene.endGame('invaders', countLiving());
                // });
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
                            var shield : Shield = cast(Reg.shieldGroup.recycle(Shield), Shield);
                            shield.parent = this;
                            shield.revive();
                        }
                    }
                }
            }
        }

    }

    public function updateMovement(y : Float)
    {
        if (mode == 'normal')
        {
            this.y += y;
            velocity.x = Reg.invaderGroup.dir * Reg.invaderGroup.speed;
        }
    }

    public function bomb()
    {
        if (Std.random(50) == 0) {
            var bomb = Reg.bombGroup.recycle(Bomb);
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
        if (smoke != null) smoke.kill();

        if (mode == 'normal')
        {
            SoundManager.play("crash");
            mode = 'crashing';
            acceleration.y = 500;
            velocity.y = -150;
            angularVelocity = Std.random(720)-360;

            smoke = cast(FlxG.state.recycle(Smoke), Smoke);
            smoke.start(false, 1, 0.05);
            FlxG.state.add(smoke);

            Reg.invaderGroup.remove(this);
            FlxG.state.add(this);

            Reg.invaderGroup.findEdges();
        }
        else if (mode == 'crashing')
        {
            mode = 'dead';
            super.kill();
        }
        else
        {
            mode = 'dead';
            super.kill();
        }
    }

    public override function revive()
    {
        super.revive();
        acceleration.y = 0;
        angularVelocity = 0;
        drag = null;
        smoke = null;
    }

    public function jump()
    {
        jumpTimer = Math.random() * 2 + 1;

        if (Reg.invaderGroup != null) return;
        if (y < FlxG.height - height) return;

        y = FlxG.height - height - 1;
        velocity.x = Std.random(400) - 200;
        velocity.y = -500;
        acceleration.y = 500;
        drag = new FlxPoint(40, 0);
    }
}

class Bomb extends FlxSprite
{
    public function new()
    {
        super();

        makeGraphic(8, 8, 0xff3399ff);
        centerOffsets();
        alpha = 1;
        velocity.y = 200;
        acceleration.y = 300;
    }

    public override function revive()
    {
        super.revive();

        velocity.y = 200;
        alpha = 1;
    }

    public override function update()
    {
        super.update();

        // Collisions
        FlxG.overlap(Reg.bombGroup, Reg.blockGroup, function(bomb, block) {
            var explosion = cast(FlxG.state.recycle(BlockExplosion), BlockExplosion);
            explosion.goBoom(block);

            bomb.kill();
            block.kill();
        });

        FlxG.overlap(Reg.bombGroup, Reg.human, function(bomb, human) {
            var explosion = cast(FlxG.state.recycle(HumanExplosion), HumanExplosion);
            explosion.goBoom(human);

            bomb.kill();
            human.hurt(0);
        });

        if (y > FlxG.height)
        {
            var explosion = cast(FlxG.state.recycle(BombExplosion), BombExplosion);
            explosion.goBoom(this);
            kill();
        }
    }
}

class Shield extends FlxSprite
{
    public var parent : Invader = null;
    private var lifetime = 2.0; // seconds

    public function new()
    {
        super();

        loadGraphic("assets/images/shield.png", true, true, 50, 50);
        addAnimation("default", [0,1,2,3], 20, true);
        play("default");

        width = 50;
        height = 5;
        centerOffsets();
    }

    public override function update()
    {
        super.update();

        if (parent != null)
        {
            x = parent.x - 10;
            y = parent.y + 35;
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
        
        FlxG.tween(this, { alpha: 0.3 }, lifetime, { ease: Ease.bounceOut, complete: kill });
    }
}
