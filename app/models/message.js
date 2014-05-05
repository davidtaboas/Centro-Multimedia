
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MensajeSchema = new Schema({
  prioridad: { type: Number, min: 0, max: 2 },
  texto: String,
  fechaEnvio: { type: Date, default: Date.now },
  unidadDuracion: Number,
  escalaDuracion: String

});


mongoose.model('Mensaje', MensajeSchema);
