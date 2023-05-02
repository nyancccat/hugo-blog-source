#!/bin/bash
echo -e "Deploying..."
git add .
git status
read -p "Enter git commit message: " msg
if [ -z $msg ];then
  msg=":black_nib: update $(date +'%F %a %T')"
fi
git commit -m "$msg"
git push