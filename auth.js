var passport = require("passport");
var passportJWT = require("passport-jwt");

var users = require("./users.js");
var cfg = require("./config.js");

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
	secretOrKey: cfg.jwtSecret,
	jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function(){
	var strategy = new Strategy(params, function(payload,done){
		var user = users.find(function(u){ return u.id === payload.id});
		console.log(user);
		if(user){
			return done(null, {id: user.id});
		}else{
			return done(new Error("User not found"), null);
		}
	});
	passport.use(strategy);
	return{
		initialize: function(){
			return passport.initialize();
		},
		authenticate: function(){
			return passport.authenticate("jwt",cfg.jwtSession);
		}
	};
};