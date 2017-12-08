#!/usr/bin/env bash
#
declare RAMDSK="/dev/shm";
declare EXCL="${RAMDSK}/rsyncExcludes.txt";
declare BASE="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
declare BASE_NAME=$(basename ${BASE});

cat << EOF > ${EXCL}
.meteor/local
node_modules
EOF

echo rsync -aP --exclude-from=${EXCL} ${BASE} ${RAMDSK}
rsync -aP --exclude-from=${EXCL} ${BASE} ${RAMDSK}

# rm -fr ./node_modules;
# rm -fr ./.meteor/local;
# rm -fr ./.meteor/versions;
# rm -fr package-lock.json;

meteor reset;

meteor npm install;

# # meteor npm run debug;
echo -e "Starting Meteor on port 3030 ... in : ${BASE_NAME}";
meteor npm start;
