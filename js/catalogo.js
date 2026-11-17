document.addEventListener("DOMContentLoaded", () => {
  const formBusqueda = document.getElementById("form-busqueda");
  const inputBusqueda = document.getElementById("q");
  const selectCategoria = document.getElementById("cat");
  const btnLimpiar = document.getElementById("btn-limpiar");
  const contadorTexto = document.querySelector("main > p.muted");
  const tarjetas = document.querySelectorAll("main .row.g-3 > div");
  const btnAdmin = document.querySelector(".navbar .btn-pr");

  // Verificar si hay sesión activa
  const sesionActiva =
    sessionStorage.getItem("sesionActiva") === "true" ||
    localStorage.getItem("sesionActiva") === "true";

  if (sesionActiva && btnAdmin) {
    btnAdmin.href = "panel.html";
    btnAdmin.innerHTML = `<img class="icono" src="img/iconos/user.svg" alt="" /> Mi panel`;
  }

  // Quita acentos al buscar
  const normalizar = (texto) =>
    texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Solo letras, números, espacios y vocales acentuadas
  function tieneCaracteresValidos(texto) {
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i].toLowerCase();
      const esLetra = c >= "a" && c <= "z";
      const esNumero = c >= "0" && c <= "9";
      if (!esLetra && !esNumero && c !== " " && !"áéíóúüñ".includes(c)) {
        return false;
      }
    }
    return true;
  }

  // Filtra las tarjetas según el texto y la categoría elegidos.
  // Devuelve cuántos productos quedaron visibles.
  function filtrarCatalogo() {
    const textoBuscado = normalizar(inputBusqueda.value.trim());
    const categoriaElegida = selectCategoria.value;
    let visibles = 0;

    tarjetas.forEach((columna) => {
      const titulo = normalizar(
        columna.querySelector(".card-title")?.textContent || "",
      );
      const catTexto = normalizar(
        columna.querySelector(".card-text")?.textContent || "",
      );
      const fotoDiv = columna.querySelector(".foto");
      const coincideCat =
        categoriaElegida === "" ||
        (fotoDiv && fotoDiv.classList.contains(`c-${categoriaElegida}`));

      const coincideTexto =
        textoBuscado === "" ||
        titulo.includes(textoBuscado) ||
        catTexto.includes(textoBuscado);

      if (coincideCat && coincideTexto) {
        columna.classList.remove("d-none");
        visibles++;
      } else {
        columna.classList.add("d-none");
      }
    });

    contadorTexto.textContent =
      visibles === 1
        ? "1 producto"
        : visibles === 0
          ? "No se encontraron productos con esos filtros"
          : `${visibles} productos`;

    return visibles;
  }

  // La búsqueda se hace solo al presionar "Buscar"
  formBusqueda.addEventListener("submit", (e) => {
    e.preventDefault();

    const texto = inputBusqueda.value.trim();

    if (texto.length === 1) {
      alert("Escribe al menos 2 caracteres.");
    } else if (texto.length > 50) {
      alert("Máximo 50 caracteres.");
    } else if (!tieneCaracteresValidos(texto)) {
      alert("No se permiten caracteres especiales.");
    } else {
      const visibles = filtrarCatalogo();

      // Muestra en pantalla lo que escribió el usuario
      if (texto !== "") {
        contadorTexto.textContent += ` · Búsqueda: "${texto}"`;
      }

      if (visibles === 0) {
        alert("No se encontraron productos con ese criterio.");
      }
    }
  });

  // Botón Limpiar: borra el texto y la categoría y muestra todos los productos
  btnLimpiar.addEventListener("click", () => {
    inputBusqueda.value = "";
    selectCategoria.value = "";
    filtrarCatalogo();
  });

  // Abrir el detalle al hacer clic en cualquier parte de la tarjeta del producto
  document.querySelectorAll(".card.prod").forEach((tarjeta) => {
    tarjeta.style.cursor = "pointer";

    tarjeta.addEventListener("click", (e) => {
      // Si el clic fue en el botón «Ver más», Bootstrap ya abre la ventana
      if (e.target.closest('[data-bs-toggle="modal"]')) return;

      const btnDetalle = tarjeta.querySelector("[data-bs-target]");
      if (!btnDetalle) return;

      const modalEl = document.querySelector(
        btnDetalle.getAttribute("data-bs-target"),
      );
      if (modalEl) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
      }
    });
  });

  // Filtros que llegan por la URL (por ejemplo desde el inicio): ?cat=ELE&q=...
  const params = new URLSearchParams(window.location.search);
  if (params.has("cat")) {
    selectCategoria.value = params.get("cat").toUpperCase();
  }
  if (params.has("q")) {
    inputBusqueda.value = params.get("q");
  }
  if (params.has("cat") || params.has("q")) {
    filtrarCatalogo();
  }
});
