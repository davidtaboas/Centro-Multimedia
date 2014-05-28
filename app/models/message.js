
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MensajeSchema = new Schema({
  prioridad: { type: Number, min: 0, max: 2 },
  texto: { type: String},
  fechaEnvio: { type: Date, default: Date.now },
  fechaExpiracion: {type: Date, default: Date.now() + 24*3600*1000}

});


mongoose.model('Mensaje', MensajeSchema);
