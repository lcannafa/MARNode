var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var VariablesSchema   = new Schema({
	x: Number,
	y: Number,
	corriente: Number,
	voltaje: Number,
});

module.exports = mongoose.model('Variables', VariablesSchema);