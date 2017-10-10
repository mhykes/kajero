var env = process.env.NODE_ENV || 'development';
//env = 'production';
var config = {
    development: require('./development.config'),
    production: require('./production.config')
};

module.exports = config[env];
