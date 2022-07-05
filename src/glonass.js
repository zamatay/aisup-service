// подключаем необходимые модули
const fileName = (process.env.NODE_ENV) ? `../.${process.env.NODE_ENV}.env` : '../.env';
const fs = require('fs').promises;
const path = require('path');
const a = require('dotenv').config({path: fileName});
const axios = require('axios/lib/axios');
const typeorm = require("typeorm");

// создаем экземпляр для работы с запросами к сервису
const http = axios.create({
  withCredentials: true,
  timeout: 0
})

const isolation = require('tedious').ISOLATION_LEVEL.READ_UNCOMMITTED;

// подгружаем параметры для подключения к БД
const dataSource = new typeorm.DataSource({
  type: "mssql",
  host: process.env.MSSQL_HOST,
  username: process.env.MSSQL_LOGIN,
  password: process.env.MSSQL_PASSWORD,
  database: process.env.MSSQL_DB,
  options: {
    encrypt: false,
    enableArithAbort: true,
    isolation: isolation,
    connectionIsolationLevel: isolation,
  }
})

const _CHUNK_DATA = 150;
const nowDate = new Date().toISOString().split('T')[0];

const getPromise = (id)=>{
  return http.get(`http://vkb.glonass.io/api/integration/v1/objectinfo?oid=${id}&dt=${nowDate}`);
}

const query = async (query, parameters/*: object = {}*/)=>{
  const connection = dataSource.manager.connection;
  const [ escapedQuery, escapedParams ] = connection.driver.escapeQueryWithParameters(query, parameters, {});
  return connection.query(escapedQuery, escapedParams);
}


const getData = async (promises)=>{
  try {
    return await Promise.all(promises);;
  } catch(e){
    return false
  }
}

const start = async () => {
  // логинимся
  const data = await http.get('http://vkb.glonass.io/api/integration/v1/connect?login=%D0%92%D0%9A%D0%91&password=%D0%A2%D1%83%D0%BB%D0%B03&lang=ru-ru&timezone=0');
  const sessionID = data.headers.sessionid;
  // если залогинились и получили сессию
  if (sessionID){
    await dataSource.initialize();
    http.defaults.headers.get = {COOKIE: `SGUID=session_id=${sessionID}`};
    // получаем список объектов
    const list = await http.get('http://vkb.glonass.io/api/integration/v1/getobjectslist?companyId=0');
    await query('exec m_ImportGlonasTransport :data', {data: JSON.stringify(list.data)});
    const ids = list.data.objects.map((item)=>item.id);
    const allData = [];
    // пока список не пуст запрпашиваем данные по объекту
    while (ids.length){
      const rawIDs = ids.splice(0, _CHUNK_DATA);
      // формируем промисы
      const promises = rawIDs.map(id=>getPromise(id));
      let exceptCount = 0;
      let objectData;
      // ждем пока все выполнится без ошибок но не более 5 раз
      while (!(objectData = await getData(promises)) || exceptCount < 5){
        exceptCount++
      }
      // собираем в объект
      objectData.forEach(item=>allData.push(item.data));
    }
    const file = path.join(__dirname, 'objectData.log');
    await query('exec m_ImportGlonasTransportDetail :data', {data: JSON.stringify(allData)});
    // await fs.writeFile(file, JSON.stringify(allData), (er)=>{
    //   if (er) {
    //     console.log(er);
    //   }
    // })
  }
}

start().then();