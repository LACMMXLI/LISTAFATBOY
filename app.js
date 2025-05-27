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

function filtrar(categoria) {
  contenedor.innerHTML = '';
  productosPorCategoria[categoria].forEach((producto, index) => {
    const card = document.createElement('div');
    card.className = "product-card flex items-center justify-between bg-white p-4 rounded-xl shadow-md border";
    const contenido = document.createElement('div');
    contenido.className = "flex items-center space-x-4";
    const icono = document.createElement('div');
    icono.className = "text-2xl";
    icono.textContent = '📦';
    const nombre = document.createElement('span');
    nombre.className = "font-medium text-lg text-gray-800";
    nombre.textContent = producto;
    contenido.append(icono, nombre);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = "custom-checkbox";
    checkbox.checked = seleccionados.has(producto);
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
  });
}

function mostrarToast() {
  listaCarrito.innerHTML = '';
  seleccionados.forEach((comentario, producto) => {
    const li = document.createElement('li');
    li.className = "flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-lg";
    const text = document.createElement('div');
    text.className = "flex-1 font-medium text-gray-700";
    text.textContent = producto;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = comentario;
    input.placeholder = "Comentario o cantidad";
    input.className = "border rounded-lg px-3 py-2 text-sm w-40 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all";
    input.oninput = () => {
      seleccionados.set(producto, input.value);
    };
    const remove = document.createElement('button');
    remove.className = "text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded transition-colors";
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
  const fecha = new Date().toLocaleDateString('es-MX');
  const productos = faltantes.map(([p, c]) => `• ${p}${c ? " – " + c : ""}`).join('%0A');
  const mensaje = `*Faltantes del día – ${sucursal} – ${fecha}*%0A${productos}%0A%0A_Lista generada por: ${nombreEmpleado}_`;
  const telefono = '526864722111'; // Cambia esto por tu número
  const url = `https://wa.me/${telefono}?text=${mensaje}`;
  window.open(url, '_blank');
}

window.onload = () => filtrar('Verduras');
