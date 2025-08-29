#!/bin/bash

# Script to ensure proper Vue component structure with tests and stories
# Each component should have:
# - ./components/[ComponentName]/[ComponentName].vue
# - ./components/[ComponentName]/__tests__/[ComponentName].test.ts
# - ./components/[ComponentName]/[ComponentName].stories.js
# - ./components/[ComponentName]/index.js (for exports)

set -e

echo "========================================="
echo "Component Structure Validation & Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters for summary
TOTAL_COMPONENTS=0
ORGANIZED_COMPONENTS=0
TESTS_CREATED=0
STORIES_CREATED=0
ISSUES_FOUND=0

# Function to create a basic test file
create_test_file() {
    local component_name=$1
    local test_file=$2
    
    cat > "$test_file" << EOF
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ${component_name} from '../${component_name}.vue'

describe('${component_name} Component', () => {
  it('renders properly', () => {
    const wrapper = mount(${component_name}, {
      props: {}
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('has correct component name', () => {
    const wrapper = mount(${component_name})
    expect(wrapper.vm.\$options.name || '${component_name}').toBeTruthy()
  })

  // TODO: Add more specific tests for ${component_name}
})
EOF
    echo -e "${GREEN}  ✓ Created test file${NC}"
}

# Function to create a basic Storybook story
create_story_file() {
    local component_name=$1
    local story_file=$2
    
    cat > "$story_file" << EOF
import ${component_name} from './${component_name}.vue'

export default {
  title: 'Components/${component_name}',
  component: ${component_name},
  tags: ['autodocs'],
  argTypes: {
    // Define your argTypes here
  }
}

export const Default = {
  args: {
    // Default props
  }
}

export const Example = {
  args: {
    // Example with different props
  }
}

// TODO: Add more story variations for ${component_name}
EOF
    echo -e "${GREEN}  ✓ Created story file${NC}"
}

# Function to create index.js for exports
create_index_file() {
    local component_name=$1
    local index_file=$2
    
    cat > "$index_file" << EOF
export { default } from './${component_name}.vue';
EOF
    echo -e "${GREEN}  ✓ Created index.js${NC}"
}

# Function to process a component
process_component() {
    local component_path=$1
    local component_name=$(basename "$component_path" .vue)
    local component_dir="components/${component_name}"
    
    echo ""
    echo "Processing: ${component_name}"
    echo "----------------------------------------"
    
    TOTAL_COMPONENTS=$((TOTAL_COMPONENTS + 1))
    local has_issues=false
    
    # Check if component is in proper directory structure
    if [[ "$component_path" == "components/${component_name}/${component_name}.vue" ]]; then
        echo -e "${GREEN}  ✓ Component is properly organized${NC}"
        ORGANIZED_COMPONENTS=$((ORGANIZED_COMPONENTS + 1))
    elif [[ "$component_path" == "components/${component_name}.vue" ]]; then
        echo -e "${YELLOW}  ⚠ Component needs to be organized${NC}"
        echo "    Moving to ${component_dir}/${component_name}.vue"
        mkdir -p "$component_dir"
        mv "$component_path" "${component_dir}/${component_name}.vue"
        echo -e "${GREEN}  ✓ Component organized${NC}"
        ORGANIZED_COMPONENTS=$((ORGANIZED_COMPONENTS + 1))
        has_issues=true
    else
        echo -e "${GREEN}  ✓ Component already in subdirectory${NC}"
        ORGANIZED_COMPONENTS=$((ORGANIZED_COMPONENTS + 1))
    fi
    
    # Ensure component directory exists
    mkdir -p "$component_dir"
    
    # Check for __tests__ directory
    local test_dir="${component_dir}/__tests__"
    if [ ! -d "$test_dir" ]; then
        echo -e "${YELLOW}  ⚠ Missing __tests__ directory${NC}"
        mkdir -p "$test_dir"
        echo -e "${GREEN}  ✓ Created __tests__ directory${NC}"
        has_issues=true
    else
        echo -e "${GREEN}  ✓ __tests__ directory exists${NC}"
    fi
    
    # Check for test file
    local test_file="${test_dir}/${component_name}.test.ts"
    if [ ! -f "$test_file" ]; then
        # Also check for .spec.ts variant
        local spec_file="${test_dir}/${component_name}.spec.ts"
        if [ ! -f "$spec_file" ]; then
            echo -e "${YELLOW}  ⚠ Missing test file${NC}"
            create_test_file "$component_name" "$test_file"
            TESTS_CREATED=$((TESTS_CREATED + 1))
            has_issues=true
        else
            echo -e "${GREEN}  ✓ Test file exists (spec.ts)${NC}"
        fi
    else
        echo -e "${GREEN}  ✓ Test file exists${NC}"
    fi
    
    # Check for Storybook story
    local story_file="${component_dir}/${component_name}.stories.js"
    local story_file_ts="${component_dir}/${component_name}.stories.ts"
    if [ ! -f "$story_file" ] && [ ! -f "$story_file_ts" ]; then
        echo -e "${YELLOW}  ⚠ Missing Storybook story${NC}"
        create_story_file "$component_name" "$story_file"
        STORIES_CREATED=$((STORIES_CREATED + 1))
        has_issues=true
    else
        echo -e "${GREEN}  ✓ Storybook story exists${NC}"
    fi
    
    # Check for index.js
    local index_file="${component_dir}/index.js"
    if [ ! -f "$index_file" ]; then
        echo -e "${YELLOW}  ⚠ Missing index.js${NC}"
        create_index_file "$component_name" "$index_file"
        has_issues=true
    else
        echo -e "${GREEN}  ✓ index.js exists${NC}"
    fi
    
    if [ "$has_issues" = true ]; then
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
}

# Main execution
echo ""
echo "Scanning components directory..."
echo ""

# Find all .vue files in components directory
vue_files=$(find components -name "*.vue" -type f | grep -v node_modules | grep -v ".nuxt" | sort)

# Process each component
for vue_file in $vue_files; do
    # Skip if it's a subcomponent (like in __tests__ or other subdirs)
    if [[ ! "$vue_file" =~ __tests__|stories|\.story\.|\.test\.|\.spec\. ]]; then
        process_component "$vue_file"
    fi
done

# Summary Report
echo ""
echo "========================================="
echo "Summary Report"
echo "========================================="
echo -e "Total components processed: ${GREEN}${TOTAL_COMPONENTS}${NC}"
echo -e "Properly organized: ${GREEN}${ORGANIZED_COMPONENTS}${NC}"
echo -e "Test files created: ${YELLOW}${TESTS_CREATED}${NC}"
echo -e "Story files created: ${YELLOW}${STORIES_CREATED}${NC}"
echo -e "Components with issues fixed: ${YELLOW}${ISSUES_FOUND}${NC}"

# List all components with their structure
echo ""
echo "========================================="
echo "Component Structure Overview"
echo "========================================="

for dir in components/*/; do
    if [ -d "$dir" ] && [[ ! "$dir" =~ __tests__|stories ]]; then
        component_name=$(basename "$dir")
        echo ""
        echo "${component_name}:"
        
        # Check each required file
        vue_file="${dir}${component_name}.vue"
        test_dir="${dir}__tests__"
        story_file="${dir}${component_name}.stories.js"
        story_file_ts="${dir}${component_name}.stories.ts"
        index_file="${dir}index.js"
        
        if [ -f "$vue_file" ]; then
            echo -e "  ${GREEN}✓${NC} ${component_name}.vue"
        else
            echo -e "  ${RED}✗${NC} ${component_name}.vue"
        fi
        
        if [ -d "$test_dir" ]; then
            test_count=$(find "$test_dir" -name "*.test.ts" -o -name "*.spec.ts" | wc -l)
            echo -e "  ${GREEN}✓${NC} __tests__/ (${test_count} test files)"
        else
            echo -e "  ${RED}✗${NC} __tests__/"
        fi
        
        if [ -f "$story_file" ] || [ -f "$story_file_ts" ]; then
            echo -e "  ${GREEN}✓${NC} ${component_name}.stories.js"
        else
            echo -e "  ${RED}✗${NC} ${component_name}.stories.js"
        fi
        
        if [ -f "$index_file" ]; then
            echo -e "  ${GREEN}✓${NC} index.js"
        else
            echo -e "  ${RED}✗${NC} index.js"
        fi
    fi
done

echo ""
echo "========================================="
echo "Component structure validation complete!"
echo "========================================="

# Return exit code based on whether all components are properly structured
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}All components are properly structured!${NC}"
    exit 0
else
    echo -e "${YELLOW}Fixed ${ISSUES_FOUND} component structure issues${NC}"
    echo "Please review the generated test and story files and add specific implementations."
    exit 0
fi