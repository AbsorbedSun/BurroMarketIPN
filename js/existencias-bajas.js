// Validación de «Cantidad a agregar» en Existencias bajas

var formularios = document.querySelectorAll("form");

// Solo dígitos (sin decimales, signos ni letras)
var patronCantidad = /^[0-9]+$/;

// Marca el campo en rojo, avisa y deja el cursor en él
function marcarError(campo, mensaje) {
  campo.classList.add("is-invalid");
  alert(mensaje);
  campo.focus();
}

for (var i = 0; i < formularios.length; i++) {
  formularios[i].addEventListener("submit", function (evento) {
    var campo = this.querySelector('input[name="cantidad"]');
    var cantidad = campo.value.trim();

    campo.classList.remove("is-invalid");

    if (cantidad === "") {
      evento.preventDefault();
      marcarError(campo, "Escribe la cantidad a agregar.");
    } else if (patronCantidad.test(cantidad) === false) {
      evento.preventDefault();
      marcarError(
        campo,
        "Escribe un número entero positivo (sin decimales ni signos).",
      );
    } else if (Number(cantidad) < 1) {
      evento.preventDefault();
      marcarError(campo, "La cantidad debe ser al menos 1.");
    } else if (Number(cantidad) > 10000) {
      evento.preventDefault();
      marcarError(campo, "La cantidad máxima por reabastecimiento es 10,000.");
    } else {
      var producto = this.parentElement.querySelector("p.muted").textContent;
      alert(
        "¡Reabastecimiento exitoso! Se agregaron " +
          Number(cantidad) +
          " piezas a " +
          producto +
          ".",
      );
    }
  });
}
