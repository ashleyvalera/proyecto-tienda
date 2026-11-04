/* ============================================================
   La casita de Mathi · Catálogos e interacciones
   ============================================================ */

/* Cambia aquí tu número de WhatsApp: solo dígitos, con código de país. */
const NUMERO_WHATSAPP = "51986983274";
const MENSAJE_WHATSAPP_PREDETERMINADO =
  "Hola, vengo de la página web. Quisiera información sobre sus productos.";
const ES_DISPOSITIVO_MOVIL =
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const PRECIO_FUNDA_COMERCIAL = 35;
const PRECIO_MICA = 10;

const TIPOS_FUNDA = {
  transparente: "Transparente",
  color: "Color entero",
  diseno: "Con diseño",
};

/* Modelos comerciales disponibles. Cada modelo genera una tarjeta por tipo. */
const FUNDAS_COMERCIALES = [
  { marca: "Samsung", modelo: "Galaxy A54" },
  { marca: "Motorola", modelo: "Moto G54" },
  { marca: "Xiaomi", modelo: "Redmi Note 13" },
];

const CATEGORIAS_ACCESORIO = {
  protectores: "Protectores",
  cables: "Cables",
  cargadores: "Cargadores",
  audifonos: "Audífonos",
};

const CATEGORIAS_CON_TIPOS = ["audifonos"];

const ACCESORIOS = [
  {
    categoria: "protectores",
    tipo: "Pantalla templada",
    nombre: "Protector de pantalla templado",
    precio: 20,
    imagen: "protector-pantalla",
    respaldo: "protector",
  },
  {
    categoria: "protectores",
    tipo: "Cámara",
    nombre: "Protector de cámara",
    precio: 20,
    imagen: "protector-camara",
    respaldo: "protector-camara",
  },
  {
    categoria: "cables",
    tipo: "V8 / Micro USB",
    nombre: "Cable V8 / Micro USB",
    precio: 20,
    imagen: "cable-v8",
    respaldo: "cable-micro",
  },
  {
    categoria: "cables",
    tipo: "USB-A a USB-C",
    nombre: "Cable USB-A a USB-C",
    precio: 20,
    imagen: "cable-usb-a-usb-c",
    respaldo: "cable-usb",
  },
  {
    categoria: "cables",
    tipo: "USB-C a USB-C",
    nombre: "Cable USB-C a USB-C",
    precio: 20,
    imagen: "cable-usb-c-usb-c",
    respaldo: "cable-usb-c",
  },
  {
    categoria: "cables",
    tipo: "USB-A a Lightning",
    nombre: "Cable USB-A a Lightning",
    precio: 20,
    imagen: "cable-usb-a-lightning",
    respaldo: "cable-lightning",
  },
  {
    categoria: "cables",
    tipo: "USB-C a Lightning",
    nombre: "Cable USB-C a Lightning",
    precio: 20,
    imagen: "cable-usb-c-lightning",
    respaldo: "cable-lightning",
  },
  {
    categoria: "cables",
    tipo: "USB-C a Micro USB",
    nombre: "Cable USB-C a Micro USB",
    precio: 20,
    imagen: "cable-usb-c-micro-usb",
    respaldo: "cable-micro",
  },
  {
    categoria: "cables",
    tipo: "3 en 1",
    nombre: "Cable 3 en 1",
    precio: null,
    imagen: "cable-3-en-1",
    respaldo: "cable-3-en-1",
  },
  {
    categoria: "cargadores",
    tipo: "Cargador de pared",
    nombre: "Cargador rápido USB-C",
    precio: 20,
    imagen: "cargador",
    respaldo: "cargador",
  },
  {
    categoria: "audifonos",
    tipo: "Inalámbricos",
    nombre: "Audífonos inalámbricos",
    precio: null,
    imagen: "audifonos-inalambricos",
    respaldo: "audifonos-inalambricos",
  },
  {
    categoria: "audifonos",
    tipo: "Jack 3.5 mm",
    nombre: "Audífonos jack 3.5 mm",
    precio: 20,
    imagen: "audifonos-jack",
    respaldo: "audifonos-cable",
  },
  {
    categoria: "audifonos",
    tipo: "USB-C",
    nombre: "Audífonos USB-C",
    precio: 20,
    imagen: "audifonos-usb-c",
    respaldo: "audifonos-cable",
  },
  {
    categoria: "audifonos",
    tipo: "Lightning",
    nombre: "Audífonos Lightning",
    precio: 20,
    imagen: "audifonos-lightning",
    respaldo: "audifonos-cable",
  },
];

function crearUrlWhatsApp(texto) {
  return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
}

function crearUrlWhatsAppWeb(texto) {
  return `https://web.whatsapp.com/send?phone=${NUMERO_WHATSAPP}&text=${encodeURIComponent(texto)}`;
}

function crearUrlQrWhatsApp(texto) {
  const url = crearUrlWhatsApp(texto);
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(url)}`;
}

let dialogoWhatsApp = null;

function obtenerDialogoWhatsApp() {
  if (dialogoWhatsApp) {
    return dialogoWhatsApp;
  }

  const dialogo = document.createElement("dialog");
  dialogo.className = "whatsapp-dialogo";
  dialogo.setAttribute("aria-labelledby", "whatsapp-dialogo-titulo");
  dialogo.innerHTML = `
    <div class="whatsapp-dialogo-panel">
      <button type="button" class="whatsapp-dialogo-cerrar" aria-label="Cerrar">&times;</button>
      <p class="eyebrow"><span aria-hidden="true"></span> Pedido por WhatsApp</p>
      <h2 id="whatsapp-dialogo-titulo">Abre el chat desde tu celular</h2>
      <p class="whatsapp-dialogo-texto">Escanea este código QR con la cámara de tu celular para escribirnos.</p>
      <div class="whatsapp-qr-marco">
        <img class="whatsapp-qr" src="img/whatsapp-qr.svg" alt="Código QR para abrir el chat de WhatsApp" width="260" height="260">
      </div>
      <p class="whatsapp-dialogo-nota">¿Estás en esta computadora y ya iniciaste sesión en WhatsApp Web?</p>
      <a class="boton boton--verde boton--ancho whatsapp-dialogo-web" href="#" target="_blank" rel="noopener noreferrer">Abrir WhatsApp Web</a>
      <p class="whatsapp-dialogo-numero">También puedes escribirnos al <strong>+51 986 983 274</strong>.</p>
    </div>
  `;

  const cerrar = dialogo.querySelector(".whatsapp-dialogo-cerrar");
  const qr = dialogo.querySelector(".whatsapp-qr");
  const enlaceWeb = dialogo.querySelector(".whatsapp-dialogo-web");

  cerrar.addEventListener("click", () => dialogo.close());
  enlaceWeb.addEventListener("click", () => dialogo.close());
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) {
      dialogo.close();
    }
  });

  document.body.appendChild(dialogo);
  dialogoWhatsApp = { dialogo, qr, enlaceWeb };
  return dialogoWhatsApp;
}

function abrirDialogoWhatsApp(mensaje) {
  const { dialogo, qr, enlaceWeb } = obtenerDialogoWhatsApp();

  qr.onerror = () => {
    qr.onerror = null;
    qr.src = "img/whatsapp-qr.svg";
  };
  qr.src = crearUrlQrWhatsApp(mensaje);
  enlaceWeb.href = crearUrlWhatsAppWeb(mensaje);

  if (!dialogo.open) {
    dialogo.showModal();
  }
}

function crearEnlaceWhatsApp(texto, etiqueta) {
  const enlace = document.createElement("a");
  enlace.className = "boton-producto";
  enlace.href = crearUrlWhatsApp(texto);
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  enlace.textContent = etiqueta;
  enlace.dataset.whatsapp = "";
  enlace.dataset.mensajeWhatsApp = texto;
  return enlace;
}

function crearSlug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function crearImagenProducto({ imagen, respaldo, alt }) {
  const foto = document.createElement("img");
  const rutas = [
    `img/productos/${imagen}.webp`,
    `img/productos/${imagen}.jpg`,
    `img/productos/${imagen}.png`,
    `img/productos/${respaldo}.svg`,
  ];

  foto.className = "producto-foto";
  foto.alt = alt;
  foto.width = 400;
  foto.height = 500;
  foto.loading = "lazy";
  foto.decoding = "async";

  let intento = 0;

  foto.addEventListener("error", () => {
    intento += 1;

    if (intento < rutas.length) {
      foto.src = rutas[intento];
      return;
    }

    foto.removeAttribute("src");
    foto.alt = "";
    foto.classList.add("producto-foto--vacia");
  });

  foto.src = rutas[0];
  return foto;
}

function crearMensajeFunda(funda, tipo, conMica) {
  const tipoTexto = TIPOS_FUNDA[tipo].toLowerCase();
  const total = PRECIO_FUNDA_COMERCIAL + (conMica ? PRECIO_MICA : 0);
  const detalleMica = conMica
    ? `con mica de vidrio (S/ ${PRECIO_MICA} adicionales)`
    : "sin mica";

  return `Hola, quiero una funda ${tipoTexto} para ${funda.marca} ${funda.modelo}, ${detalleMica}. Total: S/ ${total}.`;
}

function crearTarjetaFunda(funda, tipo) {
  const articulo = document.createElement("article");
  articulo.className = "producto funda-card";
  articulo.dataset.marca = funda.marca;
  articulo.dataset.modelo = funda.modelo;
  articulo.dataset.tipo = tipo;

  const media = document.createElement("div");
  media.className = `producto-media producto-media--${tipo}`;

  const imagen = crearImagenProducto({
    imagen: `funda-${crearSlug(funda.marca)}-${crearSlug(funda.modelo)}-${tipo}`,
    respaldo: `funda-${tipo}`,
    alt: `Funda ${TIPOS_FUNDA[tipo].toLowerCase()} para ${funda.marca} ${funda.modelo}`,
  });

  const badge = document.createElement("span");
  badge.className = "producto-badge";
  badge.textContent = TIPOS_FUNDA[tipo];

  media.append(imagen, badge);

  const cuerpo = document.createElement("div");
  cuerpo.className = "producto-cuerpo";

  const categoria = document.createElement("p");
  categoria.className = "producto-categoria";
  categoria.textContent = `Funda ${TIPOS_FUNDA[tipo].toLowerCase()}`;

  const nombre = document.createElement("h3");
  nombre.className = "producto-nombre";
  nombre.textContent = `${funda.marca} ${funda.modelo}`;

  const precio = document.createElement("p");
  precio.className = "producto-precio";
  precio.textContent = `S/ ${PRECIO_FUNDA_COMERCIAL}`;

  const etiquetaMica = document.createElement("label");
  etiquetaMica.className = "funda-extra";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "funda-mica";

  const textoMica = document.createElement("span");
  textoMica.innerHTML = `Agregar mica de vidrio <strong>+ S/ ${PRECIO_MICA}</strong>`;

  etiquetaMica.append(checkbox, textoMica);

  const enlace = crearEnlaceWhatsApp(
    crearMensajeFunda(funda, tipo, false),
    "Pedir por WhatsApp"
  );
  enlace.dataset.fundaWhatsapp = "";
  enlace.setAttribute(
    "aria-label",
    `Pedir funda ${TIPOS_FUNDA[tipo].toLowerCase()} para ${funda.marca} ${funda.modelo} por WhatsApp`
  );

  cuerpo.append(categoria, nombre, precio, etiquetaMica, enlace);
  articulo.append(media, cuerpo);
  return articulo;
}

function crearOpcion(valor, texto) {
  const opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = texto;
  return opcion;
}

function iniciarFundasComerciales() {
  const contenedor = document.getElementById("fundas-comerciales");
  const selectMarca = document.getElementById("filtro-marca");
  const selectModelo = document.getElementById("filtro-modelo");
  const selectTipo = document.getElementById("filtro-tipo");

  if (!contenedor || !selectMarca || !selectModelo || !selectTipo) {
    return;
  }

  const tarjetas = [];

  FUNDAS_COMERCIALES.forEach((funda) => {
    Object.keys(TIPOS_FUNDA).forEach((tipo) => {
      const tarjeta = crearTarjetaFunda(funda, tipo);
      tarjetas.push(tarjeta);
      contenedor.appendChild(tarjeta);
    });
  });

  const estadoVacio = document.createElement("div");
  estadoVacio.className = "fundas-vacio";
  estadoVacio.hidden = true;

  const textoVacio = document.createElement("p");
  textoVacio.textContent =
    "No encontramos esa combinación. Escríbenos y te ayudamos a conseguirla.";

  const enlaceVacio = crearEnlaceWhatsApp(
    "Hola, quiero consultar por una funda.",
    "Consultar por WhatsApp"
  );

  estadoVacio.append(textoVacio, enlaceVacio);
  contenedor.appendChild(estadoVacio);

  const marcas = [...new Set(FUNDAS_COMERCIALES.map((funda) => funda.marca))];
  marcas.forEach((marca) => {
    selectMarca.appendChild(crearOpcion(marca, marca));
  });

  function actualizarModelos() {
    const marca = selectMarca.value;
    const modelos = FUNDAS_COMERCIALES
      .filter((funda) => !marca || funda.marca === marca)
      .map((funda) => funda.modelo);
    const modeloActual = selectModelo.value;

    selectModelo.replaceChildren(crearOpcion("", "Todos los modelos"));
    modelos.forEach((modelo) => {
      selectModelo.appendChild(crearOpcion(modelo, modelo));
    });

    if (modelos.includes(modeloActual)) {
      selectModelo.value = modeloActual;
    }
  }

  function filtrarFundas() {
    const marca = selectMarca.value;
    const modelo = selectModelo.value;
    const tipo = selectTipo.value;
    let visibles = 0;

    tarjetas.forEach((tarjeta) => {
      const coincide =
        (!marca || tarjeta.dataset.marca === marca) &&
        (!modelo || tarjeta.dataset.modelo === modelo) &&
        (!tipo || tarjeta.dataset.tipo === tipo);

      tarjeta.hidden = !coincide;

      if (coincide) {
        visibles += 1;
      }
    });

    estadoVacio.hidden = visibles > 0;

    if (visibles === 0) {
      const detalles = [];
      if (marca) detalles.push(marca);
      if (modelo) detalles.push(modelo);
      if (tipo) detalles.push(`funda ${TIPOS_FUNDA[tipo].toLowerCase()}`);

      const referencia = detalles.length
        ? ` para ${detalles.join(" ")}`
        : "";
      enlaceVacio.href = crearUrlWhatsApp(
        `Hola, no encontré una funda${referencia} en la página. ¿Me pueden ayudar?`
      );
    }
  }

  selectMarca.addEventListener("change", () => {
    actualizarModelos();
    filtrarFundas();
  });

  selectModelo.addEventListener("change", filtrarFundas);
  selectTipo.addEventListener("change", filtrarFundas);

  contenedor.addEventListener("change", (evento) => {
    if (!evento.target.classList.contains("funda-mica")) {
      return;
    }

    const tarjeta = evento.target.closest(".funda-card");
    const enlace = tarjeta?.querySelector("[data-funda-whatsapp]");

    if (!tarjeta || !enlace) {
      return;
    }

    enlace.href = crearUrlWhatsApp(
      crearMensajeFunda(
        {
          marca: tarjeta.dataset.marca,
          modelo: tarjeta.dataset.modelo,
        },
        tarjeta.dataset.tipo,
        evento.target.checked
      )
    );
  });

  actualizarModelos();
  filtrarFundas();
}

function crearMensajeAccesorio(accesorio) {
  const precio = accesorio.precio === null
    ? "Quiero consultar el precio."
    : `Precio: S/ ${accesorio.precio}.`;

  return `Hola, me interesa ${accesorio.nombre}. ${precio}`;
}

function crearTarjetaAccesorio(accesorio) {
  const articulo = document.createElement("article");
  articulo.className = "producto accesorio-card";
  articulo.dataset.categoria = accesorio.categoria;
  articulo.dataset.tipo = accesorio.tipo;

  const media = document.createElement("div");
  media.className = `producto-media producto-media--${accesorio.categoria}`;

  const imagen = crearImagenProducto({
    imagen: accesorio.imagen,
    respaldo: accesorio.respaldo,
    alt: accesorio.nombre,
  });

  const badge = document.createElement("span");
  badge.className = "producto-badge";
  badge.textContent = CATEGORIAS_ACCESORIO[accesorio.categoria];

  media.append(imagen, badge);

  const cuerpo = document.createElement("div");
  cuerpo.className = "producto-cuerpo";

  const categoria = document.createElement("p");
  categoria.className = "producto-categoria";
  categoria.textContent = accesorio.tipo;

  const nombre = document.createElement("h3");
  nombre.className = "producto-nombre";
  nombre.textContent = accesorio.nombre;

  const precio = document.createElement("p");
  precio.className = "producto-precio";
  precio.textContent = accesorio.precio === null
    ? "Consultar"
    : `S/ ${accesorio.precio}`;

  const enlace = crearEnlaceWhatsApp(
    crearMensajeAccesorio(accesorio),
    "Pedir por WhatsApp"
  );
  enlace.setAttribute(
    "aria-label",
    `Pedir ${accesorio.nombre} por WhatsApp`
  );

  cuerpo.append(categoria, nombre, precio, enlace);
  articulo.append(media, cuerpo);
  return articulo;
}

function iniciarAccesorios() {
  const contenedor = document.getElementById("accesorios-grid");
  const filtros = document.querySelectorAll('input[name="filtro-productos"]');
  const contenedorTipo = document.getElementById("contenedor-tipo-accesorio");
  const selectTipo = document.getElementById("filtro-tipo-accesorio");

  if (!contenedor || !filtros.length || !contenedorTipo || !selectTipo) {
    return;
  }

  const tarjetas = ACCESORIOS
    .filter((accesorio) => accesorio.categoria !== "cables")
    .map((accesorio) => {
      const tarjeta = crearTarjetaAccesorio(accesorio);
      contenedor.appendChild(tarjeta);
      return tarjeta;
    });

  const estadoVacio = document.createElement("div");
  estadoVacio.className = "accesorios-vacio";
  estadoVacio.hidden = true;

  const textoVacio = document.createElement("p");
  textoVacio.textContent =
    "No encontramos esa combinación. Escríbenos y te ayudamos a conseguirla.";

  const enlaceVacio = crearEnlaceWhatsApp(
    "Hola, quiero consultar por un accesorio.",
    "Consultar por WhatsApp"
  );

  estadoVacio.append(textoVacio, enlaceVacio);
  contenedor.appendChild(estadoVacio);

  function categoriaSeleccionada() {
    const filtroActivo = document.querySelector(
      'input[name="filtro-productos"]:checked'
    );
    return filtroActivo?.value || "todos";
  }

  function actualizarTipos(reset) {
    const categoria = categoriaSeleccionada();
    const tipoActual = selectTipo.value;

    if (!CATEGORIAS_CON_TIPOS.includes(categoria)) {
      contenedorTipo.hidden = true;
      selectTipo.replaceChildren(crearOpcion("", "Todos los tipos"));
      return;
    }

    const tipos = [
      ...new Set(
        ACCESORIOS
          .filter((accesorio) => accesorio.categoria === categoria)
          .map((accesorio) => accesorio.tipo)
      ),
    ];

    contenedorTipo.hidden = false;
    selectTipo.replaceChildren(crearOpcion("", "Todos los tipos"));

    tipos.forEach((tipo) => {
      selectTipo.appendChild(crearOpcion(tipo, tipo));
    });

    if (!reset && tipos.includes(tipoActual)) {
      selectTipo.value = tipoActual;
    }
  }

  function filtrarAccesorios() {
    const categoria = categoriaSeleccionada();
    const tipo = selectTipo.value;
    let visibles = 0;

    tarjetas.forEach((tarjeta) => {
      const coincideCategoria =
        categoria === "todos" || tarjeta.dataset.categoria === categoria;
      const coincideTipo = !tipo || tarjeta.dataset.tipo === tipo;
      const coincide = coincideCategoria && coincideTipo;

      tarjeta.hidden = !coincide;

      if (coincide) {
        visibles += 1;
      }
    });

    estadoVacio.hidden = visibles > 0;

    if (visibles === 0) {
      const nombreCategoria = categoria === "todos"
        ? "accesorios"
        : CATEGORIAS_ACCESORIO[categoria].toLowerCase();
      const detalleTipo = tipo ? ` de tipo ${tipo}` : "";

      enlaceVacio.href = crearUrlWhatsApp(
        `Hola, no encontré ${nombreCategoria}${detalleTipo} en la página. ¿Me pueden ayudar?`
      );
    }
  }

  filtros.forEach((filtro) => {
    filtro.addEventListener("change", () => {
      actualizarTipos(true);
      filtrarAccesorios();
    });
  });

  selectTipo.addEventListener("change", filtrarAccesorios);

  actualizarTipos(false);
  filtrarAccesorios();
}

function iniciarCables() {
  const contenedor = document.getElementById("cables-grid");

  if (!contenedor) {
    return;
  }

  ACCESORIOS
    .filter((accesorio) => accesorio.categoria === "cables")
    .forEach((cable) => {
      contenedor.appendChild(crearTarjetaAccesorio(cable));
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const enlacesWhatsApp = document.querySelectorAll("[data-whatsapp]");

  enlacesWhatsApp.forEach((enlace) => {
    enlace.href = crearUrlWhatsApp(MENSAJE_WHATSAPP_PREDETERMINADO);
  });

  document.addEventListener("click", (evento) => {
    if (ES_DISPOSITIVO_MOVIL) {
      return;
    }

    const enlace = evento.target.closest("a[data-whatsapp]");

    if (
      !enlace ||
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey
    ) {
      return;
    }

    evento.preventDefault();
    abrirDialogoWhatsApp(
      enlace.dataset.mensajeWhatsApp || MENSAJE_WHATSAPP_PREDETERMINADO
    );
  });

  iniciarFundasComerciales();
  iniciarAccesorios();
  iniciarCables();

  const formulario = document.getElementById("formulario-whatsapp");

  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const modelo = document.getElementById("modelo").value.trim();
      const mensaje = document.getElementById("mensaje").value.trim();

      const texto =
        `Hola, soy ${nombre}.\n` +
        `Modelo de celular: ${modelo}.\n` +
        `Mensaje: ${mensaje}`;

      if (ES_DISPOSITIVO_MOVIL) {
        const enlaceTemporal = document.createElement("a");
        enlaceTemporal.href = crearUrlWhatsApp(texto);
        enlaceTemporal.target = "_blank";
        enlaceTemporal.rel = "noopener noreferrer";
        document.body.appendChild(enlaceTemporal);
        enlaceTemporal.click();
        enlaceTemporal.remove();
      } else {
        abrirDialogoWhatsApp(texto);
      }

      formulario.reset();
    });
  }
});
