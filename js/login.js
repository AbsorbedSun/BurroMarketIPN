// Validación del formulario de inicio de sesión
// Correo con formato válido y contraseña de mínimo 6 caracteres.

var formulario = document.querySelector("form");
var campoCorreo = document.getElementById("correo");
var campoClave = document.getElementById("clave");

// Correo: usuario@dominio.ext (sin dobles arrobas ni dobles puntos)
var patronCorreo =
  /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,}$/;

// Marca el campo en rojo, avisa y deja el cursor en él
function marcarError(campo, mensaje) {
  campo.classList.add("is-invalid");
  alert(mensaje);
  campo.focus();
}

formulario.addEventListener("submit", function (evento) {
  var correo = campoCorreo.value.trim();
  var clave = campoClave.value;

  // Limpia las marcas de un intento anterior
  campoCorreo.classList.remove("is-invalid");
  campoClave.classList.remove("is-invalid");

  if (correo === "") {
    evento.preventDefault();
    marcarError(campoCorreo, "Escribe tu correo electrónico.");
  } else if (patronCorreo.test(correo) === false) {
    evento.preventDefault();
    marcarError(
      campoCorreo,
      "Escribe un correo electrónico válido (ejemplo: usuario@dominio.com).",
    );
  } else if (clave.trim() === "") {
    evento.preventDefault();
    marcarError(campoClave, "Escribe tu contraseña.");
  } else if (clave.length < 6) {
    evento.preventDefault();
    marcarError(campoClave, "La contraseña debe tener al menos 6 caracteres.");
  } else {
    // Datos válidos: se guarda la sesión (simulada) y el formulario
    // continúa hacia panel.html.
    sessionStorage.setItem("sesionActiva", "true");
  }
});

// Aviso cuando una página de administración nos regresó aquí sin sesión
if (new URLSearchParams(window.location.search).get("aviso") === "sesion") {
  alert("Debes iniciar sesión para entrar a la zona de administración.");
}
