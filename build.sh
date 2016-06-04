#!/bin/bash

rm dist/kuantokusta-chrome-extension.crx
sh .travis/crxmake.sh . .travis/cert.pem 
mv ..crx dist/kuantokusta-chrome-extension.crx
