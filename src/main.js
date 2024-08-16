import axios from 'axios';

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
const gallery = new SimpleLightbox('.list-images a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', e => {
  e.preventDefault();
  listImages.innerHTML = '';
  loader.style.display = 'block';
  fetchImages(input)
    .then(photos => {
      if (photos.hits.length === 0) {
        setTimeout(() => {
          iziToast.error({
            timeout: 2500,
            position: 'topRight',
            message:
              'Sorry, there are no images matching your search query. Please try again!',
          });
          loader.style.display = 'none';
        }, 3000);
        return;
      } else {
        setTimeout(() => {
          const markup = imgList(photos.hits);
          listImages.innerHTML = markup;
          loader.style.display = 'none';
          gallery.refresh();
        }, 1500);
      }
    })
    .catch(error => {
      console.log(error);
    });

  input.value = '';
});
