var models = require('../models/models');

// GET /quizes
exports.index = function (req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index', { quizes: quizes });
  });
};

// GET /quizes/:quizId
exports.question = function (req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    res.render('quizes/question', { quiz: quiz });
  });
};

// GET /quizes/answer
exports.answer = function (req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
	if (req.query.respuesta === quiz.respuesta) {
		res.render('quizes/answer', { quiz: quiz, respuesta: 'Correcto' });
	} else {
		res.render('quizes/answer', { quiz: quiz, respuesta: 'Incorrecto' });
	}
  });
};