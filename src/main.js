import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import imgList from './js/render-functions.js';
import fetchImages from './js/pixabay-api.js';

const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchImg');
const listImages = document.querySelector('.list-images');
const loader = document.querySelector('.loader');
const moreBtn = document.querySelector('#moreBtn');

const gallery = new SimpleLightbox('.list-images a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let page = 1;
let totalLoadedImages = 0;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', e => {
  e.preventDefault();
  listImages.innerHTML = '';
  loader.style.display = 'block';
  currentQuery = input.value.trim();
  page = 1;

  fetchImages(currentQuery)
    .then(photos => {
      totalHits = photos.totalHits;
      const totalPages = Math.ceil(totalHits / 15);

      if (photos.hits.length === 0) {
        iziToast.error({
          timeout: 2500,
          position: 'topRight',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        loader.style.display = 'none';
        moreBtn.style.display = 'none';
        return;
      }
      const markup = imgList(photos.hits);
      listImages.innerHTML = markup;
      totalLoadedImages = photos.hits.length;
      moreBtn.style.display = page < totalPages ? 'flex' : 'none';
      loader.style.display = 'none';
      gallery.refresh();
    })
    .catch(error => {
      iziToast.error({
        timeout: 2500,
        position: 'topRight',
        message: `Error: ${error.message || 'Something went wrong'}`,
      });
      loader.style.display = 'none';
      moreBtn.style.display = 'none';
    });
  input.value = '';
});

moreBtn.addEventListener('click', () => {
  page += 1;
  loader.style.display = 'block';
  moreBtn.style.display = 'none';

  fetchImages(currentQuery, page)
    .then(photos => {
      totalLoadedImages += photos.hits.length;
      const totalPages = Math.ceil(totalHits / 15);
      
      const markup = imgList(photos.hits);
      listImages.insertAdjacentHTML('beforeend', markup);
      gallery.refresh();
      loader.style.display = 'none';

      if (page >= totalPages || totalLoadedImages >= totalHits) {
        iziToast.error({
          position: 'topRight',
          message: "We're sorry, but you've reached the end of search results.",
        });
        moreBtn.style.display = 'none';
      } else {
        moreBtn.style.display = 'flex';
      }
      
      const imgItem = document.querySelector('.photo-item');
      const cardHeight = imgItem.getBoundingClientRect().height;

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    })
    .catch(error => {
      iziToast.error({
        timeout: 2500,
        position: 'topRight',
        message: `Error: ${error.message || 'Something went wrong'}`,
      });
      loader.style.display = 'none';
      moreBtn.style.display = 'flex';
    });
});
