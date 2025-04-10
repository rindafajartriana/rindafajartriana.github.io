docker rmi -f 5r-react-nginx-react && sleep 1 && docker compose -f docker-compose.yml -p '5r-web-v1' up -d --build
