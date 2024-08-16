export default function fetchImages(input) {
  const searchParams = new URLSearchParams({
    key: '45320962-957458a2920d861910609dde6',
    q: `${input.value.trim()}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  return fetch(`https://pixabay.com/api/?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
