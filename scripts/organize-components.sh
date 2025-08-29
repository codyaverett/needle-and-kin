#!/bin/bash

# Script to organize Vue components into their own directories

echo "Starting component organization..."


# Dynamically list all files and directories in components/
echo "Listing all files in components/:"
find components/ -maxdepth 1 -type f

echo "\nListing all directories in components/:"
find components/ -maxdepth 1 -type d

# Organize all .vue files (excluding those already in subdirectories)
for file in components/*.vue; do
  if [ -f "$file" ]; then
    component=$(basename "$file" .vue)
    echo "Organizing $component..."
    mkdir -p "components/$component"
    mv "$file" "components/$component/$component.vue"
    echo "export { default } from './$component.vue';" > "components/$component/index.js"
    echo "✓ $component organized"
  fi
done

echo "Component organization complete!"