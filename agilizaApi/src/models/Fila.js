const mongoose = require("mongoose");

const FilaSchema = new mongoose.Schema({
    name: { type: String, required: true},
    cpf: {type: String, required: true},
    timeEntry: {type: Date, default: Date.now},
    attended: {type: Boolean, default: false}
});

module.exports = mongoose.model('Fila', FilaSchema);