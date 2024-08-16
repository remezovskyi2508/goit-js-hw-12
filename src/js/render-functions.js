export default function imgList(photos) {
  const markup = photos
    .map(photo => {
      return `<li class="photo-item">
        <a href="${photo.largeImageURL}"><img class="img-item" src="${photo.webformatURL}" alt="${photo.tags}"/></a> 
        <div class="descr-wrapper">
        <p class="descr"><span class='label-img'>Likes</span> ${photo.likes}</p>
        <p class="descr"><span class='label-img'>Views</span> ${photo.views}</p>
        <p class="descr"><span class='label-img'>Comments</span> ${photo.comments}</p>
        <p class="descr"><span class='label-img'>Downloads</span> ${photo.downloads}</p>
        </div>
      </li>`;
    })
    .join('');
  return markup;
}
