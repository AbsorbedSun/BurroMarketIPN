// Inventario: buscador con validación + acciones de editar y eliminar

var formulario = document.querySelector("form");
var campoBusqueda = document.getElementById("q");
var campoCategoria = document.getElementById("cat");
var cuerpoTabla = document.querySelector(".tabla-inventario tbody");
var caption = document.querySelector(".tabla-inventario caption");

// Las filas se consultan cada vez porque pueden eliminarse
function obtenerFilas() {
  return cuerpoTabla.querySelectorAll("tr");
}

// Convierte "$1,234.50" en 1234.5
function leerDinero(texto) {
  return Number(texto.replace("$", "").replace(/,/g, ""));
}

// Convierte 1234.5 en "$1,234.50"
function formatoDinero(numero) {
  return (
    "$" +
    numero.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Insignia de estado según las existencias
function insigniaEstado(existencias) {
  if (existencias === 0) {
    return '<span class="badge rounded-pill b-rojo">Agotado</span>';
  } else if (existencias <= 5) {
    return '<span class="badge rounded-pill b-naranja">Bajo</span>';
  }
  return '<span class="badge rounded-pill b-verde">Disponible</span>';
}

// Recalcula las tarjetas de resumen y el texto de la tabla
function actualizarResumen() {
  var filas = obtenerFilas();
  var unidades = 0;
  var valor = 0;
  var visibles = 0;

  for (var i = 0; i < filas.length; i++) {
    var celdas = filas[i].querySelectorAll("td");
    unidades = unidades + Number(celdas[3].textContent);
    valor = valor + leerDinero(celdas[4].textContent);
    if (!filas[i].hidden) {
      visibles = visibles + 1;
    }
  }

  document.getElementById("totalProductos").textContent = filas.length;
  document.getElementById("totalUnidades").textContent =
    unidades.toLocaleString("es-MX");
  document.getElementById("totalValor").textContent = formatoDinero(valor);

  if (visibles === filas.length) {
    caption.textContent =
      "Inventario de BurroMarket IPN: " + filas.length + " productos";
  } else {
    caption.textContent =
      "Inventario de BurroMarket IPN: " +
      visibles +
      " de " +
      filas.length +
      " productos";
  }
}

/* ---------- Buscador ---------- */

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

    var filas = obtenerFilas();
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

    actualizarResumen();

    if (visibles === 0) {
      alert("No se encontraron productos con ese criterio.");
    }
  }
});

/* ---------- Acciones: editar y eliminar ---------- */

var modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));
var modalEliminar = new bootstrap.Modal(
  document.getElementById("modalEliminar"),
);

var formEditar = document.getElementById("formEditar");
var editarCodigo = document.getElementById("editarCodigo");
var editarCategoria = document.getElementById("editarCategoria");
var editarNombre = document.getElementById("editarNombre");
var editarPrecio = document.getElementById("editarPrecio");
var editarExistencias = document.getElementById("editarExistencias");
var editarErrores = document.getElementById("editarErrores");
var editarSubtitulo = document.getElementById("editarSubtitulo");

var patronNombre = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/; // solo letras y espacios
var patronPrecio = /^([0-9]+(\.[0-9]{1,2})?|\.[0-9]{1,2})$/; // hasta 2 decimales
var patronEntero = /^[0-9]+$/; // solo dígitos

var filaSeleccionada = null; // fila que se está editando o eliminando

// Un solo escuchador para todos los botones de la tabla
cuerpoTabla.addEventListener("click", function (evento) {
  var boton = evento.target.closest("button");
  if (!boton) {
    return;
  }
  filaSeleccionada = boton.closest("tr");
  var celdas = filaSeleccionada.querySelectorAll("td");
  var codigo = filaSeleccionada.querySelector("th").textContent.trim();
  var nombre = celdas[0].textContent.trim();

  if (boton.classList.contains("btn-editar")) {
    editarCodigo.value = codigo;
    editarCategoria.value = celdas[1].textContent.trim();
    editarNombre.value = nombre;
    editarPrecio.value = leerDinero(celdas[2].textContent).toFixed(2);
    editarExistencias.value = celdas[3].textContent.trim();
    editarSubtitulo.textContent = nombre;

    // Limpiar errores de una edición anterior
    editarErrores.classList.add("d-none");
    editarNombre.classList.remove("is-invalid");
    editarPrecio.classList.remove("is-invalid");
    editarExistencias.classList.remove("is-invalid");

    modalEditar.show();
  } else if (boton.classList.contains("btn-eliminar")) {
    document.getElementById("eliminarNombre").textContent =
      codigo + " · " + nombre;
    modalEliminar.show();
  }
});

// Guardar los cambios del producto editado
formEditar.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var errores = [];
  var primerCampo = null;

  function marcar(campo, mensaje) {
    campo.classList.add("is-invalid");
    errores.push(mensaje);
    if (primerCampo === null) {
      primerCampo = campo;
    }
  }

  editarNombre.classList.remove("is-invalid");
  editarPrecio.classList.remove("is-invalid");
  editarExistencias.classList.remove("is-invalid");

  // Nombre: de 3 a 60 caracteres, solo letras y espacios
  var nombreTexto = editarNombre.value.trim();
  if (nombreTexto.length < 3 || nombreTexto.length > 60) {
    marcar(editarNombre, "El nombre debe tener de 3 a 60 caracteres.");
  } else if (patronNombre.test(nombreTexto) === false) {
    marcar(editarNombre, "El nombre solo puede tener letras y espacios.");
  }

  // Precio: mayor a 0, máximo 100,000 y hasta 2 decimales
  var precioTexto = editarPrecio.value.trim();
  var precioNumero = Number(precioTexto);
  if (precioTexto === "" || isNaN(precioNumero)) {
    marcar(editarPrecio, "Escribe el precio (solo números).");
  } else if (precioNumero <= 0) {
    marcar(editarPrecio, "El precio debe ser mayor a 0.");
  } else if (precioNumero > 100000) {
    marcar(editarPrecio, "El precio máximo es $100,000.");
  } else if (patronPrecio.test(precioTexto) === false) {
    marcar(editarPrecio, "El precio puede tener hasta 2 decimales.");
  }

  // Existencias: número entero de 0 a 10,000
  var existenciasTexto = editarExistencias.value.trim();
  if (existenciasTexto === "" || patronEntero.test(existenciasTexto) === false) {
    marcar(editarExistencias, "Las existencias deben ser un número entero.");
  } else if (Number(existenciasTexto) > 10000) {
    marcar(editarExistencias, "Las existencias deben estar entre 0 y 10,000.");
  }

  if (errores.length > 0) {
    editarErrores.innerHTML = errores.join("<br />");
    editarErrores.classList.remove("d-none");
    primerCampo.focus();
    return;
  }

  // Todo correcto: se actualiza la fila
  var existenciasNumero = Number(existenciasTexto);
  var celdas = filaSeleccionada.querySelectorAll("td");
  celdas[0].textContent = nombreTexto;
  celdas[2].textContent = formatoDinero(precioNumero);
  celdas[3].textContent = existenciasNumero;
  celdas[4].textContent = formatoDinero(precioNumero * existenciasNumero);
  celdas[5].innerHTML = insigniaEstado(existenciasNumero);

  actualizarResumen();
  modalEditar.hide();
});

// Confirmar la eliminación del producto
document
  .getElementById("btnConfirmarEliminar")
  .addEventListener("click", function () {
    if (filaSeleccionada) {
      filaSeleccionada.remove();
      filaSeleccionada = null;
      actualizarResumen();
    }
    modalEliminar.hide();
  });
