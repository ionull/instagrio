#!/bin/bash

rm -rf build
mkdir build
mkdir build/vendors
cp -r app build
cp *.json build
cp -r style* build
cp -r images build
cp icon* build
cp *.html build
cp vendors/emoji.js/emoji.js build/vendors
cp vendors/emoji.js/emoji-list-with-image.js build/vendors
cp vendors/emoji.js/vendor/punycode/punycode.min.js build/vendors
cp vendors.build/* build/vendors
palm-package build
rm -rf build
