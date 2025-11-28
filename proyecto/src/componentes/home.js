export default async function mostrarHome() {
  const appContainer = document.getElementById("app");
  
  const userName = localStorage.getItem('userName') || 'Entrenador';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  appContainer.innerHTML = `
    <div class="app-header">
      <div class="user-info">
        <div class="user-details">
          <h1>🐲 Digital Monster Archive</h1>
          <p>Bienvenido, <strong>${userName}</strong>! ${userEmail ? `(${userEmail})` : ''}</p>
        </div>
        <button id="logoutBtn" class="logout-btn">
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
    
    <div class="filters-container">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="🔍 Buscar Digimon por nombre..." class="search-input">
      </div>
      
      <div class="filter-group">
        <select id="levelFilter" class="filter-select">
          <option value="">Todos los niveles</option>
          <option value="Fresh">Fresh</option>
          <option value="In Training">In Training</option>
          <option value="Rookie">Rookie</option>
          <option value="Champion">Champion</option>
          <option value="Ultimate">Ultimate</option>
          <option value="Mega">Mega</option>
        </select>
        
        <select id="typeFilter" class="filter-select">
          <option value="">Todos los tipos</option>
          <option value="Data">Data</option>
          <option value="Vaccine">Vaccine</option>
          <option value="Virus">Virus</option>
          <option value="Free">Free</option>
          <option value="Variable">Variable</option>
        </select>
        
        <button id="showFavorites" class="favorites-btn">
          ❤️ Favoritos
        </button>
        
        <button id="showAll" class="show-all-btn active">
          🔄 Mostrar Todos
        </button>
      </div>
    </div>
    
    <div class="digimon-stats">
      <span id="digimonCount">Cargando...</span>
    </div>
    
    <div class="digimon-grid" id="digimonGrid">
      <div class="loading">Cargando Digimon...</div>
    </div>
  `;
  
  let allDigimon = [];
  let favorites = JSON.parse(localStorage.getItem('digimonFavorites')) || [];

  try {
    const response = await fetch("https://digimon-api.vercel.app/api/digimon");
    allDigimon = await response.json();
    
    displayDigimon(allDigimon);
    setupEventListeners();
    updateFavoritesButton();
    
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    const grid = document.getElementById("digimonGrid");
    grid.innerHTML = '<div class="error">Error al cargar los Digimon 😢</div>';
  }

  function displayDigimon(digimonList) {
    const grid = document.getElementById("digimonGrid");
    
    if (digimonList.length === 0) {
      grid.innerHTML = '<div class="no-results">No se encontraron Digimon</div>';
      updateStats(0);
      return;
    }
    
    grid.innerHTML = '';
    
    digimonList.forEach((digimon) => {
      const isFavorite = favorites.includes(digimon.name);
      const card = createDigimonCard(digimon, isFavorite);
      grid.appendChild(card);
    });
    
    updateStats(digimonList.length);
  }

  function createDigimonCard(digimon, isFavorite) {
    const card = document.createElement("div");
    card.classList.add("app-card");
    
    const levelClass = `level-${digimon.level.toLowerCase().replace(' ', '-')}`;
    const type = digimon.type || "Desconocido";
    
    card.innerHTML = `
      <div class="card-header">
        <img src="${digimon.img}" alt="${digimon.name}" class="digimon-img">
        <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-name="${digimon.name}">
          ${isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="app-info">
        <h2>${digimon.name}</h2>
        <p><strong>Tipo:</strong> ${type}</p>
        <p><strong>Nivel:</strong></p>
        <div class="level-badge ${levelClass}">${digimon.level}</div>
      </div>
    `;
    
    // Agregar evento al botón de favoritos
    const favoriteBtn = card.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(digimon.name);
    });
    
    return card;
  }

  function updateFavoritesButton() {
    const favoritesBtn = document.getElementById('showFavorites');
    favoritesBtn.setAttribute('data-count', favorites.length);
  }

  function toggleFavorite(digimonName) {
    const index = favorites.indexOf(digimonName);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(digimonName);
    }
    
    localStorage.setItem('digimonFavorites', JSON.stringify(favorites));
    updateFavoritesButton();
    applyFilters();
  }

  function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedLevel = document.getElementById('levelFilter').value;
    const selectedType = document.getElementById('typeFilter').value;
    const showFavorites = document.getElementById('showFavorites').classList.contains('active');
    
    let filtered = allDigimon;
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(digimon => 
        digimon.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por nivel
    if (selectedLevel) {
      filtered = filtered.filter(digimon => 
        digimon.level === selectedLevel
      );
    }
    
    // Filtrar por tipo
    if (selectedType) {
      filtered = filtered.filter(digimon => 
        digimon.type === selectedType
      );
    }
    
    // Filtrar por favoritos
    if (showFavorites) {
      filtered = filtered.filter(digimon => 
        favorites.includes(digimon.name)
      );
    }
    
    displayDigimon(filtered);
  }

  function showOnlyFavorites() {
    document.getElementById('showFavorites').classList.add('active');
    document.getElementById('showAll').classList.remove('active');
    applyFilters();
  }

  function showAllDigimon() {
    document.getElementById('showFavorites').classList.remove('active');
    document.getElementById('showAll').classList.add('active');
    applyFilters();
  }

  function updateStats(count) {
    const statsElement = document.getElementById('digimonCount');
    const favoriteCount = favorites.length;
    statsElement.innerHTML = `
      Mostrando <strong>${count}</strong> Digimon | 
      <span style="color: #f72585;">❤️ ${favoriteCount} Favoritos</span>
    `;
  }

  function setupEventListeners() {
    // Eventos de búsqueda y filtros
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('levelFilter').addEventListener('change', applyFilters);
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    
    // Eventos de botones
    document.getElementById('showFavorites').addEventListener('click', showOnlyFavorites);
    document.getElementById('showAll').addEventListener('click', showAllDigimon);
    
    // Evento del botón de logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout();
      }
    });
    
    // Limpiar filtros con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('searchInput').value = '';
        document.getElementById('levelFilter').value = '';
        document.getElementById('typeFilter').value = '';
        showAllDigimon();
      }
    });
  }
}

// Función de logout
function logout() {
  localStorage.removeItem('userAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  // Recargar la página para volver al login
  window.location.reload();
}