#!/usr/bin/env bash

if tput setaf 1 &> /dev/null; then
  purple=$(tput setaf 141)
  blue=$(tput setaf 153)
  bold=$(tput bold)
  reset=$(tput sgr0)
else 
  purple=""
  blue=""
  bold=""
  reset=""
fi

test -f settings.json || (echo "🛠  ${blue}Creating your own settings.json file...\n"; cp sample_settings.json settings.json;)

echo "🔭  ${bold}${purple}Happy hacking with Telescope Nova!${reset}"; 

echo "📖  ${blue}The docs are available at: ${purple}http://nova-docs.telescopeapp.org";

if tput setaf 1 &> /dev/null; then
  tput sgr0;
fi
