include .makerc

# ===================================================================== #
# PRODUCTION
#	===================================================================== #

.PHONY: deploy
deploy:
	npm run build
	rsync -avs --recursive --delete ./build/* ${REMOTE_USER}@${REMOTE_IP}:${REMOTE_PATH}


# ===================================================================== #
# DEVELOPMENT
#	===================================================================== #

.PHONY: up
up:
	npm start