import { supabase } from "./supabase-config.js"
import { getCurrentData } from "./main.js";

const baseURL = 'https://phaavyhwbzmzfrndwkwb.supabase.co/storage/v1/object/public/';

async function fetchEventData() {
    const data = await getCurrentData();
    console.log('data code es:', data.code);

    const code = data.code || '';
    console.log('event code es:', code);
    return code
}

const eventId = await fetchEventData();
console.log('event id es:', eventId);

async function uploadImage(file, eventId) {
    const { data, error } = await supabase.storage
        .from("event-images") 
        .upload(`${eventId}/${file.name}`, file);
        console.log(`Uploading image with path: ${eventId}/${file.name}`);
        if (error) {
            console.log("Error uploading the image:", error.message);  // Asegúrate de ver los errores
            return null;
        } else {
            console.log("Image correctly uploaded:", data);
        }
    const imageURL = `${baseURL}/event-images/${eventId}/${file.name}`;

    const uploadedPath = data.path;
    
    // const { publicURL, error: urlError } = supabase.storage
    //     .from("event-images")
    //     .getPublicUrl(data.path);
    // if (urlError) {
    //     console.log("Error getting public URL:", urlError.message);
    //     return null;
    // }
        
    // console.log('url', publicURL)
    await supabase.from('photos').insert({
        event_id: parseInt(eventId),
        path: imageURL
    });

    return imageURL; 
}

// Choose a photo from the gallery 
document.getElementById("fileInputButton").addEventListener("click", () => {
    document.getElementById("fileInput").click();  
});

document.getElementById("fileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];  
    console.log('file',file)
    if (file) {
        console.log('file',file)
        const imageUrl = await uploadImage(file, eventId);
        if (imageUrl) {
            console.log('Imagen subida correctamente:', imageUrl);
        }
    }
});

// Take a photo with the camera
const videoElement = document.getElementById("video");
document.getElementById("capture").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        const file = new File([blob], "captura.jpg", { type: "image/jpeg" });
        const imageUrl = await uploadImage(file, eventId);
        if (imageUrl) {
            console.log("Imagen subida correctamente:", imageUrl);
        }
    }, "image/jpeg");
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
  