#!/bin/sh

npm run build-linux
mkdir -p release/ezra-project.AppDir
mkdir -p release/ezra-project.AppDir/usr/lib/x86_x64-linux-gnu

cp icons/ezra-project.png release/ezra-project.AppDir
cp -a release/ezra-project-linux-x64/* release/ezra-project.AppDir
cp ezra-project.desktop release/ezra-project.AppDir/
cp build_scripts/AppRun.sh release/ezra-project.AppDir/AppRun

EZRA_DEPS=`ldd release/ezra-project.AppDir/ezra-project | awk '{ print $3 }' | grep -v -e '^$'`
NSI_DEPS=`ldd node_modules/node-sword-interface/build/Release/node_sword_interface.node | awk '{ print $3 }' | grep -v -e '^$'`

for item in "${EZRA_DEPS}"
do
    cp -L $item release/ezra-project.AppDir/usr/lib/x86_x64-linux-gnu
done

for item in "${NSI_DEPS}"
do
    cp -L $item release/ezra-project.AppDir/usr/lib/x86_x64-linux-gnu
done

wget https://github.com/AppImage/AppImageKit/releases/download/12/appimagetool-x86_64.AppImage && chmod a+x appimagetool*
ARCH=x86_64 ./appimagetool-x86_64.AppImage release/ezra-project.AppDir
