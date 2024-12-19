import { supabase } from "./supabase-config"


async function uploadImage(file, eventId) {

    const {data, error} = await supabase.storage
    .from("event-images")
    .upload(`${eventId}/${file.name}`, file);

    if(error){
        console.log("Error uploading the image")
        return null
    }

    const imageURL = supabase.storage
        .from("event-images")
        .getPublicUrl(data.path).publicUrl;

    await supabase.from('photos').insert({
    event_id: eventId,
    image_url: publicUrl
    });

  return publicUrl;
}

async function fetchImages(eventId) {
    const { data, error } = await supabase
      .from('photos')
      .select('image_url')
      .eq('event_id', eventId);
  
    if (error) {
      console.error('Error obteniendo imágenes:', error.message);
      return [];
    }
  
    return data.map(photo => photo.image_url);
  }
  
  // Mostrar imágenes en el DOM
  async function displayImages(eventId) {
    const images = await fetchImages(eventId);
    const gallery = document.getElementById('photoGallery');
    gallery.innerHTML = ''; // Limpiar galería existente
  
    images.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Imagen del evento';
      gallery.appendChild(img);
    });
  }
  