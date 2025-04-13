#!/bin/bash
set -a
source .env.production
set +a

envsubst < public/runtime-config.template.js > dist/runtime-config.js
envsubst < public/runtime-config.template.js > public/runtime-config.js

echo "✅ runtime-config.js generated successfully."
