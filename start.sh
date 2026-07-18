#!/bin/bash
set -euo pipefail

# start.sh
# Usage:
#   ./start.sh dev        # development mode (server:dev + client)
#   ./start.sh prod       # production mode (server + client)
#   ./start.sh dev --port 3005
#
# PORT priority:
#   1) --port <port>
#   2) $PORT from environment
#   3) 3005 (server/index.js default)

MODE="dev"
PORT_OVERRIDE=""

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    dev|prod)
      MODE="$1"
      shift
      ;;
    --port)
      PORT_OVERRIDE="${2:-}"
      if [[ -z "${PORT_OVERRIDE}" ]]; then
        echo "Error: --port requires a value" >&2
        exit 1
      fi
      shift 2
      ;;
    -h|--help)
      echo "Usage: ./start.sh [dev|prod] [--port PORT]";
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: ./start.sh [dev|prod] [--port PORT]" >&2
      exit 1
      ;;
  esac
done

PORT="${PORT_OVERRIDE:-${PORT:-3005}}"

if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
  echo "Error: PORT must be a number, got '$PORT'" >&2
  exit 1
fi

if command -v lsof >/dev/null 2>&1; then
  PIDS="$(lsof -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null || true)"
else
  echo "Error: lsof is required but not found in PATH." >&2
  exit 1
fi

if [[ -n "$PIDS" ]]; then
  echo "Port $PORT is already in use. Killing process(es): $PIDS"
  # shellcheck disable=SC2086
  kill -9 $PIDS || true
else
  echo "Port $PORT is free."
fi

echo "Starting in mode: $MODE (PORT=$PORT)"

# Start server + client in one terminal using concurrently
# - server side uses root scripts
# - client uses npm script inside ./client
if [[ "$MODE" == "prod" ]]; then
  SERVER_CMD="PORT=$PORT npm run server --silent"
else
  SERVER_CMD="PORT=$PORT npm run server:dev --silent"
fi

CLIENT_CMD="npm run client --silent"

# Keep PORT in env for both commands
# Prefer local (node_modules/.bin) concurrently; fall back to global if available
CONCURRENTLY_BIN="./node_modules/.bin/concurrently"
if [[ -x "$CONCURRENTLY_BIN" ]]; then
  "$CONCURRENTLY_BIN" -k "$SERVER_CMD" "$CLIENT_CMD"
else
  concurrently -k "$SERVER_CMD" "$CLIENT_CMD"
fi


