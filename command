docker build --build-arg DOCKER_ENV=development -t vkbn .
docker build --build-arg DOCKER_ENV=production -t vkbn .
docker run --network host --restart=always --name=vkbn vkbn
-- как демон
docker run -d --network host --restart=always vkbn name vkbn

-- статистика по работе контейнера
docker ps -q | xargs  docker stats --no-stream

--Удалить все остановленные контейнеры и неиспользуемые образы
docker system prune -a
--Удаление всех остановленных контейнеров
docker container prune

Expires on Wed, Feb 1 2023.
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
-- запомнить пароли
git config credential.helper cache