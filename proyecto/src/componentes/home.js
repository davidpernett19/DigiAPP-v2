import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function mostrarHome() {
  const appContainer = document.getElementById("app");
  appContainer.innerHTML = "<h2>Cargando Digimons...</h2>";

  const auth = getAuth();
  const db = getFirestore();

  // Cargar y mostrar Digimons
  cargarDigimons(appContainer, auth, db);
}

async function cargarDigimons(appContainer, auth, db) {
  try {
    // Cargar los datos de la API de Digimon
    const response = await fetch("https://digimon-api.vercel.app/api/digimon");
    const digimons = await response.json();

    // Limpiar contenedor
    appContainer.innerHTML = "";

    // Crear título
    const title = document.createElement("h1");
    title.textContent = "Digimon Explorer";
    title.style.textAlign = "center";
    title.style.marginBottom = "20px";
    title.style.color = "#333";

    // Contador de favoritos
    const favoritesCounter = document.createElement("div");
    favoritesCounter.id = "favorites-counter";
    favoritesCounter.style.textAlign = "center";
    favoritesCounter.style.marginBottom = "30px";
    favoritesCounter.style.fontSize = "18px";
    favoritesCounter.style.color = "#666";

    appContainer.appendChild(title);
    appContainer.appendChild(favoritesCounter);

    // Verificar estado de autenticación y cargar favoritos
    onAuthStateChanged(auth, async (user) => {
      let favorites = [];

      if (user) {
        favorites = await loadFavorites(user.uid, db);
        updateFavoritesCounter(favorites.length);
      } else {
        updateFavoritesCounter(0);
        const loginMessage = document.createElement("p");
        loginMessage.textContent = "Inicia sesión para guardar favoritos";
        loginMessage.style.color = "#ff6b6b";
        loginMessage.style.textAlign = "center";
        loginMessage.style.marginTop = "10px";
        favoritesCounter.appendChild(loginMessage);
      }

      // Mostrar todos los Digimons
      digimons.forEach((digimon) => {
        const isFav = favorites.some(fav => fav.digimonName === digimon.name);
        const card = createDigimonCard(digimon, isFav, user, db, () => {
          // Callback para actualizar favoritos
          if (user) {
            loadAndUpdateFavorites(user.uid, db, favoritesCounter);
          }
        });
        appContainer.appendChild(card);
      });
    });

  } catch (error) {
    console.error("Error al cargar los datos:", error);
    appContainer.innerHTML = "<p>Error al cargar los Digimons 😢</p>";
  }
}

// Función para cargar favoritos del usuario
async function loadFavorites(userId, db) {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });
    return favorites;
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

// Función para actualizar contador de favoritos
function updateFavoritesCounter(count) {
  const counter = document.getElementById("favorites-counter");
  if (counter) {
    counter.innerHTML = `<strong>Favoritos: ${count}</strong>`;
  }
}

// Función para cargar y actualizar favoritos
async function loadAndUpdateFavorites(userId, db, counterElement) {
  const favorites = await loadFavorites(userId, db);
  updateFavoritesCounter(favorites.length);
}

// Función para crear tarjeta de Digimon
function createDigimonCard(digimon, isFavorite, user, db, onFavoritesUpdate) {
  const card = document.createElement("div");
  card.className = "digimon-card";
  
  card.innerHTML = `
    <img src="${digimon.img}" alt="${digimon.name}" class="digimon-image">
    <div class="digimon-info">
      <h3 class="digimon-name">${digimon.name}</h3>
      <p class="digimon-level"><strong>Nivel:</strong> ${digimon.level}</p>
      <button class="favorite-btn ${isFavorite ? 'remove' : ''}">
        ${isFavorite ? '★ Quitar de Favoritos' : '☆ Agregar a Favoritos'}
      </button>
      ${!user ? '<p class="login-message">Inicia sesión para guardar</p>' : ''}
    </div>
  `;

  // Manejar clic en botón de favoritos
  const favoriteBtn = card.querySelector('.favorite-btn');
  if (user) {
    favoriteBtn.addEventListener('click', async () => {
      if (isFavorite) {
        await removeFromFavorites(digimon.name, user.uid, db);
      } else {
        await addToFavorites(digimon, user.uid, db);
      }
      onFavoritesUpdate();
      // Recargar la vista para actualizar estados
      mostrarHome();
    });
  }

  return card;
}

// Función para agregar a favoritos
async function addToFavorites(digimon, userId, db) {
  try {
    await addDoc(collection(db, 'favorites'), {
      userId: userId,
      digimonName: digimon.name,
      digimonImage: digimon.img,
      digimonLevel: digimon.level,
      addedAt: new Date()
    });
    
    alert(`¡${digimon.name} se agregó a tus favoritos!`);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    alert('Error al agregar a favoritos');
  }
}

// Función para remover de favoritos
async function removeFromFavorites(digimonName, userId, db) {
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('digimonName', '==', digimonName)
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, 'favorites', document.id));
    });
    
    alert(`¡${digimonName} se eliminó de tus favoritos!`);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    alert('Error al eliminar de favoritos');
  }
}