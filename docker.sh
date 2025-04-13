#each workspace need to run:  yarn install &&  yarn build
# then run the docker build command
docker build -t ddlabel-backend -f backend/Dockerfile .
docker run -p 5100:5100 ddlabel-backend
