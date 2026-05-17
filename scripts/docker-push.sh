#!/usr/bin/env bash
# Build both images and push to DockerHub
# Usage: ./scripts/docker-push.sh <dockerhub-username> [tag]
#
# Example:
#   ./scripts/docker-push.sh myusername latest
#   ./scripts/docker-push.sh myusername v1.0.0

set -euo pipefail

DOCKERHUB_USERNAME="${1:?Usage: $0 <dockerhub-username> [tag]}"
TAG="${2:-latest}"

BACKEND_IMAGE="$DOCKERHUB_USERNAME/agriai-backend:$TAG"
FRONTEND_IMAGE="$DOCKERHUB_USERNAME/agriai-frontend:$TAG"

echo "==> Building backend: $BACKEND_IMAGE"
docker build -t "$BACKEND_IMAGE" ./agriai-backend

echo "==> Building frontend: $FRONTEND_IMAGE"
docker build -t "$FRONTEND_IMAGE" ./agriai-frontend

echo "==> Logging in to DockerHub"
docker login

echo "==> Pushing $BACKEND_IMAGE"
docker push "$BACKEND_IMAGE"

echo "==> Pushing $FRONTEND_IMAGE"
docker push "$FRONTEND_IMAGE"

echo ""
echo "Done. Images pushed:"
echo "  $BACKEND_IMAGE"
echo "  $FRONTEND_IMAGE"
