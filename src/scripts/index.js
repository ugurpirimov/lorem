import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.scss';

class Movies {
  constructor() {
    this.fetchMovies()
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.movies = data.movies;
        this.moviesCopy = data.movies;
        this.renderMovies();
        this.associateProducerNames();
      });
    document.querySelector('.filter-input').addEventListener('keyup', e => {
      this.filterByTitle(e.target.value);
    });
    document
      .querySelector('.filter-group #durationFilter')
      .addEventListener('change', e => {
        this.filterByDuration(e.target.checked);
      });
    document
      .querySelector('.filter-group #countryFilter')
      .addEventListener('change', e => {
        this.filterByCountry(e.target.value);
      });
    document
      .querySelector('.filter-group #producerFilter')
      .addEventListener('change', e => {
        this.filterByProducer(e.target.value);
      });
    document
      .querySelector('.filter-group #episodeCountFilter')
      .addEventListener('change', e => {
        this.filterByEpisodeCount(e.target.checked);
      });
  }

  fetchMovies() {
    return fetch('/public/data/movies.json');
  }

  filterByTitle(query) {
    function escapeRegExp(s) {
      return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    const words = query
      .split(/\s+/g)
      .map(s => s.trim())
      .filter(s => !!s);
    const hasTrailingSpace = query.endsWith(' ');
    const searchRegex = new RegExp(
      words
        .map((word, i) => {
          if (i + 1 === words.length && !hasTrailingSpace) {
            return `(?=.*\\b${escapeRegExp(word)})`;
          } else {
            return `(?=.*\\b${escapeRegExp(word)}\\b)`;
          }
        })
        .join('') + '.+',
      'gi'
    );

    this.movies =
      words != ''
        ? this.movies.filter(movie => searchRegex.test(movie.title))
        : this.moviesCopy;
    this.renderMovies();
  }

  filterByDuration(checked) {
    if (checked) {
      this.movies = this.movies.filter(movie => movie.duration >= 45);
      this.renderMovies();
    } else {
      // alert();
      this.movies = this.moviesCopy;
      this.renderMovies();
    }
  }

  filterByCountry(country) {
    this.movies = this.moviesCopy;
    this.movies = this.movies.filter(movie => movie.country == country);
    if (country == '') this.movies = this.moviesCopy;
    this.renderMovies();
  }

  filterByProducer(producer) {
    this.movies = this.moviesCopy;
    this.movies = this.movies.filter(
      movie => movie.producer.toLowerCase() == producer.toLowerCase()
    );
    if (producer == '') this.movies = this.moviesCopy;
    this.renderMovies();
  }

  filterByEpisodeCount(checked) {
    if (checked) {
      this.movies = this.movies.filter(movie => movie.episodeCount >= 20);
      this.renderMovies();
    } else {
      this.movies = this.moviesCopy;
      this.renderMovies();
    }
  }

  associateProducerNames() {
    let producers = [];
    const producerSelectBox = document.querySelector(
      '.filter-group #producerFilter'
    );

    for (const movie of this.movies) {
      producers.push(movie.producer);
    }
    for (let i = 0; i < producers.length; i++) {
      producerSelectBox.innerHTML += `
        <option>${producers[i]}</option>
      `;
    }
  }

  renderMovies(isFiltered) {
    const movieContainer = document.querySelector('#movies .movies .row');
    if (this.movies == '')
      movieContainer.innerHTML = 'Item not found in our records';
    for (const movie of this.movies) {
      movieContainer.innerHTML = '';
      setTimeout(() => {
        movieContainer.innerHTML += `
      <div class="movie col-md-3 px-0 mx-2 my-3 fadeIn">
      <div class="movie-body card">
        <img
          class="card-img-top"
          src="${movie.posterURL}"
        />
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-genre">
              ${Object.keys(movie.genres)

                .map(key => {
                  return `<span class="genre">${movie.genres[key]}</span>`;
                })
                .join(', ')}
          </p>
        </div>
      </div>
    </div>
      `;
      }, 100);
    }
  }
}

const movies = new Movies();
