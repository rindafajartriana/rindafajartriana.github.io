docker rmi -f insurance-react-nginx-react && sleep 1 && docker compose -f docker-compose.yml -p 'insurance-web-v1' up -d --build
