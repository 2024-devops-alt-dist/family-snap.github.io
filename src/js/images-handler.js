import { supabase } from "./supabase-config"
const eventId = 0;

async function uploadImage(file, eventId) {
    const { data, error } = await supabase.storage
        .from("event-images") 
        .upload(`${eventId}/${file.name}`, file);  

    if (error) {
        console.log("Error uploading the image:", error.message);
        return null;
    }

    
    const imageURL = supabase.storage
        .from("event-images")
        .getPublicUrl(data.path).publicUrl;  

    await supabase.from('photos').insert({
        event_id: eventId,
        image_url: imageURL  
    });

    return imageURL; 
}
document.getElementById("join-event-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const eventCode = document.getElementById("event-code").value;
    eventId = eventCode;
});

// Choose a photo from the gallery 
document.getElementById("upload-photo").addEventListener("click", () => {
    document.getElementById("fileInput").click();  
});

document.getElementById("fileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];  

    if (file) {
        const imageUrl = await uploadImage(file, eventId);
        if (imageUrl) {
            console.log('Imagen subida correctamente:', imageUrl);
        }
    }
});

// Take a photo with the camera
document.getElementById("take-photo").addEventListener("click", () => {
    document.getElementById("cameraInput").click();
});


document.getElementById("cameraInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (file) {
        const imageUrl = await uploadImage(file, eventId);
        if (imageUrl) {
            console.log("Imagen subida correctamente:", imageUrl);
        }
    }
});

// async function fetchImages(eventId) {
//     const { data, error } = await supabase
//       .from('photos')
//       .select('image_url')
//       .eq('event_id', eventId);
  
//     if (error) {
//       console.error('Error obteniendo imágenes:', error.message);
//       return [];
//     }
  
//     return data.map(photo => photo.image_url);
//   }
  
//   // Mostrar imágenes en el DOM
//   async function displayImages(eventId) {
//     const images = await fetchImages(eventId);
//     const gallery = document.getElementById('photoGallery');
//     gallery.innerHTML = ''; // Limpiar galería existente
  
//     images.forEach(url => {
//       const img = document.createElement('img');
//       img.src = url;
//       img.alt = 'Imagen del evento';
//       gallery.appendChild(img);
//     });
//   }
  