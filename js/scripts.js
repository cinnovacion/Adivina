$(function(){  

  var conjuntoAnimales = palabras_animales();
  var conjuntoCosas = palabras_cosas();
  var conjuntoPaises = palabras_paises();
  var conjuntoPlantas = palabras_plantas();
  var conjuntoSustantivos = palabras_sustantivos();
  var conjuntoValores = palabras_valores();
  var conjuntoVerbos = palabras_verbos();

  var serie;
  var palabra;
  var nivel;
  var utilizadas = [];
  var contador = 0;
  var contadorGanar = 0;

  function play(id){
    switch(id){
      case "animales":
        serie = conjuntoAnimales[Math.floor(Math.random()*conjuntoAnimales.length)];
        break;
      case "verbos":
        serie = conjuntoVerbos[Math.floor(Math.random()*conjuntoVerbos.length)];
        break;
      case "plantas":
        serie = conjuntoPlantas[Math.floor(Math.random()*conjuntoPlantas.length)];
        break;
      case "cosas":
        serie = conjuntoCosas[Math.floor(Math.random()*conjuntoCosas.length)];
        break;
      case "paises":
        serie = conjuntoPaises[Math.floor(Math.random()*conjuntoPaises.length)];
        break;
      case "valores":
        serie = conjuntoValores[Math.floor(Math.random()*conjuntoValores.length)];
        break;
      case "sustantivos":
        serie = conjuntoSustantivos[Math.floor(Math.random()*conjuntoSustantivos.length)];
        break;
      case "nivel_versus":
        //
        break;
    };
    play2();
  }
  function play2(){
    $("#intento").val("");
    palabra = serie.palabra;
    utilizadas.length = 0;
    contador = 0;
    contadorGanar = 0;

    $("p").remove(".letrasO");
    $("p").remove(".letras");

    for (var i = 0; i<palabra.length; i++) {
      var juego = $("<p></p>").text(" ____ ").attr("id", "letra"+i).addClass("letrasO");
      $("#palabra").append(juego);
    };
    $("#pista").html(serie.pista);

    $("#textError").css("font-size", "110%");
    $("#textError").fadeOut(500);
    $("#sig").html("");
    $("#form").removeClass("hidden");
    $("#buttonAgain").addClass("hidden");
  }

  $(".pers").mouseover(function(){
    $(this).addClass("p_over")
  });
  $(".pers").mouseout(function(){
    $(this).removeClass("p_over")
  });
  $(".pers").on("click", function(){
    $("#menu_personaje").addClass("hidden");
    $("#menu_tema").removeClass("hidden");
    $("#jugador").attr("src", "resources/personaje_"+$(this).attr("id")+"/00.png");
    $("#jugador").attr("alt", $(this).attr("id"));
  });
  $("#cambiar").on("click", function(){
    $("#menu_tema").addClass("hidden");
    $("#menu_personaje").removeClass("hidden");
  });
  $(".nivel").on("click", function(){
    $("#menu_tema").addClass("hidden");
    $("#juego").removeClass("hidden");
    $("#sinDientes").attr("src", "resources/personaje_"+$("#jugador").attr("alt")+"/0.png");
    nivel = $(this).attr("id");
    play(nivel);
  });
  $("#nivel_versus").on("click", function(){
    $("#menu_tema").addClass("hidden");
    $("#versus").removeClass("hidden");
  });
  $("#cambiar_nivel_versus").on("click", function(){
    $("#versus").addClass("hidden");
    $("#menu_tema").removeClass("hidden");
  });
  $("#cambiarNivel").on("click", function(){
    $("#juego").addClass("hidden");
    $("#menu_tema").removeClass("hidden");
  });
  $("#jugar_versus").on("click", function(){
    if ( $("#palabra_versus").val().length==0 || $("#pista_versus").val().length==0  || $("#significado_versus").val().length==0 ) {
      //
    }else{
      serie= {
        "palabra":$("#palabra_versus").val(),
        "pista":$("#pista_versus").val(),
        "significado":$("#significado_versus").val()
      };
      $("#palabra_versus").val("");
      $("#pista_versus").val("");
      $("#significado_versus").val("");
      //
      $("#versus").addClass("hidden");
      $("#juego").removeClass("hidden");
      $("#sinDientes").attr("src", "resources/personaje_"+$("#jugador").attr("alt")+"/0.png");
      nivel = "versus";
      play2();
    };
  });
  $("#again").on("click", function(){
    if (nivel == "versus") {
      $("#juego").addClass("hidden");
      $("#menu_tema").removeClass("hidden");
    }else{
      play(nivel);
    };
  });

  /******************************************/

  $("#intento").keyup(function(e){
    if(e.keyCode == 13){
      intento();
    }
  });

  $("#buttonAgregar").on("click", function(){
    intento();
  });

  function intento(){
    if ( $("#intento").val().length == 1 ) {
      if (agregarUtilizada($("#intento").val()) ) {
        buscar( $("#intento").val() );
      };
      $("#intento").val("");
    }else if( $("#intento").val().length == 0){
      $("#textError").html("Escribe una letra");
      $("#textError").fadeIn(1000).fadeOut(1000);
    }else{
      $("#textError").html("Escribe solo una letra a la vez!!");
      $("#textError").fadeIn(1000).fadeOut(1000);
    };
  }

  function agregarUtilizada(letra){
    var encontrada = false;
    for (var i = 0; i<utilizadas.length; i++) {
      if (utilizadas[i]==letra) {
        encontrada = true;
        break;
      };
    };
    if (encontrada == false) {
      utilizadas.push(letra);
      var nuevaLetra = $("<p></p>").text(letra+", ").attr("id", letra).addClass("letras");
      $("#utilizadas").append(nuevaLetra);
      return true;
    }else{
      $("#"+letra).addClass("again")
      $("#"+letra).fadeOut(1000).fadeIn(1000);
      setTimeout(function(){$("#"+letra).removeClass("again");},2500);
      return false;
    };
  }

  function buscar(letra){
    var resp = false;
    for (var i = 0; i < palabra.length; i++) {
      if (letra == palabra[i]) {
        $("#letra"+i).html(letra).addClass("letrasEncontradas");
        contadorGanar++;
        resp = true;
      };
    };
    if (resp == false) {
      contador++;
      $("#textError").html("Te equivocaste, tienes "+(8-contador)+" intentos todavía.");
      $("#sinDientes").attr("src", "resources/personaje_"+$("#jugador").attr("alt")+"/"+contador+".png");
      $("#textError").fadeIn(1000).fadeOut(1000);
    };
    finalizar();
  }

  function finalizar(){
    if (contador==8){
      for (var i = 0; i<palabra.length; i++) {
        $("#letra"+i).html(palabra[i]).addClass("letrasEncontradas again");
      };
      $("#textError").html("Has perdido!!");
      again();
      //setTimeout(function(){location.reload();}, 2000);
    };
    if (contadorGanar==palabra.length){
      $("#textError").html("HAS GANADO!!");
      again();
      //setTimeout(function(){location.reload();}, 2000);
    };
  }
  function again(){
    $("#textError").css("font-size", "150%");
    $("#textError").fadeIn(1000);
    $("#sig").html(serie.significado);
    $("#form").addClass("hidden");
    $("#buttonAgain").removeClass("hidden");
  }


});

