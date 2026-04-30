#!/bin/sh
set -e

# Use PORT env var or default to 3000
PORT=${PORT:-3000}

# Replace PORT placeholder in nginx config
sed -i "s/\${PORT}/$PORT/g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
