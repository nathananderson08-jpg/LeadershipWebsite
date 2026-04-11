#!/bin/bash

# Fetch the latest from origin
git fetch origin master

# Try to merge master into the current branch
git merge origin/master --no-edit || echo "Conflicts detected - listing them below:"

# Show any conflicts
git diff --name-only --diff-filter=U
