/*
Crea una aplicación web que muestre los personajes de la serie *Rick and Morty* utilizando su API oficial.

*Requerimientos:*

1. *Listado de personajes:*
    - Obtén y muestra todos los personajes desde la API, implementando *paginación* para navegar entre ellos.
2. *Favoritos:*
    - Cada tarjeta o elemento de personaje debe incluir un *icono de corazón*.
    - Al hacer clic en el corazón, el personaje se debe agregar a una *lista de personajes favoritos*.
    - Los personajes favoritos deben almacenarse en el *localStorage* para que persistan al recargar la página.
3. *Página de favoritos:*
    - Crea una página independiente que muestre únicamente los personajes guardados como favoritos.
    - En esta página, el usuario debe poder *eliminar* personajes de la lista de favoritos.

*Objetivo:*

Practicar el consumo de APIs, la implementación de paginación, la manipulación del DOM, el manejo de eventos y el uso de localStorage para persistencia de datos.

Opcional: Crea una página de login/register con sus validaciones respectivas. Cuando alguien se registra debe de ser guardado en el local storage. Para acceder a los personajes debes de loguearte. El registro debe de pedir nombre, apellido, correo, contraseña. Y debes hacer que cada usuario tenga sus propios personajes favoritos

Opcional: Encripta la contraseña del usuario al momento de registrarse, y desencriptala unicamente para verificación al momento del login, para encriptar debes de utilizar la palabra clave que funcione como una llave. Esta llave debe de estar escondida en un archivo .env, ya que el usuario no carga este archivo en el frontend.
*/

const iniciarSeccion = document.getElementById("iniciarSeccion");
const registro = document.getElementById("registro");
const loginForm = document.getElementById("formIniciarSeccion");
const registroForm = document.getElementById("formRegistro");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");
const btnCrearCuenta = document.getElementById("btnCrearCuenta");
const divTarjetas = document.getElementById("divTarjetas");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const paginaActual = document.getElementById("paginaActual");
const btnPersonajes = document.getElementById("btnPersonajes");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
const btnFavoritos = document.getElementById("btnFavoritos");
const sectionFavoritos = document.getElementById("sectionFavoritos");
const sectionTarjetas = document.getElementById("sectionTarjetas");
const divFavoritos = document.getElementById("divFavoritos");

const regexCorreo = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/;
const regexPassword = /^(?=.*[A-Z])(?=.*[$@$!%*?&]).{8,15}$/;
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]{2,20}$/;

class Usuario {
  constructor(nombre, apellido, correo, password) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.correo = correo;
    this.password = password;
    this.favoritos = [];
  }
  agregarFavorito(episodio) {
    this.favoritos.push(episodio);
  }
  eliminarFavorito(episodio) {
    this.favoritos = this.favoritos.filter((fav) => fav !== episodio);
  }
}

let usuarios = JSON.parse(localStorage.getItem("usuarios")) ? JSON.parse(localStorage.getItem("usuarios")) : [new Usuario("Luis", "Rojas", "luisrojas@gmail.com", "luis2001")];
let usuarioActual = JSON.parse(sessionStorage.getItem("usuarioActual"));

function restaurarUsuario(obj) {
    const usuario = new Usuario(obj.nombre, obj.apellido, obj.correo, obj.password);
    usuario.favoritos = obj.favoritos;
    return usuario;
}

registro.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registroForm.classList.remove("hidden");
  registroForm.classList.add("flex");
  registro.classList.add("bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]");
  iniciarSeccion.classList.remove("bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]");
  iniciarSeccion.classList.add("bg-zinc-700");
});

iniciarSeccion.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registroForm.classList.add("hidden");
  registroForm.classList.remove("flex");
  iniciarSeccion.classList.add("bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]");
  registro.classList.remove("bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]");
  registro.classList.add("bg-zinc-700");
});

btnIniciarSesion.addEventListener("click", (e) => {
  e.preventDefault();
  const correo = document.getElementById("correoIniciarSesion").value;
  const password = document.getElementById("PasswordIniciarSesion").value;

  usuarioActual = usuarios.find((user) => user.correo === correo && user.password === password);
  if (usuarioActual) {
    btnPersonajes.click();
    sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    usuarioActual = restaurarUsuario(usuarioActual);
    header.classList.remove("hidden");
    document.getElementById("sectionIniciar").classList.add("hidden");
    document.getElementById("main").classList.add("items-start");
    document.getElementById("main").classList.remove("h-screen");
    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("navbar").classList.add("flex");
    document.getElementById("correoIniciarSesion").value = "";
    document.getElementById("PasswordIniciarSesion").value = "";
    mostrarDatos('https://rickandmortyapi.com/api/character');
    cargarFavoritos();
  } else {
    alert("Correo o contraseña incorrectos");
  }
});

btnCrearCuenta.addEventListener("click", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correoRegistro").value;
  const password = document.getElementById("passwordRegistro").value;

  if(usuarios.some(user => user.correo === correo)){
    alert("Este correo ya esta registrado");
  } else if(!regexNombre.test(nombre)){
    alert("Nombre no válido");
  } else if(!regexNombre.test(apellido)){
    alert("Apellido no válido");
  } else if(!regexCorreo.test(correo)){
    alert("Correo electrónico no válido");
  } else if(!regexPassword.test(password)){
    alert("La contraseña debe tener entre 8 y 15 caracteres, al menos una letra mayúscula y un carácter especial.");
  } else if (nombre && apellido && correo && password) {
    alert("Cuenta creada exitosamente");
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("correoRegistro").value = "";
    document.getElementById("passwordRegistro").value = "";
    usuarios.push(new Usuario(nombre, apellido, correo, password));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }else{
    alert("Por favor, complete todos los campos");
  }
});

btnCerrarSesion.addEventListener("click", () => {
  header.classList.add("hidden");
  document.getElementById("sectionIniciar").classList.remove("hidden");
  document.getElementById("main").classList.remove("items-start");
  document.getElementById("main").classList.add("h-screen");
  document.getElementById("navbar").classList.add("hidden");
  document.getElementById("navbar").classList.remove("flex");
  actualizarUsuario();
});

btnFavoritos.addEventListener("click", () => {
  sectionFavoritos.classList.remove("hidden");
  sectionFavoritos.classList.add("flex");
  sectionTarjetas.classList.remove("flex");
  sectionTarjetas.classList.add("hidden");
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
});

btnPersonajes.addEventListener("click", () => {
  sectionFavoritos.classList.remove("flex");
  sectionFavoritos.classList.add("hidden");
  sectionTarjetas.classList.remove("hidden");
  sectionTarjetas.classList.add("flex");
  window.scrollTo({
    top: 0,
    behavior: 'auto'
  });
});

async function mostrarDatos(url) {
  divTarjetas.innerHTML = '';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al cargar los datos");
    const data = await response.json();
    data.results.forEach(character => {
      let card = document.createElement('div');
      card.className = 'border-1 border-[#008000] rounded shadow-lg bg-zinc-800 flex flex-col gap-2 relative overflow-hidden hover:scale-105 transition duration-300 hover:shadow-lg hover:shadow-[#008000] group';
      card.innerHTML = crearTarjeta(character);
      divTarjetas.appendChild(card);
    });
    navegacion(data.info);
  } catch (error) {
    console.error(error);
  }
}

function favoritos(id) {
  if (!usuarioActual.favoritos.includes(id)) {
    usuarioActual.agregarFavorito(id);
  } else {
    usuarioActual.eliminarFavorito(id);
  }
  sessionStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
  document.querySelectorAll(`.label-${id}`).forEach(label => {
    if (usuarioActual.favoritos.includes(id)) {
      label.classList.add("bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]");
      label.classList.remove("bg-zinc-700");
      label.querySelector(`.input-${id}`).checked = true;
    } else {
      label.classList.remove("bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]");
      label.classList.add("bg-zinc-700");
      label.querySelector(`.input-${id}`).checked = false;
    }
  });
  cargarFavoritos();
}

async function cargarFavoritos() {
  divFavoritos.innerHTML = '';
  try {
    const favoritos = JSON.parse(sessionStorage.getItem("usuarioActual")).favoritos;
    for (const id of favoritos) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
      const data = await response.json();
      let card = document.createElement('div');
        card.className = 'border-1 border-[#008000] rounded shadow-lg bg-zinc-800 flex flex-col gap-2 relative overflow-hidden hover:scale-105 transition duration-300 hover:shadow-lg hover:shadow-[#008000]';
        card.innerHTML = crearTarjeta(data, "fav");
        divFavoritos.appendChild(card);
    }
  } catch (error) {
    console.error(error);
  }
}

function crearTarjeta(character, contexto = "card") {
  const esFavorito = usuarioActual.favoritos.includes(character.id);
  const idUnico = `${contexto}-${character.id}`;
  return `
    <img src="${character.image}" alt="${character.name}" class="w-full group-hover:scale-110 transition duration-300">
    <div class="p-4 flex flex-col gap-2">
      <h2 class="font-bold text-2xl">${character.name}</h2>
      <p><span class="font-bold">Status:</span> ${character.status}</p>
      <p><span class="font-bold">Especie:</span> ${character.species}</p>
      <p><span class="font-bold">Género:</span> ${character.gender}</p>
    </div>
    <label class="absolute top-4 right-4 p-3 rounded-full ${esFavorito ? 'bg-[linear-gradient(135deg,_hsl(120,100%,50%)_0%,_hsl(180,100%,40%)_100%)]' : 'bg-zinc-700'} label-${character.id} cursor-pointer hover:scale-105 transition duration-300">
      <input id="${idUnico}" type="checkbox" class="hidden input-${character.id}" onclick="favoritos(${character.id})" ${esFavorito ? 'checked' : ''}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
        viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-heart">
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0 A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
      </svg>
    </label>
  `;
}

function navegacion(info) {
  // Siguiente
  if (info.next) {
    btnSiguiente.disabled = false;
    btnSiguiente.onclick = () => {mostrarDatos(info.next); paginaActual.textContent = parseInt(paginaActual.textContent) + 1;};
  } else {
    btnSiguiente.disabled = true;
    btnSiguiente.onclick = null;
  }
  // Anterior
  if (info.prev) {
    btnAnterior.disabled = false;
    btnAnterior.onclick = () => {mostrarDatos(info.prev); paginaActual.textContent = parseInt(paginaActual.textContent) - 1;};
  } else {
    btnAnterior.disabled = true;
    btnAnterior.onclick = null;
  }
}

function actualizarUsuario() {
  usuarios = usuarios.map(user => user.correo === usuarioActual.correo ? usuarioActual : user);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

window.addEventListener("beforeunload", () => {
  actualizarUsuario();
  sessionStorage.removeItem("usuarioActual");
});