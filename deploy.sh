#!/bin/bash
echo -e "Clearing..."
# 删除 public 文件夹
rm -r public/
echo -e "Deploying..."
git add .
git status
read -p "Enter git commit message: " msg
if [ -z $msg ];then
  msg=":black_nib: update $(date +'%F %a %T')"
fi
git commit -m "$msg"
git push