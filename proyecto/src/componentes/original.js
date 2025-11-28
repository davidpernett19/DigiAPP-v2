import { db } from '../firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore';
export default function mostrarOriginal() {
// Objeto base
let app = {
nombreapp: "Nombre de la app",
descripcion: "Aqui agregamos una descripción de 30 palabras",
icono: "https://cdn-icons-png.flaticon.com/512/2909/2909765.png",
integrantes: ["javier", "maria", "matt"],
actividad: "Capacitor Firebase",
url:
"https://drive.google.com/file/d/1Kl97mmRESu2GWPztzK2XdMvNR68vMQ00/view?usp=drive_link"
};
// Contenedor principal
const contenedor = document.getElementById("app");
contenedor.innerHTML = "";
// Crear formulario y salida
const form = document.createElement("div");
const resultado = document.createElement("pre");
resultado.textContent = JSON.stringify(app, null, 2);

// Campos a editar
const campos = [
{ key: "nombreapp", label: "Nombre de la app" },
{ key: "descripcion", label: "Descripción" },
{ key: "icono", label: "URL del ícono" },
{ key: "actividad", label: "Actividad" },
{ key: "url", label: "URL del proyecto" },
];
// Crear inputs y etiquetas <p>
campos.forEach(({ key, label }) => {
const p = document.createElement("p");
p.textContent = label;
const input = document.createElement("input");
input.placeholder = label;
input.value = app[key];
input.oninput = () => {
app[key] = input.value;
resultado.textContent = JSON.stringify(app, null, 2);
};
form.appendChild(p);
form.appendChild(input);
});
// Campo especial: integrantes
const pIntegrantes = document.createElement("p");
pIntegrantes.textContent = "Integrantes (separados por coma):";
const integrantesInput = document.createElement("input");
integrantesInput.value = app.integrantes.join(", ");
integrantesInput.placeholder = "Integrantes (separados por coma):";
integrantesInput.oninput = () => {
app.integrantes = integrantesInput.value.split(",").map(i =>
i.trim());
resultado.textContent = JSON.stringify(app, null, 2);
};
form.appendChild(pIntegrantes);
form.appendChild(integrantesInput);
// 🔘 Botón para guardar en Firebase
const botonGuardar = document.createElement("button");
botonGuardar.textContent = "Guardar en Firebase";

botonGuardar.onclick = async () => {
try {
await addDoc(collection(db, "proyectos"), app);
alert("✅ Datos guardados correctamente en Firebase!");
} catch (error) {
console.error("Error al guardar en Firebase:", error);
alert("❌ Ocurrió un error al guardar en Firebase.");
}
};
form.appendChild(botonGuardar);
// Agregar todo al contenedor
contenedor.appendChild(form);
contenedor.appendChild(resultado);
}