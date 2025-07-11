#!/bin/bash
echo "Injecting environment variables into env.js..."
envsubst < env.template.js > env.js
