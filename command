-- собираем образ
docker build --build-arg DOCKER_ENV=development -t vkbn .
docker build --build-arg DOCKER_ENV=production -t vkbn .

-- создать контейнер из образа vkbn под названиеим vkbn_new
docker create --network host --restart=always --name=vkbn_new vkbn

-- создать и запустить контейнер из образа
docker run --network host --restart=always --name=vkbn vkbn
-- как демон
docker run -d --network host --restart=always --name=vkbn vkbn

-- статистика по работе контейнера
docker ps -q | xargs  docker stats --no-stream

--Удалить все остановленные контейнеры и неиспользуемые образы
docker system prune -a
--Удаление всех остановленных контейнеров
docker container prune
--Удалить контейнер по имени
docker rm vkbn
--Удалить образ по имени
docker rmi vkbn

Expires on Wed, Feb 1 2023.
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
-- запомнить пароли
git config credential.helper cache