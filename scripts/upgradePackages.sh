rm -rf node_modules
ncu -u --upgradeAll
npm install
plugins=$(find . -type d -name "draft-js-*")
for plugin in $plugins
do
    cd ${plugin}
    currentDirectory=$(pwd)
    echo $currentDirectory
    rm -rf node_modules
    ncu -u --upgradeAll
    cd ..
done
cd docs
rm -rf node_modules
ncu -u --upgradeAll
npm install
cd ..
