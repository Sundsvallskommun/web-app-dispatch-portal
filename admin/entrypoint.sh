#!/bin/sh
# entrypoint.sh
# Replaces the build-time placeholders from .env-cicd with the values the pod is
# started with. The base path is not among them: Next.js resolves basePath at
# build time, so the image always serves under /admin.
replace_env_var() {
  local placeholder=$1
  local value=$2

  if [ "$value" = "__UNSET__" ]; then
    echo "Warning: ${placeholder} has no value, skipping..."
  else
    echo "Replacing ${placeholder} with ${value}..."
    find /app/.next -type f -name "*.js" -exec sed -i \
      "s|${placeholder}|${value}|g" {} +
  fi

  return 0
}

echo "Replacing runtime environment variables..."
echo "Running as user: $(id)"

replace_env_var "NEXT_PUBLIC_APP_NAME_PLACEHOLDER" "${NEXT_PUBLIC_APP_NAME:-__UNSET__}"
replace_env_var "NEXT_PUBLIC_API_URL_PLACEHOLDER" "${NEXT_PUBLIC_API_URL:-__UNSET__}"
replace_env_var "NEXT_PUBLIC_API_PATH_PLACEHOLDER" "${NEXT_PUBLIC_API_PATH:-__UNSET__}"

echo "Starting Next.js..."
exec node server.js
