#!/bin/bash

if [ $TRAVIS_PULL_REQUEST == "false" ] && [ $TRAVIS_BRANCH == "dev" ]; then
  mkdir nightly
  cp dist/kuantokusta.chrome.zip "nightly/kuantokusta.$(date +%Y-%m-%d).chrome.zip"
  cp dist/kuantokusta.chrome.crx "nightly/kuantokusta.$(date +%Y-%m-%d).chrome.crx"
  cp dist/kuantokusta.chrome.zip nightly/kuantokusta.latest.chrome.zip
  cp dist/kuantokusta.chrome.crx nightly/kuantokusta.latest.chrome.crx
  sshpass -p ${DEPLOY_PASS} scp -r nightly/ ${DEPLOY_USER}@build.kuantokusta.com:html/ 
fi
