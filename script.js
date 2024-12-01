const endpoint = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/';

/* As cores dos tipos */
const typeColors =
{
    fire: "#F08030", water: "#6890F0", electric: "#F8D030",
    grass: "#78C850", flying: "#A890F0", bug: "#A8B820",
    dragon: "#7038F8", psychic: "#F85888", poison: "#A040A0",
    ground: "#E0C068", steel: "#B8B8D0", fairy: "#EE99AC",
    dark: "#705848", rock: "#B8A038", ghost: "#705898",
    normal: "#A8A878"
};

getInputFocus();

document.getElementById('search-button')
    .addEventListener('click', async () =>
{
    const userInput = document.getElementById('search-input')
        .value.trim().toLowerCase();
    
    /* Cuida de limpar o input */
    document.getElementById('search-input').value = '';
    getInputFocus();
    
    if (userInput === '')
    {
        alert("Please enter Pokémon Name or Id");
        return;
    }

    try
    {
        const pokemonContainer = document.querySelector('.pokemon-container');
        pokemonContainer.classList.remove('show');

        const data = await getPokemonData(userInput);
        const pokemonIdentifiers = getPokemonIdentifiers(data);
        const pokemonMeasures = getPokemonMeasures(data);
        const pokemonTypes = getPokemonTypes(data);
        const pokemonStatistics = getPokemonStatistics(data);
        const pokemonImage = getPokemonSprite(data);
        fillPageData(pokemonIdentifiers, pokemonMeasures,
            pokemonTypes, pokemonStatistics, pokemonImage);
        
        pokemonContainer.classList.add('show');
    }
    catch (error)
    {
        alert('Pokémon not found');
    }

    return;
    
});

/* Cuida de pegar os dados */
const getPokemonData = async (userInput) =>
{
    const response = await fetch(`${endpoint}${userInput}`);

    if (!response.ok)
    {
        throw new Error(`Couldn't retrieve Pokemon Data`);
    }

    return(await response.json());
};

/* Cuida de pegar o nome e id */
const getPokemonIdentifiers = data =>
{
    return(
        [data['name'], data['id']]
    );
};

/* Cuida de pegar o peso e altura */
const getPokemonMeasures = data =>
{
    return(
        [data['height'], data['weight']]
    );
}

/* Cuida de pegar o ou os tipos */
const getPokemonTypes = data =>
{
    return(
        data['types'].map(type => type['type']['name'])
    );
}

/* Cuida de pegar as estatisticas */
const getPokemonStatistics = data =>
{
    return(
        data.stats.reduce((accumulator, currentStatistic) =>
        {
            accumulator[currentStatistic.stat.name] = currentStatistic.base_stat;
            return(accumulator);
        }, {})
    );
};

/* Cuida de pegar a imagem do Pokémon */
const getPokemonSprite = data =>
{
    return(data.sprites.front_default);
};

/* Cuida de colocar os dados na página */
const fillPageData = (pokemonIdentifiers, pokemonMeasures,
    pokemonTypes, pokemonStatistics, pokemonImage) =>
{
    const pokemonFields = 
    {
        'pokemon-name': pokemonIdentifiers[0].toUpperCase(),
        'pokemon-id': `#${pokemonIdentifiers[1]}`,
        'weight': `Weight: ${pokemonMeasures[1]}`,
        'height': `Height: ${pokemonMeasures[0]}`,
        'hp': pokemonStatistics['hp'] || '-',
        'attack': pokemonStatistics['attack'] || '-',
        'defense': pokemonStatistics['defense'] || '-',
        'special-attack': pokemonStatistics['special-attack'] || '-',
        'special-defense': pokemonStatistics['special-defense'] || '-',
        'speed': pokemonStatistics['speed'] || '-',
    };

    updatePokemonTypes(pokemonTypes);
    updatePokemonTextFields(pokemonFields);
    updatePokemonSprite(pokemonImage, pokemonIdentifiers[0]);
};

/* Cuida de pegar nos tipos e colocar no span na página */
const updatePokemonTypes = pokemonTypes =>
{
    const typesElement = document.getElementById('types');
    typesElement.innerHTML = '';

    pokemonTypes.forEach(type =>
    {
        const typeElement = document.createElement('span');
        typeElement.textContent = type.toUpperCase();
        typeElement.classList.add('pokemon-type');
        const color = typeColors[type.toLowerCase()] || '#A8A878';

        /* Aqui, cuida de não dar erro de contraste dependendo da cor */
        const textColor = isLigthColor(color) ? 'black' : 'white';

        typeElement.style.backgroundColor = color;
        typeElement.style.color = textColor;
        typesElement.appendChild(typeElement);
    });
}

/* Cuida de descobrir se é clara ou escura a cor. */
const isLigthColor = color =>
{
    const rgb = hexToRgb(color);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return(brightness > 125);
}

/* Cuida de converter de hexadecimal para rgb */
const hexToRgb = hex =>
{
    const match = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);

    return(
        match ?
        {
            r: parseInt(match[1], 16),
            g: parseInt(match[2], 16),
            b: parseInt(match[3], 16)
        } : { r: 0, g: 0, b: 0 }
    );
}

/* Cuida de colocar as estatisticas na tabela */
const updatePokemonTextFields = (pokemonFields) =>
{
    for (const [id, value] of Object.entries(pokemonFields))
    {
        document.getElementById(id).textContent = value;
    }
};

/* Cuida de colocar a imagem do Pokémon na página */
const updatePokemonSprite = (pokemonImage, pokemonName) =>
{
    const spriteContainer = document.getElementById('sprite-container');
    spriteContainer.innerHTML = '';
    const imgElement = document.createElement('img');
    imgElement.id = 'sprite';
    imgElement.src = pokemonImage;
    imgElement.alt = `${pokemonName} pokémon sprite`;
    spriteContainer.appendChild(imgElement);
}

/* Cuida de colocar o foco no input */
function getInputFocus()
{
    document.getElementById('search-input').focus();
};