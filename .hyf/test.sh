#!/usr/bin/env bash
set -euo pipefail

# Auto grade tool will execute this file within the .hyf working directory.
# The result should be stored in score.json file with the format shown below.

# Ensure task-1 dependencies are installed
cd ../task-1 && npm install --silent 2>/dev/null && cd - > /dev/null

# Run the TypeScript error counter
TSC_OUTPUT=$(node tsc-error-count.js)

ERROR_COUNT=$(echo "$TSC_OUTPUT" | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf-8'));
  console.log(d.errorCount);
")
TS_FILE_COUNT=$(echo "$TSC_OUTPUT" | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf-8'));
  console.log(d.tsFileCount);
")
TOTAL_EXPECTED=$(echo "$TSC_OUTPUT" | node -e "
  const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf-8'));
  console.log(d.totalExpectedFiles);
")

# Compute score using node for math
SCORE=$(node -e "
  const errorCount = ${ERROR_COUNT};
  const tsFileCount = ${TS_FILE_COUNT};
  const totalExpected = ${TOTAL_EXPECTED};
  const MAX_ERRORS = 50;

  if (tsFileCount === 0) {
    console.log(0);
  } else {
    const conversionRatio = tsFileCount / totalExpected;
    const errorPenalty = Math.max(0, 1 - errorCount / MAX_ERRORS);
    const score = Math.round(conversionRatio * 100 * errorPenalty);
    console.log(score);
  }
")

PASS=$([ "$SCORE" -ge 50 ] && echo "true" || echo "false")

cat << EOF > score.json
{
  "score": ${SCORE},
  "pass": ${PASS},
  "passingScore": 50
}
EOF

echo "TSC errors: ${ERROR_COUNT}, TS files: ${TS_FILE_COUNT}/${TOTAL_EXPECTED}, Score: ${SCORE}"
