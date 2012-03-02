/* oggetto in cui carico tutte le azioni da compiere al caricamento della pagina */
var carrier = {};

/*
carrier.nome_funzione = function(){
};
*/

/* azioni da compiere al dom ready */
jQuery(document).ready(function() {

  /* esecuzione di tutte le funzioni caricate nell'oggetto carrier */
  jQuery.each(carrier, function() {
      this(document); // context
  });

});