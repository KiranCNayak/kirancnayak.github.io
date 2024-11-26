+++
date = '{{ time.Now.Format "2006-01-02 15:04:05 MST" }}'
draft = false
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
+++
