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



datosSensor('sensor1', 'algo', 'kwh')

datosSensor('sensor2', 'algo', 'kwh')

datosSensor('sensor3', 'algo', 'kwh')

datosSensor('sensor4', 'algo', 'kwh')