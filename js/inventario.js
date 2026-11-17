// Buscador del inventario con validación

var formulario = document.querySelector("form");
var campoBusqueda = document.getElementById("q");
var campoCategoria = document.getElementById("cat");
var filas = document.querySelectorAll(".tabla-inventario tbody tr");
var caption = document.querySelector(".tabla-inventario caption");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var texto = campoBusqueda.value.trim().toLowerCase();
  var categoria = campoCategoria.value;
  var caracteresValidos = true;

  for (var j = 0; j < texto.length; j++) {
    var caracter = texto[j];

    if (
      !(caracter >= "a" && caracter <= "z") &&
      !(caracter >= "0" && caracter <= "9") &&
      caracter !== " " &&
      !"áéíóúüñ".includes(caracter)
    ) {
      caracteresValidos = false;
    }
  }

  // Validaciones

  if (texto.length === 1) {
    alert("Escribe al menos 2 caracteres.");
  } else if (texto.length > 30) {
    alert("Máximo 30 caracteres.");
  } else if (!caracteresValidos) {
    alert("No se permiten caracteres especiales.");
  } else {
    // Filtrar la tabla

    var visibles = 0;

    for (var i = 0; i < filas.length; i++) {
      var codigo = filas[i].querySelector("th").textContent.toLowerCase();
      var nombre = filas[i].querySelector("td").textContent.toLowerCase();

      var coincideTexto = codigo.includes(texto) || nombre.includes(texto);

      var coincideCategoria =
        categoria === "" || codigo.startsWith(categoria.toLowerCase());

      if (coincideTexto && coincideCategoria) {
        filas[i].hidden = false;
        visibles = visibles + 1;
      } else {
        filas[i].hidden = true;
      }
    }

    caption.textContent =
      "Inventario de BurroMarket IPN: " +
      visibles +
      " de " +
      filas.length +
      " productos";

    if (visibles === 0) {
      alert("No se encontraron productos con ese criterio.");
    }
  }
});
