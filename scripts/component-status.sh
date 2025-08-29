#!/bin/bash

# Quick component status checker - useful for building context
# Shows a concise overview of all components and their structure

echo "======================================"
echo "   Component Status Overview"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counters
TOTAL=0
COMPLETE=0
MISSING_TESTS=0
MISSING_STORIES=0

echo "Component Name          | Tests | Stories | Status"
echo "------------------------|-------|---------|--------"

for dir in components/*/; do
    if [ -d "$dir" ] && [[ ! "$dir" =~ __tests__|stories ]]; then
        component=$(basename "$dir")
        TOTAL=$((TOTAL + 1))
        
        # Check for required files
        has_vue=false
        has_tests=false
        has_story=false
        
        if [ -f "${dir}${component}.vue" ]; then
            has_vue=true
        fi
        
        if [ -d "${dir}__tests__" ] && [ -n "$(find "${dir}__tests__" -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null)" ]; then
            has_tests=true
        else
            MISSING_TESTS=$((MISSING_TESTS + 1))
        fi
        
        if [ -f "${dir}${component}.stories.js" ] || [ -f "${dir}${component}.stories.ts" ]; then
            has_story=true
        else
            MISSING_STORIES=$((MISSING_STORIES + 1))
        fi
        
        # Determine status
        if [ "$has_vue" = true ] && [ "$has_tests" = true ] && [ "$has_story" = true ]; then
            status="${GREEN}✓ Complete${NC}"
            COMPLETE=$((COMPLETE + 1))
        else
            status="${YELLOW}⚠ Partial${NC}"
        fi
        
        # Format output
        test_mark=$([ "$has_tests" = true ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}")
        story_mark=$([ "$has_story" = true ] && echo -e "${GREEN}✓${NC}" || echo -e "${RED}✗${NC}")
        
        printf "%-23s | %b     | %b       | %b\n" "$component" "$test_mark" "$story_mark" "$status"
    fi
done

echo ""
echo "======================================"
echo "Summary:"
echo "======================================"
echo -e "Total Components: ${TOTAL}"
echo -e "Complete: ${GREEN}${COMPLETE}${NC}"
echo -e "Missing Tests: ${YELLOW}${MISSING_TESTS}${NC}"
echo -e "Missing Stories: ${YELLOW}${MISSING_STORIES}${NC}"
echo ""

# Quick recommendations
if [ $MISSING_TESTS -gt 0 ] || [ $MISSING_STORIES -gt 0 ]; then
    echo "To fix missing files, run:"
    echo "  ./scripts/ensure-component-structure.sh"
fi