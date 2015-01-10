/**
 * Module dependencies.
 */

var express        = require('express'),
    path           = require('path'),
    logger         = require('morgan'),
    bodyParser     = require('body-parser'),
    compress       = require('compression'),
    favicon        = require('static-favicon'),
    methodOverride = require('method-override'),
    errorHandler   = require('errorhandler'),
    config         = require('./config'),
    routes         = require('./routes');



var app = express();

//used for /db proxy
var forward = require('./forward.js');

/**
 * Express configuration.
 */
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app
  .use(compress())
  .use(favicon())
  .use(logger('dev'))
  .use(bodyParser())
  .use(methodOverride())
  .use(express.static(path.join(__dirname, 'public')))
  .use(routes.indexRouter)
  //.use(forward(/\/db\/(.*)/, 'https://40a04e93-daf4-47c7-9faa-f25334792d10-bluemix.cloudant.com/home-automation/'))
  .use(forward(/\/db\/(.*)/, 'http://192.168.1.96:5984/torque/'))
  
  .use(function (req, res) {
    res.status(404).render('404', {title: 'Not Found :('});
  });

if (app.get('env') === 'development') {
  app.use(errorHandler());
}
 


 
 
app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Home page at http://localhost:' + app.get('port') + '/index.html. ');
  console.log('Database proxy at http://localhost:' + app.get('port') + '/db/ (e.g. http://localhost:' + app.get('port') + '/db/_all_docs to view all database documents).');

});




