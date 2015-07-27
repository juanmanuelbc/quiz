var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var dialect = (url[1] || null);
var protocol = (url[1] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var host = (url[4] || null);
var port = (url[5] || null);
var database = (url[6] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(database, user, pwd, { dialect: dialect, protocol: protocol, host: host, port: port, storage: storage, omitNull: true });

// Importar la definición de la tabla Quiz en 'quiz.js'
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Exportar la definición de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // success(...) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    // La tabla se inicializa sólo si está vacía
    if (count === 0) {
      Quiz.create({ pregunta: 'Capital de Italia', respuesta: 'Roma' }).then(function() {
	console.log('Base de datos inicializada');
      });
    }
  });
});
