echo "Do you want to export your current MongoDB database? (Y/N)"

read exportDB

if [ "$(exportDB)" == "Y"]; then
  echo "Exporting current Database..."
  echo "${purple}(this requires the Mongo development tools. If this fails install the mongo dev tools with ${blue} brew install mongodb ${purple} or your local equivalent"
  mongodump -h 127.0.0.1 --port 3001 -d meteor | bash;

echo "Do you want to import a local MongoDB database? (Y/N)"

read importDB

if [ "$(importDB)" == "Y"]; then
  echo "${purple}(this requires the Mongo development tools. If this fails install the mongo dev tools with ${blue} brew install mongodb ${purple} or your local equivalent"
  echo "What is the file path of the database you want to import? (Default is /dump)"
  read filepath
  mongorestore -h 127.0.0.1 --port 3001 $(filepath) | bash;

if tput setaf 1 &> /dev/null; then
  tput sgr0;
fi
