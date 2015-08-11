var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId o :commentId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.question);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.authorize, quizController.new);
router.post('/quizes/create', sessionController.authorize, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.authorize, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.authorize, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.authorize, quizController.delete);
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments/create', commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.authorize, commentController.publish);

// Definición de rutas de sesión
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.delete('/logout', sessionController.delete);

router.get('/author', function(req, res, next) {
  res.render('author', { author: 'Juan Manuel Bennàssar Carretero', errors: [] });
});

module.exports = router;
