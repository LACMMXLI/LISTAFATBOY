const productosPorCategoria = {
  "Verduras": ["Tomate", "Cebolla", "Lechuga"],
  "Panadería": ["Pan para hot dogs", "Pan para hamburguesa"],
  "Lácteos": ["Queso", "Crema", "Leche"],
  "Carnes": ["Carne molida", "Bistec", "Pechuga de pollo"],
  "Congelados": ["Boneless", "Alitas", "Papas congeladas"],
  "Salchichonería": ["Salchicha", "Jamón", "Tocino"],
  "Desechables": ["Vasos", "Servilletas", "Charolas"],
  "Enlatados": ["Chiles", "Frijoles", "Elotes"],
  "Varios": ["Catsup", "Mostaza", "Salsas"],
  "Limpieza": ["Cloro", "Jabón", "Toallas"]
};

const seleccionados = new Map();
const contenedor = document.getElementById('contenedorProductos');
const listaCarrito = document.getElementById('listaCarrito');
const toast = document.getElementById('toast');
const overlay = document.getElementById('overlay');
const barraBusqueda = document.getElementById('barraBusqueda');
const inputBusqueda = document.getElementById('inputBusqueda');

function filtrarTodo() {
  contenedor.innerHTML = '';
  
  // Crear un elemento de título para cada categoría
  Object.keys(productosPorCategoria).forEach(categoria => {
    const categoriaHeader = document.createElement('div');
    categoriaHeader.className = "mt-6 mb-3 font-bold text-xl border-b border-gray-700 pb-2 text-white";
    categoriaHeader.textContent = categoria;
    contenedor.appendChild(categoriaHeader);
    
    // Mostrar los productos de esta categoría
    productosPorCategoria[categoria].forEach(producto => {
      crearTarjetaProducto(producto);
    });
  });
  
  // Asegurar que se quite el indicador de filtro activo
  document.body.classList.remove('filtro-activo');
}

function crearTarjetaProducto(producto) {
  const card = document.createElement('div');
  card.className = "product-card flex items-center justify-between bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700 cursor-pointer";
  const contenido = document.createElement('div');
  contenido.className = "flex items-center space-x-4 flex-1";
  const icono = document.createElement('div');
  icono.className = "text-2xl";
  icono.textContent = '📦';
  const nombre = document.createElement('span');
  nombre.className = "font-medium text-lg text-gray-200";
  nombre.textContent = producto;
  contenido.append(icono, nombre);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = "custom-checkbox";
  checkbox.checked = seleccionados.has(producto);
  
  // Función para alternar la selección
  const toggleSeleccion = () => {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      seleccionados.set(producto, '');
      card.classList.add('selected');
    } else {
      seleccionados.delete(producto);
      card.classList.remove('selected');
    }
  };
  
  // Hacer que el contenido sea clickeable
  contenido.addEventListener('click', toggleSeleccion);
  
  // El checkbox mantiene su funcionalidad original
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      seleccionados.set(producto, '');
      card.classList.add('selected');
    } else {
      seleccionados.delete(producto);
      card.classList.remove('selected');
    }
  });
  
  if (checkbox.checked) {
    card.classList.add('selected');
  }
  
  card.append(contenido, checkbox);
  contenedor.appendChild(card);
}

function filtrar(categoria) {
  contenedor.innerHTML = '';
  
  // Agregar un encabezado con el nombre de la categoría y un botón X para cerrar
  const categoriaHeader = document.createElement('div');
  categoriaHeader.className = "mt-3 mb-3 font-bold text-xl border-b pb-2 text-white flex justify-between items-center";
  
  const headerText = document.createElement('span');
  headerText.textContent = categoria;
  
  const btnCerrar = document.createElement('button');
  btnCerrar.className = "text-gray-300 hover:text-white text-xl";
  btnCerrar.textContent = "✕";
  btnCerrar.onclick = filtrarTodo;
  
  categoriaHeader.appendChild(headerText);
  categoriaHeader.appendChild(btnCerrar);
  contenedor.appendChild(categoriaHeader);
  
  // Mostrar los productos de esta categoría
  productosPorCategoria[categoria].forEach((producto) => {
    crearTarjetaProducto(producto);
  });
  
  // Indicar que hay un filtro activo
  document.body.classList.add('filtro-activo');
}

function mostrarToast() {
  listaCarrito.innerHTML = '';
  seleccionados.forEach((comentario, producto) => {
    const li = document.createElement('li');
    li.className = "flex items-center justify-between gap-3 bg-gray-700 p-3 rounded-lg";
    const text = document.createElement('div');
    text.className = "flex-1 font-medium text-gray-100";
    text.textContent = producto;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = comentario;
    input.placeholder = "Comentario o cantidad";
    input.className = "border border-gray-600 rounded-lg px-3 py-2 text-sm w-40 bg-gray-600 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all";
    input.oninput = () => {
      seleccionados.set(producto, input.value);
    };
    const remove = document.createElement('button');
    remove.className = "text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded transition-colors";
    remove.textContent = "✕";
    remove.onclick = () => {
      li.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        seleccionados.delete(producto);
        mostrarToast();
      }, 300);
    };
    li.append(text, input, remove);
    listaCarrito.appendChild(li);
  });
  toast.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function cerrarToast() {
  toast.classList.add('hidden');
  overlay.classList.add('hidden');
}

// Funciones para el buscador
function mostrarBusqueda() {
  barraBusqueda.classList.remove('hidden');
  inputBusqueda.focus();
  
  // Agregar indicador visual de filtro activo
  document.body.classList.add('filtro-activo');
}

function cerrarBusqueda() {
  barraBusqueda.classList.add('hidden');
  inputBusqueda.value = '';
  filtrarTodo();
  
  // Quitar indicador visual de filtro activo
  document.body.classList.remove('filtro-activo');
}

function buscarProducto() {
  const termino = inputBusqueda.value.trim().toLowerCase();
  
  contenedor.innerHTML = '';
  
  if (!termino) {
    filtrarTodo();
    return;
  }
  
  const categoriaHeader = document.createElement('div');
  categoriaHeader.className = "mt-3 mb-3 font-bold text-xl border-b pb-2 text-white flex justify-between items-center";
  
  const headerText = document.createElement('span');
  headerText.textContent = `Resultados para "${termino}"`;
  
  const btnCerrar = document.createElement('button');
  btnCerrar.className = "text-gray-300 hover:text-white text-xl";
  btnCerrar.textContent = "✕";
  btnCerrar.onclick = cerrarBusqueda;
  
  categoriaHeader.appendChild(headerText);
  categoriaHeader.appendChild(btnCerrar);
  contenedor.appendChild(categoriaHeader);
  
  let resultadosEncontrados = false;
  
  // Buscar productos que contengan el término
  for (const categoria in productosPorCategoria) {
    for (const producto of productosPorCategoria[categoria]) {
      if (producto.toLowerCase().includes(termino)) {
        crearTarjetaProducto(producto);
        resultadosEncontrados = true;
      }
    }
  }
  
  if (!resultadosEncontrados) {
    const mensajeNoEncontrado = document.createElement('div');
    mensajeNoEncontrado.className = "text-center py-6 text-gray-400";
    mensajeNoEncontrado.textContent = "No se encontraron productos con ese nombre";
    contenedor.appendChild(mensajeNoEncontrado);
  }
}

// Evento para búsqueda en tiempo real
inputBusqueda.addEventListener('input', function() {
  buscarProducto();
});

// Evento para buscar al presionar Enter
inputBusqueda.addEventListener('keyup', function(event) {
  if (event.key === 'Enter') {
    buscarProducto();
  }
});

function enviarWhatsApp() {
  const sucursal = document.getElementById('sucursal').value;
  const nombreEmpleado = document.getElementById('nombreEmpleado').value.trim();
  if (!sucursal) {
    alert('Selecciona una sucursal');
    return;
  }
  if (!nombreEmpleado) {
    alert('Escribe el nombre del empleado responsable');
    return;
  }
  const faltantes = Array.from(seleccionados.entries());
  if (!faltantes.length) {
    alert('Selecciona al menos un producto');
    return;
  }
    // Cerramos el toast
  cerrarToast();
    
  // Agrupamos los productos por categoría
  const productosPorCat = {};
  
  // Recorremos los faltantes para agruparlos por categoría
  faltantes.forEach(([producto, comentario]) => {
    // Buscamos a qué categoría pertenece este producto
    for (const categoria in productosPorCategoria) {
      if (productosPorCategoria[categoria].includes(producto)) {
        if (!productosPorCat[categoria]) {
          productosPorCat[categoria] = [];
        }
        productosPorCat[categoria].push({ producto, comentario });
        break;
      }
    }
  });
  // Preparamos el mensaje para WhatsApp
  const fecha = new Date().toLocaleDateString('es-MX');
  // Construimos el encabezado simple
  let mensaje = `*FALTANTES DEL DIA*%0A`;
  mensaje += `*Fecha:* ${fecha}%0A`;
  mensaje += `*Sucursal:* ${sucursal}%0A%0A`;  // Agregamos los productos por categoría
  for (const categoria in productosPorCat) {
    mensaje += `*${categoria.toUpperCase()}*%0A`;
      productosPorCat[categoria].forEach(({ producto, comentario }) => {
      mensaje += `${producto}${comentario ? " " + comentario : ""}%0A`;
    });
    
    mensaje += "%0A%0A"; // Doble espacio entre categorías
  }  // Agregamos el pie de mensaje
  mensaje += `*Lista generada por:* ${nombreEmpleado}`;
  const telefono = '526864722111'; // Cambia esto por tu número
  const url = `https://wa.me/${telefono}?text=${mensaje}`;
  
  // Mostramos la animación de confirmación
  const animacionConfirmacion = document.getElementById('animacionConfirmacion');
  const tarjeta = animacionConfirmacion.querySelector('.card-animation');
  
  animacionConfirmacion.classList.remove('hidden');  setTimeout(() => {
    tarjeta.classList.add('show');
    // Después de 15 segundos comenzamos a desvanecer
    setTimeout(() => {
      tarjeta.classList.remove('show');
      tarjeta.classList.add('hide');
      
      // Después de la animación de salida, abrimos WhatsApp
      setTimeout(() => {
        animacionConfirmacion.classList.add('hidden');
        tarjeta.classList.remove('hide');
        window.open(url, '_blank');
        
        // Limpiar el carrito después de enviar
        limpiarCarrito();
      }, 500); // Tiempo para la animación de salida
      
    }, 15000); // Duración total de la animación visible
    
  }, 100); // Pequeño retraso para que la animación se inicie correctamente
}

function limpiarCarrito() {
  // Limpiamos el mapa de seleccionados
  seleccionados.clear();
  
  // Quitamos las clases selected de las tarjetas
  const tarjetasSeleccionadas = document.querySelectorAll('.product-card.selected');
  tarjetasSeleccionadas.forEach(tarjeta => {
    tarjeta.classList.remove('selected');
    const checkbox = tarjeta.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = false;
    }
  });
}

window.onload = () => filtrarTodo();
