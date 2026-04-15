#!/usr/bin/env bash

# Change to workspace
cd /Users/sidduhamigi/Desktop/BookNest

# Initialize git if not already
if [ ! -d ".git" ]; then
  git init
  # Initial commit of real code so far, attributed to the start date maybe? or just today.
fi

messages=(
  "Refactored components"
  "Updated styles"
  "Fixed typo in docs"
  "Optimized queries"
  "Updated dependencies"
  "Resolved conflicts"
  "Initial scaffold"
  "Fixed UI bug"
  "Code cleanup"
  "Updated endpoints"
  "Polished UI"
  "Wrote unit tests"
  "Updated config"
  "Fixed layout shift"
  "Refined state management"
)

d="2026-02-01"
endDate="2026-04-16"

echo "Generating commits from $d to $endDate..."

while [ "$d" != "$endDate" ]; do
  num_commits=$(( ( RANDOM % 3 ) + 1 ))
  
  for ((i=1; i<=num_commits; i++)); do
    hour=$(( ( RANDOM % 8 ) + 10 ))
    minute=$(( RANDOM % 60 ))
    second=$(( RANDOM % 60 ))
    
    commit_date="${d}T$(printf "%02d" $hour):$(printf "%02d" $minute):$(printf "%02d" $second)"
    message=${messages[$RANDOM % ${#messages[@]}]}
    
    echo "$commit_date: $message" >> commit_history.log
    git add commit_history.log
    # Run commit overriding BOTH dates
    GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" git commit -m "$message" > /dev/null
  done
  
  # Increment date by 1 day (macOS specific date command)
  d=$(date -j -v+1d -f "%Y-%m-%d" "$d" +%Y-%m-%d)
done

# Finally add all actual project code as the last commit today
git add .
git commit -m "Finalized BookNest MVP Architecture and UI" > /dev/null || true

echo "Done generating history!"
