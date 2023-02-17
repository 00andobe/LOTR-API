interface Movie {
    _id: string;
    name: string;
    runtimeInMinutes: number;
    budgetInMillions: number;
    boxOfficeRevenueInMillions: number;
    academyAwardNominations: number;
    academyAwardWins: number;
    rottenTomatoesScore: number;
  }
  
  interface MovieData {
    docs: Movie[];
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
  }

  interface Book {
    _id: string;
    name: string;
  }

  interface BookData {
    docs: Book[];
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
  }

  interface Character {
    _id: string;
    height: string;
    race: string;
    gender: string;
    birth: string;
    spouse: string;
    death: string;
    realm: string;
    hair: string;
    name: string;
    wikiUrl: string;
  }
  
  interface CharacterData {
    docs: Character[];
    total: number;
    limit: number;
    offset: number;
    page: number;
    pages: number;
}
interface FavoriteCharacter {
  name: string;
  height: string;
  race: string;
  gender: string;
  birth: string;
  spouse: string;
  death: string;
  realm: string;
  hair: string;
  wikiUrl: string;
  _id: string;
}



function clearSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.innerHTML = "";
  }
}






  const bookDataButton = document.getElementById("show-book-data") as HTMLButtonElement;
  const movieDataButton = document.getElementById("show-movie-data") as HTMLButtonElement;
  const charactersButton = document.getElementById("show-characters") as HTMLButtonElement;
  const favoritedCharactersButton = document.getElementById("favorited-characters") as HTMLButtonElement;

  favoritedCharactersButton.addEventListener("click", function() {
    displayFavorites();
  });


  bookDataButton.addEventListener("click", function() {
    clearSidebar();
    showBookData(apiKey);
  });
  
  movieDataButton.addEventListener("click", function() {
    clearSidebar();
showMovieData(apiKey);
  });
  
  charactersButton.addEventListener("click", function() {
    clearSidebar();
    showCharacterData(apiKey);
  });
  



  
  async function getData<T>(url: string, apiKey: string): Promise<T> {
    try {
      const headers = new Headers({
        Authorization: `Bearer ${apiKey}`
      });
      const response = await fetch(url, { headers });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function showMovieData(apiKey: string) {
    const data = await getData<MovieData>(
      "https://the-one-api.dev/v2/movie",
      apiKey
    );
  
    const movieDataSection = document.getElementById("information");
  
    if (movieDataSection) {
      movieDataSection.innerHTML = '<h1>These are the Lord of the Rings movies in order </h1>'; 
  
      const moviesList = document.createElement("div");
      moviesList.id = "movies-list";
      movieDataSection.appendChild(moviesList);
  
      const moviesListDiv = document.getElementById("movies-list") as HTMLDivElement;
  
      data.docs.forEach(movie => {
        const movieItem = document.createElement("div");
        movieItem.innerHTML = `
          <h2>${movie.name}</h2>
          <p>Runtime: ${movie.runtimeInMinutes} minutes</p>
          <p>Budget: $${movie.budgetInMillions} million</p>
          <p>Box Office Revenue: $${movie.boxOfficeRevenueInMillions} million</p>
          <p>Academy Award Nominations: ${movie.academyAwardNominations}</p>
          <p>Academy Award Wins: ${movie.academyAwardWins}</p>
          <p>Rotten Tomatoes Score: ${movie.rottenTomatoesScore}%</p>
        `;
        moviesListDiv.appendChild(movieItem);
      });
    }
  }





  async function showBookData(apiKey: string) {
    const data = await getData<{ docs: Book[] }>(
      "https://the-one-api.dev/v2/book",
      apiKey
    );
    console.log(data);
  
    const bookDataSection = document.getElementById("information");
    if (bookDataSection) {
      bookDataSection.innerHTML = '<h1>These are the Lord of the Rings books in order </h1>'; // clear the content of the section
      const booksList = document.createElement("div");
      booksList.id = "books-list";
      data.docs.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.innerHTML = `
          <h2>${book.name}</h2>
        `;
        booksList.appendChild(bookItem);
      });
      bookDataSection.appendChild(booksList);
    }
  }
  
  
  async function showCharacterData(apiKey: string) {
    const data = await getData<CharacterData>(
      "https://the-one-api.dev/v2/Character",
      apiKey
    );
  
    const CharacterDataSection = document.getElementById("information");
    if (CharacterDataSection && data.docs) {
      CharacterDataSection.innerHTML = `
        <h1>These are the Lord of the Rings Characters</h1>
        <input type="text" id="search-bar" placeholder="Search for a character"></input> <br>
        <div id="characters-list"></div>
      `;
  
      const searchBar = document.getElementById("search-bar") as HTMLInputElement;
      const charactersList = document.getElementById("characters-list") as HTMLBodyElement;
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]").map((favorite: FavoriteCharacter) => favorite._id);
  
      data.docs.forEach(character => {
        const CharacterItem = document.createElement("div");
        CharacterItem.innerHTML = `
          <h2>${character.name}</h2>
          <p>Height: ${character.height}</p>
          <p>Race: ${character.race}</p>
          <p>Gender: ${character.gender}</p>
          <p>Birth: ${character.birth}</p>
          <p>Spouse: ${character.spouse}</p>
          <p>Death: ${character.death}</p>
          <p>Realm: ${character.realm}</p>
          <p>Hair: ${character.hair}</p>
          <p>Wiki URL: <a href="${character.wikiUrl}">${character.wikiUrl}</a></p>
          <button id="${character._id}-favorite">Favorite</button>
        `;
        charactersList.appendChild(CharacterItem);
        
        
        const favoriteButton = document.getElementById(`${character._id}-favorite`) as HTMLButtonElement;
        if (favoriteIds.includes(character._id)) {
          favoriteButton.disabled = true;
        } else {
          favoriteButton.disabled = false;
          favoriteButton.addEventListener("click", () => {
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            favorites.push(character);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            console.log(`Added ${character.name} to favorites!`);
            favoriteButton.disabled = true;
          });
        }
      });

      
  
      searchBar.addEventListener("keyup", () => {
        const searchTerm = searchBar.value.toLowerCase();
        charactersList.innerHTML = "";
  
        data.docs
          .filter(character => character.name.toLowerCase().includes(searchTerm))
          .forEach(character => {
            const CharacterItem = document.createElement("div");
            CharacterItem.innerHTML = `
              <h2>${character.name}</h2>
              <p>Height: ${character.height}</p>
              <p>Race: ${character.race}</p>
              <p>Gender: ${character.gender}</p>
              <p>Birth: ${character.birth}</p>
              <p>Spouse: ${character.spouse}</p>
              <p>Death: ${character.death}</p>
              <p>Realm: ${character.realm}</p>
              <p>Hair: ${character.hair}</p>
              <p>Wiki URL: <a href="${character.wikiUrl}">${character.wikiUrl}</a></p>
              <button id="${character._id}-favorite">Favorite</button>
            `;
            charactersList.appendChild(CharacterItem);
  
            const favoriteButton = document.getElementById(`${character._id}-favorite`) as HTMLButtonElement;
            favoriteButton.addEventListener("click", () => {
              const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
              favorites.push(character);
              localStorage.setItem("favorites", JSON.stringify(favorites));
              console.log(`Added ${character.name} to favorites!`);
            });
          });
      });
    } else {
      console.error("error");
    }
  }
  
  function displayFavorites() {
    const favorites: FavoriteCharacter[] = JSON.parse(localStorage.getItem("favorites") || "[]");
  
    const favoritesSection = document.getElementById("information");
    if (favoritesSection) {
      favoritesSection.innerHTML = `
        <h1>Favorite Characters</h1>
        <div id="favorites-list"></div>
      `;
  
      const charactersList = document.getElementById("favorites-list");
      if (charactersList) {
        charactersList.innerHTML = "";
  
        favorites.forEach((character: FavoriteCharacter) => {
          const CharacterItem = document.createElement("div");
          CharacterItem.innerHTML = `
            <h2>${character.name}</h2>
            <p>Height: ${character.height}</p>
            <p>Race: ${character.race}</p>
            <p>Gender: ${character.gender}</p>
            <p>Birth: ${character.birth}</p>
            <p>Spouse: ${character.spouse}</p>
            <p>Death: ${character.death}</p>
            <p>Realm: ${character.realm}</p>
            <p>Hair: ${character.hair}</p>
            <p>Wiki URL: <a href="${character.wikiUrl}">${character.wikiUrl}</a></p>
            <button id="${character._id}-remove">Remove</button>
          `;
          charactersList.appendChild(CharacterItem);
  
          const removeButton = document.getElementById(`${character._id}-remove`) as HTMLButtonElement;
          removeButton.addEventListener("click", () => {
            removeFavoriteCharacter(character._id);
            displayFavorites(); 
          });
        });
      }
    }
  }
  
  
  function removeFavoriteCharacter(id: string) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const index = favorites.findIndex((favorite: FavoriteCharacter) => favorite._id === id);
    if (index > -1) {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      console.log(`Removed character with id ${id} from favorites`);
    } else {
      console.log(`Character with id ${id} not found in favorites`);
    }
  }
  
  
  

  
  


  
  const apiKey = "9DXbMtkTWDU_LeFgB1sA";

  