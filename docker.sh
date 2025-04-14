#each workspace need to run:  yarn install &&  yarn build
# then run the docker build command
docker build -t ddlabel-builder -f ./Dockerfile.builder .
docker build -t ddlabel-backend -f backend/Dockerfile .
docker run --network="host" --env-file backend/.env.production --name label -p 5100:5100 ddlabel-backend
docker run --network="host" --env-file frontend/.env.production --name label -p 3000:3000 ddlabel-frontend
debug:
docker run --env-file backend/.env.production --name label -p 5100:5100 -it ddlabel-backend /bin/sh
docker run --name builder -it ddlabel-builder /bin/sh
