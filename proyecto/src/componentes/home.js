export default async function mostrarHome() {
const appContainer = document.getElementById("app");
appContainer.innerHTML = "<h2>Cargando proyectos...</h2>";
try {
// Cargar los datos del JSON
const response = await
fetch("https://diaztibata.github.io/sanagustin/json/miercoles-avanzada.json");
const proyectos = await response.json();
// Limpiar contenedor
appContainer.innerHTML = "";
// Recorrer cada proyecto y construir la tarjeta
proyectos.forEach((proyecto) => {
const card = document.createElement("div");
card.classList.add("app-card");
card.innerHTML = `
<img src="${proyecto.icono}" alt="Icono de
${proyecto.nombreapp}">
<div class="app-info">
<h2>${proyecto.nombreapp}</h2>
<p><strong>Descripción:</strong> ${proyecto.descripcion}</p>

<p><strong>Integrantes:</strong>
${proyecto.integrantes.join(", ")}</p>
<p><strong>Actividad:</strong> ${proyecto.actividad}</p>
<p><a href="${proyecto.url}" target="_blank">Ver
archivo</a></p>
</div>
`;
appContainer.appendChild(card);
});
} catch (error) {
console.error("Error al cargar los datos:", error);
appContainer.innerHTML = "<p>Error al cargar los proyectos 😢</p>";
}
}