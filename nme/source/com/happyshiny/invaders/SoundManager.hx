package com.happyshiny.invaders;

import nme.events.Event;
import nme.media.Sound;
import nme.media.SoundTransform;
import org.flixel.FlxG;
import org.flixel.FlxSound;

class SoundManager {
    public static var varmap : Hash<VariationMap>;

    public static function add(id : String, embeddedSound : String, loop : Bool = false, channels : Int = 0) : Void
    {
        if (varmap == null)
        {
            varmap = new Hash<VariationMap>();
        }

        var m : VariationMap;
        if (varmap.exists(id)) {
            m = varmap.get(id);
        }
        else
        {
            m = new VariationMap();
        }
        m.add(embeddedSound, loop, channels);
        varmap.set(id, m);
    }

    public static function play(id : String, volume : Float = 1.0) {
        if (FlxG.mute) return;

        if (!varmap.exists(id)) return;

        var s = varmap.get(id);
        var sound = s.get();
        sound.volume = volume;
        sound.play();
    }

    public static function onSoundComplete(e)
    {
        trace("Sound complete");
        trace(e);
    } 

    /**
     * Stop a sound or all sounds
     * @param  id :             String sound id
     * @return
     */
    public static function stop(id : String = null) : Void
    {
        // TODO Stop sounds
    }
    
}

class VariationMap {
    public static var MAX_CHANNELS = 5;

    public var volume : Float = 1.0;
    public var channel : Int = -1;
    public var sounds : Hash<Array<MySound>>;

    public function new()
    {
        sounds = new Hash<Array<MySound>>();
    }

    public function add(embeddedSound : String, loop : Bool, channels : Int = 0)
    {
        // Add MAX_CHANNELS instances of each embeddedSound
        var s : Array<MySound> = new Array<MySound>();
        if (channels == 0) channels = MAX_CHANNELS;
        if (loop) channels = 1;
        for(i in 0...channels)
        {
            var sound = new MySound();
            sound.loadEmbedded(embeddedSound, loop);
            s.push(sound);
        }
        sounds.set(embeddedSound, s);
    }

    public function get() : MySound
    {
        // Pick a random variation
        var keys = new Array();
        for(id in sounds.keys())
        {
            keys.push(id);
        }
        var key = keys[Std.random(keys.length)];

        // Get the next channel
        var s = sounds.get(key);
        channel++;
        if (channel >= s.length) channel = 0;

        return s[channel];
    }
}

class MySound extends FlxSound
{
    var id = "";
    public override function loadEmbedded(EmbeddedSound:Dynamic, Looped:Bool = false, AutoDestroy:Bool = false):FlxSound
    {
        id = EmbeddedSound;
        return cast(super.loadEmbedded(EmbeddedSound, Looped, AutoDestroy), FlxSound);
    }

    public override function play(ForceRestart:Bool = false):Void
    {
        // The _channel = null and _channel.stop() calls in FlxSound.cleanup()
        // kill sounds in SDL so, set ForceRestart to false.
        super.play(false);
    }

    override private function startSound(Position:Float):Void
    {
        // FlxSound.play() is buggy with respect to looping MP3s on SDL
        // It tries to loop 9999 times which, in SDL, causes a segmentation fault.
        // So, I'm overriding the looping behaviour by adding en event listener to
        // the sound to just start playing again when it stops.
        // The stopped() event handler already has functionality to restart the sounds
        // so I can only guess that setting loops to 9999 helped with something...
        // maybe gapless looping.
        // if (_looped) trace("   Start Sound " + id + "_" + _looped + " " + _sound.length);
        // if (_looped) return;
        _position = Position;
        _paused = false;
        _channel = _sound.play(_position, 0, _transform); // was (_position, numLoops, _transform)
        if (_channel != null)
        {
            if (_channel.hasEventListener(Event.SOUND_COMPLETE))
            {
                _channel.removeEventListener(Event.SOUND_COMPLETE, stopped);
            }
            _channel.addEventListener(Event.SOUND_COMPLETE, stopped);
            active = true;
        }
        else
        {
            exists = false;
            active = false;
        }
    }

    override private function stopped(event:Event = null):Void
    {
        // if (_looped) trace("Stopped " + id);
        super.stopped(event);
    }
}
