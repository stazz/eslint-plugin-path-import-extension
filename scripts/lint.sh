#!/bin/sh

. 'scripts/preamble.sh'

LR_LINT_MODE="$1"
if [ "${LR_LINT_MODE}" = "run" ] || [ "${LR_LINT_MODE}" = "ci" ]; then
  if [ "$#" -gt 0 ]; then
    shift
  fi
else
  LR_LINT_MODE='run'
fi

yarn run "lint:${LR_LINT_MODE}"
