var models = require('../models/models');

// Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
  if (req.session.user) {
    var search = {
		   where: { id: quizId },
		   include: [{ model: models.Comment, required: false }]
		 };
  }
  else {
    var search = {
		   where: { id: quizId },
		   include: [{ model: models.Comment, required: false, where: { publicado: true } }]
		 };
  }
  models.Quiz.find(search).then(function(quiz) {
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
  if (req.query.search) {
    var busqueda = '%' + req.query.search.replace(/ /g, '%') + '%';
    models.Quiz.findAll({ where: ['pregunta like ?', busqueda], order: 'pregunta ASC' }).then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: [] });
    }).catch(function(error) { next(error); });
  }
  else {
    models.Quiz.findAll().then(function(quizes) {
      res.render('quizes/index', { quizes: quizes, errors: [] });
    }).catch(function(error) { next(error); });
  }
};

// GET /quizes/:quizId
exports.question = function (req, res) {
  res.render('quizes/question', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:quizId/answer
exports.answer = function (req, res) {
  if (req.query.respuesta === req.quiz.respuesta) {
    res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Correcto', errors: [] });
  }
  else {
    res.render('quizes/answer', { quiz: req.quiz, respuesta: 'Incorrecto', errors: [] });
  }
};

// GET /quizes/new
exports.new = function (req, res) {
  var quiz = models.Quiz.build({ pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'Tema' });
  res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function (req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/new', { quiz: quiz, errors: err.errors });
    }
    else {
      quiz.save({ fields: ['pregunta', 'respuesta', 'tema'] }).then(function() {
	res.redirect('/quizes');
      });
    }
  });
};

// GET /quizes/:quizId/edit
exports.edit = function (req, res) {
  res.render('quizes/edit', { quiz: req.quiz, errors: [] });
};

// PUT /quizes/:quizId
exports.update = function (req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz.validate().then(function(err) {
    if (err) {
      res.render('quizes/edit', { quiz: req.quiz, errors: err.errors } );
    }
    else {
      req.quiz.save({ fields: ['pregunta', 'respuesta', 'tema'] }).then(function() {
	res.redirect('/quizes');
      });
    }
  });
};

// DELETE /quizes/:quizId
exports.delete = function (req, res) {
  req.quiz.destroy().then(function() {
    res.redirect('/quizes');
  }).catch(function(error) { next(error); });
};
