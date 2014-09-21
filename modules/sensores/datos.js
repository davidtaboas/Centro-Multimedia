// var URL = "http://172.16.244.156:8000/";
// var measure, uom;

// var aux = JSON.stringify({query: "getAllMeasures", params: {}});
//     $.post(URL,aux,function(result){
//         $.each(result, function(index, value) {
//             var getMeasureByDescription = JSON.stringify({query: "getMeasureByDescription", params: {description: value.measureDescription }});
//                 $.post(URL,getMeasureByDescription,function(result){
//                     measure = result.measureId;
//                     uom = result.measureUom;
//                 });
//                 datosSensor('sensor'+index, measure, uom);
//     });
// });



datosSensor('sensor1', 'Consumo de energía', 'CITIUS_AR_General_Energia_Activa', 'kwh')

datosSensor('sensor2', 'Consumo de gas', 'CITIUS_Cald_Contador_Gas', 'm^3')

datosSensor('sensor3', 'Consumo de agua', 'CITIUS_Contador_Agua_Red', 'm^3')

datosSensor('sensor4', 'Consumo de enfriadora', 'CITIUS_AR_Enf_Energia_Activa', 'kwh')
