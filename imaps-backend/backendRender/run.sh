#!/bin/bash
IMAGE_NAME="imaps-backend"
TAG="latest"


docker rm -f imaps-backendC

if docker images "$IMAGE_NAME" | grep -q "$TAG"; then
    echo "Image $IMAGE_NAME:$TAG found, deleting..."
    docker rmi "$IMAGE_NAME:$TAG"
else
    echo "Image $IMAGE_NAME:$TAG not found."
fi


docker build -t imaps-backend .


docker run \
--name imaps-backendC \
--privileged  \
--env-file .env \
-p 8080:8080 \
-d \
imaps-backend
