const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const gallery = document.getElementById("gallery");
const captureButton = document.getElementById("capture");
const constraints = { video: true }; // Utilisation de la caméra
const photos = []; // Tableau pour stocker les photos capturées

// Accéder à la caméra et afficher la vidéo
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream; // Diffuse la vidéo dans l'élément <video>
  } catch (error) {
    console.error("Erreur lors de l’accès à la caméra :", error);
    alert("Impossible d’accéder à la caméra");
  }
}

// Capturer une photo
function capturePhoto() {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth; // Définit la taille du canvas
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height); // Capture l'image
  const dataUrl = canvas.toDataURL("image/png"); // Convertit en Base64
  // Ajouter l'image capturée au tableau
  photos.push(dataUrl);

  // Mettre à jour la galerie
  updateGallery();
}

// Ajouter des photos uploadées à la galerie
function handleUpload(event) {
  const files = event.target.files; // Récupère les fichiers uploadés

  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        photos.push(e.target.result); // Ajoute la photo au tableau
        updateGallery(); // Met à jour la galerie
      };

      reader.readAsDataURL(file); // Lit le fichier en Base64
    } else {
      alert("Veuillez sélectionner uniquement des fichiers image.");
    }
  });
}

// Mettre à jour l'affichage de la galerie
function updateGallery() {
  // Efface le contenu actuel de la galerie
  gallery.innerHTML = "";

  // Parcourt le tableau des photos et les ajoute à la galerie
  photos.forEach((photoSrc, index) => {
    const img = document.createElement("img");
    img.src = photoSrc;
    img.alt = `Photo ${index + 1}`;
    img.style.width = "400px"; // Ajustez la taille selon vos besoins
    img.style.margin = "5px";

    // Ajoutez l'image à la galerie
    gallery.appendChild(img);
  });
}

// Événement : démarrer la caméra
document.addEventListener("DOMContentLoaded", startCamera);

// Événement : capturer une photo
captureButton.addEventListener("click", capturePhoto);

// Événement : ajouter des photos uploadées
fileInput.addEventListener("change", handleUpload);
