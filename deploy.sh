#!/bin/bash
echo -e "Deploying..."
# 删除资源文件下生成
rm -f ./resources/*
git add .
git status
read -p "Enter git commit message: " msg
if [ -z $msg ];then
  msg=":black_nib: update $(date +'%F %a %T')"
fi
git commit -m "$msg"
git push