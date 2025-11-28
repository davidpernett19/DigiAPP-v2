import mostrarRegistro from './componentes/registro.js';
import mostrarLogin from './componentes/login.js';
import mostrarHome from './componentes/home.js';
import mostrarLogout from './componentes/logout.js';


import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
onAuthStateChanged(auth, (user) => {
if (user) {
document.getElementById("menu").innerHTML = `
<nav>
<button id="menuHome">Home</button>
<button id="menuOriginal">Original</button>
<button id="menuLogout">Logout</button>
</nav>
`;
document.getElementById("menuHome").addEventListener("click",
mostrarHome);
document.getElementById("menuOriginal").addEventListener("click",
mostrarOriginal);
document.getElementById("menuLogout").addEventListener("click",
mostrarLogout);
mostrarHome()
} else{
document.getElementById("menu").innerHTML = `
<nav>

<button id="menuLogin">Login</button>
<button id="menuRegistro">Registro</button>
</nav>
`;
document.getElementById("menuLogin").addEventListener("click",
mostrarLogin);
document.getElementById("menuRegistro").addEventListener("click",
mostrarRegistro);
mostrarLogin();
}
})


mostrarRegistro()
mostrarHome()
mostrarLogin()
mostrarLogout()