document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem('startMovies')) {
        drawMoviesList(JSON.parse(localStorage.getItem('startMovies')));
    } else {
        const url = 'https://imdb-api.com/en/API/MostPopularMovies/k_50u66ezw';
        loadingFetch(url, {}, true);
    }

    const search = document.getElementById('search');
    search.addEventListener('keydown', (e) => {
        if(e.code == 'Enter' && search.value.length >= 3) {
            const url = `https://imdb-api.com/en/API/AdvancedSearch/k_50u66ezw/?title=${search.value}&title_type=feature&count=10`;
            loadingFetch(url);
        }
    });

    const clear = document.getElementById('clear');
    clear.addEventListener('click', () => {
        clear.previousElementSibling.value = '';
        clear.previousElementSibling.focus();
    });
});

async function loadingFetch(url, options = {}, start = false) {
    const container = document.getElementById('container');
    const loader = document.getElementById('loader');
    const search = document.getElementById('search');
    container.style.display = 'none';
    loader.style.display = 'block';
    search.readOnly = true;
    const res = await fetch(url, options);
    const result = await res.json();
    if(start) {
        localStorage.setItem('startMovies', JSON.stringify(result.items));
        drawMoviesList(result.items);
    } else {
        console.log(result.results)
        if(result.results.length == 0) {
            drawEmpty(container);
        } else {
            drawMoviesList(result.results);
        }
        
    }
    container.style.display = 'grid';
    loader.style.display = 'none';
    search.readOnly = false;
}

function drawEmpty(container) {
    container.innerHTML = '';
    const empty = document.createElement('div');
    empty.classList.add('empty');
    empty.innerHTML = '<p>Nothing was found.<br> Check the search query or return to <span id="mainPage">the main page</span>.</p>'
    container.append(empty);
    const mainPage = document.getElementById('mainPage');
    mainPage.addEventListener('click', () => {
        drawMoviesList(JSON.parse(localStorage.getItem('startMovies')));
        const search = document.getElementById('search');
        search.value = '';
        search.focus();
    });    
}

function drawMoviesList(movies) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    movies = Object.values(movies);
    movies.map( movie => {
        const poster = document.createElement('img');
        const bigPosterURL = movie.image.replace('UY', 'UX').replace('UX176', 'UX380').replace('UX128', 'UX380').replace(',128,', ',380,').replace(',176', ',562');
        poster.src = bigPosterURL;

        const title = document.createElement('h3');
        title.innerText = movie.title;

        const info = document.createElement('div');
        info.classList.add('cardInfo');
        info.append(title);          

        const card = document.createElement('a');
        card.href = `https://www.imdb.com/title/${movie.id}/`;
        card.target = '_blank';
        card.append(poster);
        card.append(info);
              
        card.classList.add('movie');
        container.append(card);

        if(movie.year) {
            const year = document.createElement('span');
            year.classList.add('year');
            year.innerText = movie.year;
            card.append(year);  
        } else if(movie.description) {
            const year = document.createElement('span');
            year.classList.add('year');
            year.innerText = movie.description.replace(/[^19\d.|20\d.]/g, '');
            card.append(year);  
        }

        if(movie.imDbRating) {
            const rating = document.createElement('span');
            rating.classList.add('rating');
            rating.innerText = movie.imDbRating;
            card.append(rating);
        }  
    });
}

console.log(`
Score: 70
- Вёрстка [10/10]
    - [x] на странице есть несколько карточек фильмов и строка поиска. На каждой карточке фильма есть постер и название фильма. Также на карточке может быть другая информация, которую предоставляет API, например, описание фильма, его рейтинг на IMDb и т.д. +5
    - [x] в футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5
- При загрузке приложения на странице отображаются карточки фильмов с полученными от API данными [10/10]
- Если в поле поиска ввести слово и отправить поисковый запрос, на странице отобразятся карточки фильмов, в названиях которых есть это слово, если такие данные предоставляет API [10/10]
- Поиск [30/30]
    - [x] при открытии приложения курсор находится в поле ввода +5
    - [x] есть placeholder +5
    - [x] автозаполнение поля ввода отключено (нет выпадающего списка с предыдущими запросами) +5
    - [x] поисковый запрос можно отправить нажатием клавиши Enter +5
    - [x] после отправки поискового запроса и отображения результатов поиска, поисковый запрос продолжает отображаться в поле ввода +5
    - [x] в поле ввода есть крестик при клике по которому поисковый запрос из поля ввода удаляется и отображается placeholder +5
- Очень высокое качество оформления приложения и/или дополнительный не предусмотренный в задании функционал, улучшающий качество приложения [10/10]
    - [x] высокое качество оформления приложения предполагает собственное оригинальное оформление равное или отличающееся в лучшую сторону по сравнению с демо
    - [x] дополнительным функционалом может быть, например, наличие на карточке фильма его описания и рейтинга на IMDb
`);