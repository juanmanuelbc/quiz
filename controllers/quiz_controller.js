var models = require('../models/models');

// Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
  models.Quiz.findById(quizId).then(function(quiz) {
    if (quiz) {
      req.quiz = quiz;
      next();
    }
    else {
      next(new Error('No existe quizId = ' + quizId));
    }
  }).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function (req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index', { quizes: quizes });
  }).catch(function(error) { next(error); });
};

// GET /quizes/:quizId
exports.question = function (req, res) {
  res.render('quizes/question', { quiz: req.quiz });
};

// GET /quizes/answer
exports.answer = function (req, res) {
  if (req.query.respuesta === req.quiz.respuesta) {
    res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Correcto' });
  }
  else {
    res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto' });
  }
};
