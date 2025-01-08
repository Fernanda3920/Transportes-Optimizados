
const fetchFlickrImages = async (placeName, setFlickrImages) => {
  try {
    const apiKey = 'api_key';
    const response = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${placeName}&format=json&nojsoncallback=1`);

    if (!response.ok) {
      throw new Error('Error al obtener las imágenes de Flickr. Código de error: ' + response.status);
    }

    const data = await response.json();

    if (data.photos && data.photos.photo.length > 0) {
      const images = data.photos.photo.slice(0, 5).map(photo => ({
        url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
        title: photo.title
      }));
      setFlickrImages(images);
    } else {
      setFlickrImages([]);
    }
  } catch (error) {
    console.error('Error fetching Flickr images:', error);
    setFlickrImages([]);
  }
};

export default fetchFlickrImages;
