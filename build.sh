#!/bin/sh

ROOT=/home/john/code/OneGameAMonth/2013/03-mar
BUILD=$ROOT/build
JS=$ROOT/js
NME=$ROOT/nme
WWW=/var/www/flagrantdisregard.com/invaders
VERSION=`git log --oneline | head -1 | awk '{ print $1 }'`
DEBUG='-debug'

if [ -n "$1" ]; then
    MODE="$1"
else
    MODE="flash"
fi


if [ "$MODE" = "flash" ]; then
    echo "Building Flash target"
    nme test $NME/project.nmml flash $DEBUG
    
    echo "Building HTML"
    if [ -e $BUILD ]; then
        rm -r $BUILD
    fi
    mkdir -p $BUILD

    sed "s/{VERSION}/$VERSION/g" $ROOT/index.html >$BUILD/index.html
    rsync -az $ROOT/js/ $BUILD/
    cp $NME/build/flash/bin/* $BUILD

    echo "Copying HTML build to destination"
    rsync -az --delete $BUILD/ $WWW

    SIZE=`du -sh $BUILD/*.swf | awk '{ print $1 }'`
    echo "Flash file size: $SIZE"
fi

if [ "$MODE" = "linux" ]; then
    echo "Building Linux target"
    nme test $NME/project.nmml linux $DEBUG
fi

if [ "$MODE" = "android" ]; then
    echo "Building Android target"
    nme test $NME/project.nmml android $DEBUG
fi

echo "Done"
