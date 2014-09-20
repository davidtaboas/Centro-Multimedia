
var deck,
    appPresentacion,
    presentacionAuto;


deck = bespoke.from('#presentacion', [
  bespoke.themes.cube()
]);

appPresentacion = function() {




  $(".totalSlides").html(deck.slides.length);


  deck.on('activate', function(e) {

    if (deck) {
      $(".currentSlide").html( deck.slide() + 1 );
    }
  });


  $(".auto input").on("click", function() {

    if (this.checked) {
      presentacionAuto = setInterval((function() {
        if (deck.slides.length === deck.slide()+1 ) {
          deck.slide(0);

        } else {
          deck.next()
        }
      }), 1000);
    } else {
      clearInterval(presentacionAuto);
    }
  });



  activarBoton('1', 'Anterior');
  activarBoton('3', 'Siguiente');
  window["funcionesbt1"] = function() {
    deck.prev();
  };
  window["funcionesbt3"] = function() {
    deck.next();
  };
};


appPresentacion();

