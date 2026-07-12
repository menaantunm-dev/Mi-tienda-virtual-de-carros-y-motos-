// ==========================================
// DATASET INTEGRADO DIRECTAMENTE DESDE INTERNET
// ==========================================
let datasetVehiculos = [
    {
        "codigo": 101,
        "marca": "Lamborghini",
        "modelo": "Aventador SVJ",
        "categoria": "Hypercar",
        "motor": "V12 6.5L",
        "combustible": "Gasolina",
        "caracteristicas": "Tracción integral, 770 CV, carrocería monocasco de fibra de carbono.",
        "precio_venta": 515000,
        "precio_alquiler_dia": 2500,
        "precio_alquiler_hora": 350,
        "oferta_alquiler": "Destacado",
        "imagen": "https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=600"
    },
    {
        "codigo": 102,
        "marca": "Ferrari",
        "modelo": "812 Superfast",
        "categoria": "Superdeportivo",
        "motor": "V12 6.5L",
        "combustible": "Gasolina",
        "caracteristicas": "800 CV de potencia pura, transmisión de doble embrague de 7 velocidades.",
        "precio_venta": 365000,
        "precio_alquiler_dia": 1900,
        "precio_alquiler_hora": 240,
        "oferta_alquiler": null,
        "imagen": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=600"
    },
    {
        "codigo": 103,
        "marca": "Porsche",
        "modelo": "911 Turbo S",
        "categoria": "Deportivo de Lujo",
        "motor": "Boxer 6 cil Twin-Turbo",
        "combustible": "Gasolina",
        "caracteristicas": "0 a 100 km/h en 2.7 segundos, estabilidad dinámica extrema.",
        "precio_venta": 230000,
        "precio_alquiler_dia": 1200,
        "precio_alquiler_hora": 150,
        "oferta_alquiler": "Popular",
        "imagen": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600"
    }
];

let datasetMotos = [
    {
        "codigo": 201,
        "marca": "Ducati",
        "modelo": "Panigale V4 R",
        "categoria": "Superbike",
        "motor": "Desmosedici Stradale V4",
        "combustible": "Gasolina",
        "caracteristicas": "221 CV de potencia de competición, telemetría GPS integrada.",
        "precio_venta": 45000,
        "precio_alquiler_dia": 450,
        "precio_alquiler_hora": 60,
        "oferta_alquiler": "Pista Ed.",
        "imagen": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=600"
    },
    {
        "codigo": 202,
        "marca": "BMW",
        "modelo": "R 1250 GS Adventure",
        "categoria": "Maxi-Trail",
        "motor": "Bóxer de 2 cilindros ShiftCam",
        "combustible": "Gasolina",
        "caracteristicas": "Ideal para trayectos largos y terrenos exigentes, maleteros de aluminio.",
        "precio_venta": 28500,
        "precio_alquiler_dia": 280,
        "precio_alquiler_hora": 40,
        "oferta_alquiler": null,
        "imagen": "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=600"
    }
];

let carritoInversiones = [];
let bsRentModal = null;
let bsImageModal = null;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    bsRentModal = new bootstrap.Modal(document.getElementById('rentModal'));
    bsImageModal = new bootstrap.Modal(document.getElementById('imageModal'));

    renderCatalog(datasetVehiculos, "contenedor-vehiculos", "car");
    renderCatalog(datasetMotos, "contenedor-motos", "motorcycle");

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const termino = e.target.value.toLowerCase().trim();
            filtrarYRenderizar(termino);
        });
    }

    configurarEventosRenta();
});

// ==========================================
// RENDERIZADO VISUAL EN EL DOM
// ==========================================
function renderCatalog(items, containerId, type) {
    const contenedor = document.getElementById(containerId);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (items.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted small"><i class="fa-solid fa-triangle-exclamation me-2"></i>No se encontraron activos.</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        const cardCol = document.createElement("div");
        cardCol.className = "col-12 col-md-6 col-lg-4 d-flex align-items-stretch";
        
        cardCol.innerHTML = `
            <div class="card premium-card h-100 w-100 position-relative">
                ${item.oferta_alquiler ? `<div class="offer-badge">${item.oferta_alquiler}</div>` : ''}
                <div class="card-img-wrapper" onclick="openImageModal('${item.imagen}')" title="Clic para expandir">
                    <img src="${item.imagen}" class="card-img-top" alt="${item.marca} ${item.modelo}">
                </div>
                <div class="card-body d-flex flex-column p-4">
                    <div class="mb-2">
                        <span class="category-tag">${item.categoria}</span>
                    </div>
                    <h5 class="card-title fw-bold text-white mb-1">
                        ${item.marca} <span class="text-secondary fw-normal" style="font-size: 15px;">${item.modelo}</span>
                    </h5>
                    <p class="text-muted small mb-3">Cod: ${item.codigo} | ${item.motor} | ${item.combustible}</p>
                    
                    <ul class="list-unstyled price-matrix p-3 my-3 text-start small text-light opacity-90">
                        <li class="d-flex justify-content-between mb-1">
                            <span class="text-white-50">Venta Privada:</span> 
                            <span class="text-success fw-bold" style="font-size:15px;">$${item.precio_venta.toLocaleString()} USD</span>
                        </li>
                        <li class="d-flex justify-content-between mb-1">
                            <span class="text-white-50">Renta Diaria:</span> 
                            <span class="text-info fw-bold">$${item.precio_alquiler_dia} USD</span>
                        </li>
                        <li class="d-flex justify-content-between">
                            <span class="text-white-50">Renta por Hora:</span> 
                            <span class="text-warning fw-bold">$${item.precio_alquiler_hora} USD</span>
                        </li>
                    </ul>

                    <div class="row g-2 mt-auto">
                        <div class="col-6">
                            <button class="btn btn-rent w-100 py-2 small" onclick="openRentConfigModal(${item.codigo}, '${type}')">Alquilar</button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-buy w-100 py-2 small" onclick="addToCartBuy(${item.codigo}, '${type}')">Comprar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(cardCol);
    });
}

// ==========================================
// FILTRADO DINÁMICO
// ==========================================
function filtrarYRenderizar(termino) {
    const filtrar = (lista) => lista.filter(item => 
        item.marca.toLowerCase().includes(termino) || 
        item.modelo.toLowerCase().includes(termino) ||
        item.categoria.toLowerCase().includes(termino) ||
        item.codigo.toString().includes(termino)
    );

    renderCatalog(filtrar(datasetVehiculos), "contenedor-vehiculos", "car");
    renderCatalog(filtrar(datasetMotos), "contenedor-motos", "motorcycle");
}

// ==========================================
// ACCIONES MODALES Y CARRITO
// ==========================================
function openImageModal(rutaImagen) {
    const targetImg = document.getElementById("expandedModalImage");
    if (targetImg) {
        targetImg.src = rutaImagen;
        bsImageModal.show();
    }
}

function addToCartBuy(codigo, type) {
    const pool = (type === 'car') ? datasetVehiculos : datasetMotos;
    const activo = pool.find(i => i.codigo === codigo);

    if (!activo) return;

    const existe = carritoInversiones.find(i => i.codigo === codigo && i.modalidad === 'Compra');
    if (existe) {
        Swal.fire({
            icon: 'info',
            title: 'Línea de Pedido Activa',
            text: 'Este activo ya está configurado en tu orden bajo compra.',
            confirmButtonColor: '#ff4b8b'
        });
        return;
    }

    carritoInversiones.push({
        codigo: activo.codigo,
        marca: activo.marca,
        modelo: activo.modelo,
        imagen: activo.imagen,
        modalidad: 'Compra',
        detalle: 'Adquisición de Activo Privado',
        subtotal: activo.precio_venta
    });

    actualizarInterfazCarrito();
    
    Swal.fire({
        icon: 'success',
        title: 'Agregado al Carrito',
        text: `${activo.marca} agregado para adquisición comercial.`,
        showConfirmButton: false,
        timer: 1500
    });
}

function openRentConfigModal(codigo, type) {
    const pool = (type === 'car') ? datasetVehiculos : datasetMotos;
    const activo = pool.find(i => i.codigo === codigo);

    if (!activo) return;

    document.getElementById("rentProductCode").value = activo.codigo;
    document.getElementById("rentProductType").value = type;
    document.getElementById("rentDurationType").value = "dia";
    document.getElementById("rentQuantity").value = "1";
    
    recalcularSubtotalRentaModal();
    bsRentModal.show();
}

function configurarEventosRenta() {
    const duracionType = document.getElementById("rentDurationType");
    const cantidadInput = document.getElementById("rentQuantity");
    const confirmBtn = document.getElementById("confirmRentBtn");

    if (duracionType && cantidadInput) {
        duracionType.addEventListener("change", () => {
            const label = document.getElementById("rentQuantityLabel");
            label.textContent = (duracionType.value === 'dia') ? "Cantidad de Días" : "Cantidad de Horas";
            recalcularSubtotalRentaModal();
        });
        cantidadInput.addEventListener("input", recalcularSubtotalRentaModal);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", procesarInsercionRenta);
    }
}

function recalcularSubtotalRentaModal() {
    const codigo = parseInt(document.getElementById("rentProductCode").value);
    const type = document.getElementById("rentProductType").value;
    const modo = document.getElementById("rentDurationType").value;
    const cantidad = parseInt(document.getElementById("rentQuantity").value) || 1;

    const pool = (type === 'car') ? datasetVehiculos : datasetMotos;
    const activo = pool.find(i => i.codigo === codigo);

    if (!activo) return;

    const precioUnidad = (modo === 'dia') ? activo.precio_alquiler_dia : activo.precio_alquiler_hora;
    const subtotalCalculado = precioUnidad * cantidad;

    document.getElementById("rentCalculatedPrice").textContent = `$${subtotalCalculado.toLocaleString()} USD`;
}

function procesarInsercionRenta() {
    const codigo = parseInt(document.getElementById("rentProductCode").value);
    const type = document.getElementById("rentProductType").value;
    const modo = document.getElementById("rentDurationType").value;
    const cantidad = parseInt(document.getElementById("rentQuantity").value) || 1;

    const pool = (type === 'car') ? datasetVehiculos : datasetMotos;
    const activo = pool.find(i => i.codigo === codigo);

    if (!activo) return;

    const precioUnidad = (modo === 'dia') ? activo.precio_alquiler_dia : activo.precio_alquiler_hora;
    const subtotalCalculado = precioUnidad * cantidad;
    const stringDetalle = (modo === 'dia') ? `Renta Temporal por (${cantidad}) Días` : `Renta Temporal por (${cantidad}) Horas`;

    carritoInversiones.push({
        codigo: activo.codigo,
        marca: activo.marca,
        modelo: activo.modelo,
        imagen: activo.imagen,
        modalidad: 'Alquiler',
        detalle: stringDetalle,
        subtotal: subtotalCalculado
    });

    actualizarInterfazCarrito();
    bsRentModal.hide();

    Swal.fire({
        icon: 'success',
        title: 'Contrato Vinculado',
        text: 'La orden de arrendamiento temporal fue añadida con éxito.',
        showConfirmButton: false,
        timer: 1500
    });
}

function actualizarInterfazCarrito() {
    const badge = document.getElementById("cartCountBadge");
    if (badge) badge.textContent = carritoInversiones.length;

    const tablaCuerpo = document.getElementById("cartTableBody");
    if (!tablaCuerpo) return;

    tablaCuerpo.innerHTML = "";
    let totalAcumulado = 0;

    if (carritoInversiones.length === 0) {
        tablaCuerpo.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-muted small">
                    <i class="fa-solid fa-folder-open d-block fs-3 mb-2 opacity-50"></i>
                    No existen líneas de activos registradas.
                </td>
            </tr>
        `;
        document.getElementById("cartTotalGlobal").textContent = "$0 USD";
        return;
    }

    carritoInversiones.forEach((item, index) => {
        totalAcumulado += item.subtotal;
        const fila = document.createElement("tr");
        fila.className = "text-white border-secondary border-opacity-10";
        fila.innerHTML = `
            <td>
                <img src="${item.imagen}" class="rounded" style="width: 55px; height: 38px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);">
            </td>
            <td>
                <div class="fw-bold small text-white">${item.marca} <span class="fw-normal text-muted">${item.modelo}</span></div>
                <div class="text-secondary" style="font-size: 11px;">Cod: ${item.codigo}</div>
            </td>
            <td>
                <span class="badge ${item.modalidad === 'Compra' ? 'bg-success' : 'bg-info text-dark'}" style="font-size:10px;">${item.modalidad}</span>
                <div class="text-muted d-block" style="font-size: 11px;">${item.detalle}</div>
            </td>
            <td class="text-end fw-bold text-light small">$${item.subtotal.toLocaleString()} USD</td>
            <td class="text-center">
                <button class="btn btn-link btn-sm text-danger p-0 align-middle" onclick="eliminarLineaCarrito(${index})">
                    <i class="fa-solid fa-trash-can fs-6"></i>
                </button>
            </td>
        `;
        tablaCuerpo.appendChild(fila);
    });

    document.getElementById("cartTotalGlobal").textContent = `$${totalAcumulado.toLocaleString()} USD`;
}

function eliminarLineaCarrito(index) {
    carritoInversiones.splice(index, 1);
    actualizarInterfazCarrito();
}

// ==========================================
// EXPORTACIÓN A DOCUMENTO PDF
// ==========================================
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (carritoInversiones.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Instrumento Vacío',
            text: 'Ingrese al menos un activo antes de procesar el cierre formal.',
            confirmButtonColor: '#ff4b8b'
        });
        return;
    }

    const cliente = document.getElementById("customerName").value.trim();
    const metodo = document.getElementById("paymentMethod").value;
    const fecha = document.getElementById("deliveryDate").value;

    if (!cliente || !metodo || !fecha) {
        Swal.fire({
            icon: 'warning',
            title: 'Validación Fallida',
            text: 'Por favor complete todos los campos mandatorios contractuales (*).',
            confirmButtonColor: '#ff4b8b'
        });
        return;
    }

    ejecutarExportacionPDF(cliente, metodo, fecha);
});

function ejecutarExportacionPDF(cliente, metodo, fecha) {
    let subtotalDocumento = 0;
    let tablaHTMLFilas = carritoInversiones.map(item => {
        subtotalDocumento += item.subtotal;
        return `
            <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px; font-size: 11px;">${item.codigo}</td>
                <td style="padding: 10px; font-size: 11px;"><b>${item.marca}</b> ${item.modelo}</td>
                <td style="padding: 10px; font-size: 11px;">${item.modalidad}</td>
                <td style="padding: 10px; font-size: 11px; color:#4a5568;">${item.detalle}</td>
                <td style="padding: 10px; font-size: 11px; text-align: right; font-weight: bold;">$${item.subtotal.toLocaleString()} USD</td>
            </tr>
        `;
    }).join('');

    const elementoContenedorPDF = document.createElement("div");
    elementoContenedorPDF.style.padding = "40px";
    elementoContenedorPDF.style.fontFamily = "'Segoe UI', Helvetica, Arial, sans-serif";
    elementoContenedorPDF.style.color = "#2d3748";
    elementoContenedorPDF.style.backgroundColor = "#ffffff";

    elementoContenedorPDF.innerHTML = `
        <div style="border-bottom: 3px solid #16223b; padding-bottom: 20px; margin-bottom: 30px;">
            <table style="width: 100%;">
                <tr>
                    <td>
                        <h1 style="margin: 0; color: #16223b; font-size: 24px; text-transform: uppercase; font-weight: 800;">Luxury Motors Elite Corp</h1>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #718096;">Instrumento de Control Operativo y Cotización Formal</p>
                    </td>
                    <td style="text-align: right; vertical-align: top;">
                        <span style="background-color: #ff4b8b; color: white; padding: 5px 12px; font-size: 10px; font-weight: bold; border-radius: 4px; text-transform: uppercase;">Aprobado</span>
                    </td>
                </tr>
            </table>
        </div>

        <div style="margin-bottom: 25px; background-color: #f7fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #2b6cb0;">Parámetros del Titular Comercial</h3>
            <table style="width: 100%; font-size: 12px; line-height: 1.6;">
                <tr><td style="width: 35%; color: #718096;">Titular de la Orden:</td><td><b>${cliente}</b></td></tr>
                <tr><td style="color: #718096;">Canal Financiero Certificado:</td><td>${metodo}</td></tr>
                <tr><td style="color: #718096;">Fecha de Recepción / Retiro:</td><td>${fecha}</td></tr>
            </table>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
                <tr style="background-color: #16223b; color: white; text-align: left;">
                    <th style="padding: 10px; font-size: 11px;">Cód</th>
                    <th style="padding: 10px; font-size: 11px;">Activo Comprometido</th>
                    <th style="padding: 10px; font-size: 11px;">Modalidad</th>
                    <th style="padding: 10px; font-size: 11px;">Términos Específicos</th>
                    <th style="padding: 10px; font-size: 11px; text-align: right;">Subtotal</th>
                </tr>
            </thead>
            <tbody>${tablaHTMLFilas}</tbody>
        </table>

        <div style="text-align: right; margin-bottom: 50px;">
            <table style="margin-left: auto; width: 40%; border-top: 2px solid #16223b; font-size: 14px;">
                <tr>
                    <td style="padding: 10px 0; color: #718096;">Monto Bruto Global:</td>
                    <td style="padding: 10px 0; text-align: right; font-weight: 900; color: #2f855a; font-size: 16px;">$${subtotalDocumento.toLocaleString()} USD</td>
                </tr>
            </table>
        </div>

        <div style="margin-top: 60px; border-top: 1px dashed #cbd5e0; padding-top: 20px; text-align: center; font-size: 11px; color: #a0aec0;">
            <p style="margin: 0; font-weight: bold; color: #4a5568;">Sistemas Core validados por: Ing. María Mercedes Mena — Universidad O&M</p>
            <p style="margin: 4px 0 0 0;">Luxury Motors Elite Corp © 2026.</p>
        </div>
    `;

    const opcionesConfig = {
        margin: 10,
        filename: `Contrato_LuxuryMotors_${cliente.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcionesConfig).from(elementoContenedorPDF).save().then(() => {
        carritoInversiones = [];
        actualizarInterfazCarrito();
        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (modalInstance) modalInstance.hide();

        Swal.fire({
            icon: 'success',
            title: 'Orden Procesada',
            text: 'Se ha generado la documentación oficial en formato PDF.',
            confirmButtonColor: '#ff4b8b'
        });
    });
}