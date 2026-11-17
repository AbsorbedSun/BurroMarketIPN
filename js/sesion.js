// Control de sesión (simulado) para las páginas de administración
function haySesion() {
  return sessionStorage.getItem("sesionActiva") === "true";
}

// Sin sesión: se regresa al login con un aviso
if (!haySesion()) {
  window.location.replace("login.html?aviso=sesion");
}

// Si el usuario regresa con el botón «Atrás» después de cerrar sesión,
// la página puede venir de la memoria del navegador: se revisa otra vez
window.addEventListener("pageshow", function () {
  if (!haySesion()) {
    window.location.replace("login.html?aviso=sesion");
  }
});

// «Cerrar sesión» borra la sesión y continúa hacia index.html
document.addEventListener("click", function (evento) {
  var enlace = evento.target.closest("a");
  if (enlace && enlace.querySelector('img[src*="right-from-bracket"]')) {
    sessionStorage.removeItem("sesionActiva");
  }
});
