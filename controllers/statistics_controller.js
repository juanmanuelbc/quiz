var models = require('../models/models');

// GET /quizes/statistics
exports.index = function (req, res) {
  var statistics = {};

  models.Quiz.count().then(function(quizes) {
    statistics.numero_de_preguntas = quizes;
    models.Comment.count().then(function(comments) {
      statistics.numero_de_comentarios_totales = comments;
      statistics.numero_medio_de_comentarios_por_pregunta = (statistics.numero_de_comentarios_totales / statistics.numero_de_preguntas).toFixed(2);
      statistics.numero_de_preguntas_sin_comentarios = 0;
      statistics.numero_de_preguntas_con_comentarios = 0;
      models.Quiz.findAll({ include: [{ model: models.Comment, required: false }]}).then(function(quizes) {
	for (var i in quizes) {
	  if (quizes[i].Comments.length) {
	    statistics.numero_de_preguntas_con_comentarios++;
	  }
	  else {
	    statistics.numero_de_preguntas_sin_comentarios++;
	  }
	}
	res.render('statistics/index', { statistics: statistics, errors: [] });
      }).catch(function(error) { next(error); });
    }).catch(function(error) { next(error); });
  }).catch(function(error) { next(error); });
};
