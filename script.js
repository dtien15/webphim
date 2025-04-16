let currentPage = 1;
const movieListEl = document.getElementById('movie-list');
const searchInput = document.getElementById('searchInput');
const moviePlayer = document.getElementById('movie-player');
const movieTitle = document.getElementById('movie-title');
const playerSection = document.getElementById('player-section');
const pageNumber = document.getElementById('pageNumber');

const getMovies = (page = 1, keyword = '') => {
  movieListEl.innerHTML = '<p>Đang tải phim...</p>';
  fetch(`https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`)
    .then(res => res.json())
    .then(data => {
      movieListEl.innerHTML = '';
      const movies = data.items.filter(m => m.name.toLowerCase().includes(keyword.toLowerCase()));
      if (movies.length === 0) {
        movieListEl.innerHTML = '<p>Không tìm thấy phim phù hợp.</p>';
        return;
      }
      movies.forEach(movie => {
        const div = document.createElement('div');
        div.className = 'movie-item';
        div.innerHTML = `
        <img src="https://img.ophim.live/uploads/movies/${movie.thumb_url}" alt="${movie.name}">
          <div class="movie-title">${movie.name}</div>
        `;
        div.onclick = () => playMovie(movie.slug);
        movieListEl.appendChild(div);
      });
    });
};

const playMovie = (slug) => {
  fetch(`https://ophim1.com/phim/${slug}`)
    .then(res => res.json())
    .then(data => {
      const link = data.episodes[0].server_data[0].link_embed;
      moviePlayer.src = link;
      movieTitle.innerText = data.movie.name;
      playerSection.classList.remove('hidden');
      movieListEl.style.display = 'none';
      document.querySelector('.pagination').style.display = 'none';
    });
};

searchInput.addEventListener('input', () => getMovies(currentPage, searchInput.value));

getMovies();

document.getElementById('prevPage').onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    pageNumber.innerText = currentPage;
    getMovies(currentPage);
  }
};
document.getElementById('nextPage').onclick = () => {
  currentPage++;
  pageNumber.innerText = currentPage;
  getMovies(currentPage);
};
document.getElementById('backBtn').onclick = () => {
  moviePlayer.src = '';
  playerSection.classList.add('hidden');
  movieListEl.style.display = 'flex';
  document.querySelector('.pagination').style.display = 'block';
};
