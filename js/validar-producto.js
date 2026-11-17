// Validación del formulario «Registrar producto»

var formulario = document.getElementById("formRegistroProducto");
var categoria = document.getElementById("categoria");
var codigo = document.getElementById("codigo");
var nombre = document.getElementById("nombre");
var precio = document.getElementById("precio");
var existencias = document.getElementById("existencias");
var descripcion = document.getElementById("descripcion");
var imagen = document.getElementById("imagen");

var alerta = document.getElementById("alertaValidacion");
var resumen = document.getElementById("tarjetaExitoRegistro");
var contador = document.getElementById("contadorDescripcion");

/* Expresiones regulares */
var patronCodigo = /^(ROP|PAP|ELE|LAB|ACC)[0-9]{3}$/; // prefijo + 3 dígitos
var patronNombre = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/; // solo letras y espacios
var patronPrecio = /^([0-9]+(\.[0-9]{1,2})?|\.[0-9]{1,2})$/; // hasta 2 decimales
var patronEntero = /^[0-9]+$/; // solo dígitos
var patronImagen = /\.(jpg|jpeg|png|webp)$/i; // extensiones permitidas

// Códigos que ya existen en el inventario (para no repetirlos)
var codigosExistentes = [
  "ACC001",
  "ACC002",
  "ACC003",
  "ELE001",
  "ELE002",
  "ELE003",
  "LAB001",
  "LAB002",
  "LAB003",
  "LAB004",
  "PAP001",
  "PAP002",
  "PAP003",
  "PAP004",
  "ROP001",
  "ROP002",
  "ROP003",
  "ROP004",
];

var campos = [
  categoria,
  codigo,
  nombre,
  precio,
  existencias,
  descripcion,
  imagen,
];
var errores = [];
var primerCampoConError = null;

// Guarda el mensaje y marca el campo en rojo
function error(campo, mensaje) {
  campo.classList.add("is-invalid");
  errores.push(mensaje);
  if (primerCampoConError === null) {
    primerCampoConError = campo;
  }
}

// Contador de caracteres de la descripción (se actualiza al escribir)
descripcion.addEventListener("input", function () {
  contador.textContent = descripcion.value.length + " / 200";
});

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault(); // la validación se hace aquí, en el navegador

  // Limpiar lo que quedó de un intento anterior
  errores = [];
  primerCampoConError = null;
  for (var i = 0; i < campos.length; i++) {
    campos[i].classList.remove("is-invalid");
  }
  alerta.className = "alert alert-danger py-2 px-3 small mt-3 mb-0 d-none";
  resumen.classList.add("d-none");

  // Categoría: debe elegirse una opción
  if (categoria.value === "") {
    error(categoria, "Elige una categoría.");
  }

  // Código: prefijo + 3 dígitos, coincide con la categoría y no se repite
  var codigoTexto = codigo.value.trim().toUpperCase();
  if (codigoTexto === "") {
    error(codigo, "Escribe el código del producto.");
  } else if (patronCodigo.test(codigoTexto) === false) {
    error(
      codigo,
      "El código debe llevar el prefijo ROP, PAP, ELE, LAB o ACC y 3 dígitos (ej. PAP005).",
    );
  } else if (
    categoria.value !== "" &&
    codigoTexto.indexOf(categoria.value) !== 0
  ) {
    error(
      codigo,
      "El prefijo del código debe coincidir con la categoría elegida.",
    );
  } else if (codigosExistentes.indexOf(codigoTexto) !== -1) {
    error(codigo, "Ese código ya existe en el inventario.");
  }

  // Nombre: de 3 a 60 caracteres, solo letras y espacios
  var nombreTexto = nombre.value.trim();
  if (nombreTexto.length < 3 || nombreTexto.length > 60) {
    error(nombre, "El nombre debe tener de 3 a 60 caracteres.");
  } else if (patronNombre.test(nombreTexto) === false) {
    error(nombre, "El nombre solo puede tener letras y espacios.");
  }

  // Precio: mayor a 0, máximo 100,000 y hasta 2 decimales
  var precioTexto = precio.value.trim();
  var precioNumero = Number(precioTexto);
  if (precioTexto === "" || isNaN(precioNumero)) {
    error(precio, "Escribe el precio (solo números).");
  } else if (precioNumero <= 0) {
    error(precio, "El precio debe ser mayor a 0.");
  } else if (precioNumero > 100000) {
    error(precio, "El precio máximo es $100,000.");
  } else if (patronPrecio.test(precioTexto) === false) {
    error(precio, "El precio puede tener hasta 2 decimales (ej. 99.50).");
  }

  // Existencias: número entero de 0 a 10,000
  var existenciasTexto = existencias.value.trim();
  if (existenciasTexto === "") {
    error(existencias, "Escribe las existencias (solo números).");
  } else if (patronEntero.test(existenciasTexto) === false) {
    error(
      existencias,
      "Las existencias deben ser un número entero, sin decimales ni signos.",
    );
  } else if (Number(existenciasTexto) > 10000) {
    error(existencias, "Las existencias deben estar entre 0 y 10,000.");
  }

  // Descripción: de 10 a 200 caracteres
  var descripcionTexto = descripcion.value.trim();
  if (descripcionTexto.length < 10 || descripcionTexto.length > 200) {
    error(descripcion, "La descripción debe tener de 10 a 200 caracteres.");
  }

  // Imagen: JPG, PNG o WEBP de máximo 2 MB
  var archivo = imagen.files[0];
  if (!archivo) {
    error(imagen, "Selecciona una imagen del producto.");
  } else if (patronImagen.test(archivo.name) === false) {
    error(imagen, "La imagen debe ser JPG, PNG o WEBP.");
  } else if (archivo.size > 2 * 1024 * 1024) {
    error(imagen, "La imagen no debe pesar más de 2 MB.");
  }

  // Si hay errores: se avisan, el formulario no se guarda y el cursor va al primero
  if (errores.length > 0) {
    alert("Por favor corrige lo siguiente:\n\n- " + errores.join("\n- "));
    primerCampoConError.focus();
    return;
  }

  // Todo correcto: se muestran en pantalla los datos ingresados
  document.getElementById("prevCategoria").textContent = categoria.value;
  document.getElementById("prevCodigo").textContent = codigoTexto;
  document.getElementById("prevNombre").textContent = nombreTexto;
  document.getElementById("prevPrecio").textContent =
    "$" + precioNumero.toFixed(2);
  document.getElementById("prevExistencias").textContent =
    Number(existenciasTexto);
  document.getElementById("prevDescripcion").textContent = descripcionTexto;
  resumen.classList.remove("d-none");

  alerta.className = "alert alert-success py-2 px-3 small mt-3 mb-0";
  alerta.textContent = "¡Producto validado y registrado correctamente!";

  // Este código ya no se puede volver a usar en esta sesión
  codigosExistentes.push(codigoTexto);
});
