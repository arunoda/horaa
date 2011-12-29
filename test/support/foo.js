var buzz = require('./buzz');

module.exports = {
    bar: function(cb) {
        cb(null, 'real bar');
    },

    getBuzz: function(cb) {
        buzz.get(function(err, result) {
            cb(err, result);
        });
    }
};
