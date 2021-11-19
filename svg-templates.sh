#!/usr/bin/env bash

set -Eeuo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1

svgtmpdir=$(mktemp -d 2>/dev/null || mktemp -d -t 'pcgsvg')

# Replace {{ mustache }} syntax in index.html with corresponding SVGs
find ./src/_svgs -type f -name "*.svg" | while read -r svg; do
  svgname="$(basename "$svg" | cut -d . -f 1)"
  tr -d "\n\t\r" < "$svg" > "$svgtmpdir/$svgname.svg"
  contents="$(cat "$svgtmpdir/$svgname.svg")"
  find ./src/ -type f -name "*.html" | while read -r file; do
    htmlname="$(basename "$file" | cut -d . -f 1)"
    sed -i.bak "s;{{ $svgname }};$contents;g" "./public/$htmlname.html"
    if [ -f "./public/$htmlname.html.bak" ]; then rm "public/$htmlname.html.bak"; fi
  done
done

rm -rf "$svgtmpdir"
