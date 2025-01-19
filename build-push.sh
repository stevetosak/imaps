arg=${1}

case $arg in
	a)
		echo "Building and pushing all images..."
		docker build -t stevetosak/imaps-frontend:latest imaps-frontend/
		docker build -t stevetosak/imaps-backend:latest imaps-backend/backendRender/
		docker push stevetosak/imaps-frontend:latest
		docker push stevetosak/imaps-backend:latest
		;;
	f)
		echo "Building and pushing frontend image..."
		docker build -t stevetosak/imaps-frontend:latest imaps-frontend/
		docker push stevetosak/imaps-frontend:latest
		;;
	b)
		echo "Building and pushing backend image..."
		docker build -t stevetosak/imaps-backend:latest imaps-backend/backendRender/
		docker push stevetosak/imaps-backend:latest
		;;
	help)
		echo "Builds docker images and pushes them to the stevetosak repository on Docker Hub."
		echo "Use option 'a' to build and push the frontend and backend."
		echo "Use option 'b' to build and push only the backend."
		echo "Use option 'f' to build and push only the frontend."
		echo "Example usage: ./build-push.sh <option>"
		;;
	*)
		echo "Error: Invalid argument. Please use 'a', 'b', or 'f'."
		echo "Terminating..."
		exit 0
		;;
esac
