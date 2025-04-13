#!/bin/bash

# Generate runtime-config.js for production (dist/)
set -a
source .env.production
set +a
envsubst < public/runtime-config.template.js > dist/runtime-config.js
echo "✅ dist/runtime-config.js generated successfully."

# Generate runtime-config.js for development (public/)
set -a
source .env.development
set +a
envsubst < public/runtime-config.template.js > public/runtime-config.js
echo "✅ public/runtime-config.js generated successfully."
