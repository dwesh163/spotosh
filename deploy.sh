rsync -rlvz \
  --omit-dir-times \
  --exclude='.next' \
  --exclude='node_modules' \
  /home/duriaux/tmp/spotish/ \
  spotish@128.178.116.171:/srv/spotish
