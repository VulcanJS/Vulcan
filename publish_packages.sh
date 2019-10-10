for d in packages/vulcan-* ; do
  echo "$d"
  cd $d
  meteor publish
  cd ../../
done