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
const imgItem = document.querySelector('photo-item');

const gallery = new SimpleLightbox('.list-images a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let page = 1;
let totalLoadedImages = 0;
let currentQuery = '';

form.addEventListener('submit', e => {
  e.preventDefault();
  listImages.innerHTML = '';
  loader.style.display = 'block';
  currentQuery = input.value.trim();

  fetchImages(input)
    .then(photos => {
      if (photos.hits.length === 0) {
        iziToast.error({
          timeout: 2500,
          position: 'topRight',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        loader.style.display = 'none';

        return;
      } else {
        const markup = imgList(photos.hits);
        listImages.innerHTML = markup;
        totalLoadedImages = photos.hits.length;
        loader.style.display = 'none';
        gallery.refresh();
        moreBtn.style.display = 'flex';
      }
    })
    .catch(error => {
      console.log(error);
    });
  input.value = '';
});

moreBtn.addEventListener('click', async => {
  page += 1;
  loader.style.display = 'block';

  fetchImages({ value: currentQuery }, page)
    .then(photos => {
      totalLoadedImages += photos.hits.length;
      if (totalLoadedImages >= photos.totalHits) {
        iziToast.error({
          position: 'topRight',
          message: "We're sorry, but you've reached the end of search results.",
        });
        loader.style.display = 'none';
        moreBtn.style.display = 'none';
        return;
      }
      const markup = imgList(photos.hits);
      listImages.insertAdjacentHTML('beforeend', markup);
      gallery.refresh();
      loader.style.display = 'none';
    })
    .catch(error => {
      console.log(error);
      loader.style.display = 'none';
    });
  
  window.scrollBy({
    top: 400,
    behavior: 'smooth',
  });
});
