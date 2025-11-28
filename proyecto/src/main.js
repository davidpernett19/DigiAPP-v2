// En tu archivo principal (main.js, app.js, etc.)
import './style.css'
import mostrarHome from './componentes/home.js';

// Función para verificar autenticación
function checkAuth() {
  return localStorage.getItem('userAuthenticated') === 'true';
}

// Función para mostrar login
function mostrarLogin() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <div class="auth-container">
      <h2>Iniciar Sesión</h2>
      <form id="loginForm">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Contraseña" required>
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <a href="#" id="showRegister">Regístrate</a></p>
    </div>
  `;
  
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Lógica de login aquí
    localStorage.setItem('userAuthenticated', 'true');
    mostrarHome();
  });
  
  document.getElementById('showRegister').addEventListener('click', mostrarRegistro);
}

function mostrarRegistro() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = `
    <div class="auth-container">
      <h2>Registro</h2>
      <form id="registerForm">
        <input type="text" placeholder="Nombre" required>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Contraseña" required>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="#" id="showLogin">Inicia Sesión</a></p>
    </div>
  `;
  
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Lógica de registro aquí
    localStorage.setItem('userAuthenticated', 'true');
    mostrarHome();
  });
  
  document.getElementById('showLogin').addEventListener('click', mostrarLogin);
}

// Inicializar la app
function initApp() {
  if (checkAuth()) {
    mostrarHome();
  } else {
    mostrarLogin();
  }
}

// Ejecutar cuando se cargue la página
document.addEventListener('DOMContentLoaded', initApp);