#!/bin/sh

# Replace {{ mustache }} syntax in index.html with corresponding SVGs
find src/_svgs -type f -name "*.svg" | while read -r file; do
  name="$(basename "$file" | cut -d . -f 1)"
  contents="$(cat "$file")"
  sed -i.bak "s;{{ $name }};$contents;g" public/index.html
  rm public/index.html.bak
done
