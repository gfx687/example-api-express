timestamp_prefix=$(date -u +"%Y%m%d%H%M%S")

cat scripts/migration_template.ts > src/migrations/${timestamp_prefix}_rename_me.ts

echo "New migration src/migrations/${timestamp_prefix}_rename_me.ts created."
