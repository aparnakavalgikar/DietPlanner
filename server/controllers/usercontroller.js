var restful = require('node-restful');

module.exports =  function(app, route) {

	//Setup controller for REST.
	var rest = restful.model('user', app.models.user).methods(['get', 'put', 'post', 'delete']);
	
	//Register this endpoint with application
	rest.register(app, route);
	
	//Return Middleware
	return function(req, res, next) {
		next();
	};
}