docker build -t saitoliterust .
docker run -it --rm -p 12101:12101 saitoliterust

docker run -it --rm -p 12101:12101 saitoliterust /bin/bash
npm run start

docker run -d -p 3000:3000 -p 12101:12101 -v .:/usr/src/app saitoliterust

docker-compose up --build -d
