#!/usr/bin/env bash
# Encrypt plain-text notes into .camo files Camo Note can open.
# Usage: scripts/encrypt-notes.sh note.txt other.txt
#        scripts/encrypt-notes.sh ~/Notes
# A .txt file "myNote.txt" becomes "myNote.camo" beside it.
# .rtf is encrypted as-is, so open it in Camo Note only if you want the RTF source.

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: scripts/encrypt-notes.sh <file-or-folder>..." >&2
  exit 1
fi

files=()
while IFS= read -r -d '' path; do
  files+=("$path")
done < <(
  find "$@" -type f ! -name '*.camo' ! -name '.*' -print0
)

if [[ ${#files[@]} -eq 0 ]]; then
  echo "No files found." >&2
  exit 1
fi

read -r -s -p "Passcode: " pass
echo
read -r -s -p "Confirm: " confirm
echo
if [[ -z "$pass" || "$pass" != "$confirm" ]]; then
  echo "Passcodes did not match." >&2
  exit 1
fi

for file in "${files[@]}"; do
  base="${file%.*}"
  if [[ "$base" == "$file" ]]; then
    out="${file}.camo"
  else
    out="${base}.camo"
  fi
  printf '%s\n' "$pass" | openssl enc -aes-256-cbc -pbkdf2 -iter 10000 -md sha256 \
    -in "$file" -out "$out" -pass stdin
  echo "$out"
done
