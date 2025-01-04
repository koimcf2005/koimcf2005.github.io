import { addImageOverlay } from './gameOverlay.js'; // Adjust the path based on your directory structure

document.addEventListener('DOMContentLoaded', function () {
    const gameListElement = document.getElementById('game-list');
    const searchInputElement = document.getElementById('search-input');

    const games = {
        'Breath_Of_The_Wild': { width: 9.79, height: 8.16, area: 49.36 },
        'Elden_Ring': { width: 9.107, height: 8.6625, area: 26.66 },
        'Elden_Ring_(Playable_Area)': { width: 9.107, height: 8.6625, area: 13.65 },
        'Rocket_League': { width: 0.274, height: 0.396, area: 0.11 },
        'Fortnite_(Season_1)': { width: 2.588, height: 2.588, area: 4.28 },
        'Grand_Theft_Auto_III': { width: 3.39, height: 2.41, area: 3.78 },
        'Grand_Theft_Auto_V': { width: 7.68, height: 10.43, area: 37.36 },
        'Skyrim': { width: 7.66, height: 4.77, area: 19.3 },
        'Fuel': { width: 120.0, height: 120.0, area: 14400.0 },
    };

    function updateGameList(filter = '') {
        gameListElement.innerHTML = ''; // Clear existing list items

        // Normalize the search input by replacing spaces with underscores
        const normalizedFilter = filter.replace(/\s+/g, '_').toLowerCase();

        const filteredGames = Object.keys(games)
            .filter(gameName => gameName.toLowerCase().includes(normalizedFilter));

        if (filteredGames.length === 0) {
            const noGameItem = document.createElement('li');
            noGameItem.textContent = 'No Game Found...';
            gameListElement.appendChild(noGameItem);
        } else {
            filteredGames.forEach(gameName => {
                const listItem = document.createElement('li');
                listItem.textContent = gameName.replace(/_/g, ' '); // Replace underscores with spaces
                listItem.addEventListener('click', () => onGameNameClick(gameName));
                gameListElement.appendChild(listItem);
            });
        }
    }

    function onGameNameClick(gameName) {
        const gameData = { gameName, ...games[gameName] };
        addImageOverlay(gameData, map);
    }

    searchInputElement.addEventListener('input', (event) => {
        const filter = event.target.value;
        updateGameList(filter);
    });

    updateGameList();  // Initial game list update
});
