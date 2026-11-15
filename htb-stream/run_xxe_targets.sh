#!/usr/bin/env bash
# Usage: ./run_xxe.sh targets.txt
# Reads one file path per line from the given list and runs xxe.sh on each.
# Blank lines and lines starting with # are skipped.

set -uo pipefail   # not -e: one failed read shouldn't stop the batch

LIST="${1:?usage: $0 targets.txt}"
XXE="./xxe.sh"

[ -x "${XXE}" ] || { echo "error: ${XXE} not found or not executable (run: chmod +x ${XXE})"; exit 1; }
[ -f "${LIST}" ] || { echo "error: list file '${LIST}' not found"; exit 1; }

# Read line by line; `|| [ -n "$line" ]` catches a last line with no trailing newline.
while IFS= read -r line || [ -n "$line" ]; do
  # Trim leading/trailing whitespace.
  path="$(printf '%s' "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
  # Skip blanks and comments.
  [ -z "${path}" ] && continue
  case "${path}" in \#*) continue ;; esac

  echo "========================================================================"
  echo "### ${path}"
  echo "========================================================================"
  "${XXE}" "${path}"
  echo
done < "${LIST}"
