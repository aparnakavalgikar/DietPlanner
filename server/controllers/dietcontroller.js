var restful = require('node-restful');

module.exports =  function(app, route) {

	//Setup controller for REST.
	var rest = restful.model('diet', app.models.diet).methods(['get', 'put', 'post', 'delete']);
	
	//Register this endpoint with application
	rest.register(app, route);
	
	//Return Middleware
	return function(req, res, next) {
		next();
	};
}