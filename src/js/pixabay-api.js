import axios from 'axios';

const fetchImages = async (input, page = 1) => {
  let perPage = 15;

  const searchParams = new URLSearchParams({
    key: '45320962-957458a2920d861910609dde6',
    q: `${input}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page: page,
  });
  const response = await axios.get(`https://pixabay.com/api/?${searchParams}`);
  return response.data;
};

export default fetchImages;
