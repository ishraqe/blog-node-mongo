var {User} = require('./../model/User');

var authenticate = (req, res, next) => {
    var token = req.query.auth_token;
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send('ish not authenticated');
    });
};

module.exports = {authenticate};