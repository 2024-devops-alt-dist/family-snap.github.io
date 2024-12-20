import { supabase } from "./supabase-config.js";
import { getCurrentData } from "./main.js";

const baseURL =
	"https://nyrvwnhonznixxnclqbg.supabase.co/storage/v1/object/public/";

// Initialize camera constraints
const constraints = { video: true };

// Track initialization state
let isInitialized = false;

// Store handlers for proper cleanup
const handlers = {
	clickHandler: null,
	changeHandler: null,
	captureHandler: null,
};

// Access camera and display video
async function startCamera() {
	try {
		const video = document.getElementById("video");
		if (!video) return;

		const stream = await navigator.mediaDevices.getUserMedia(
			constraints
		);
		video.srcObject = stream;
	} catch (error) {
		console.error("Error accessing camera:", error);
		alert("Could not access camera");
	}
}

async function uploadImage(file, eventCode, eventId) {
	try {
		if (!eventCode || !eventId) {
			console.error("Missing event code or ID");
			return null;
		}

		console.log(
			`Starting upload for file: ${file.name} to event: ${eventCode}`
		);

		const { data, error } = await supabase.storage
			.from("event-images")
			.upload(`${eventCode}/${file.name}`, file);

		if (error) {
			console.error("Error uploading the image:", error.message);
			return null;
		}

		console.log("Image uploaded successfully:", data);
		const imageURL = `${baseURL}/event-images/${eventCode}/${file.name}`;

		const { error: photoError } = await supabase
			.from("photos")
			.insert({
				event_id: eventId,
				path: imageURL,
			});

		if (photoError) {
			console.error("Error saving photo record:", photoError.message);
			return null;
		}

		return imageURL;
	} catch (error) {
		console.error("Unexpected error during upload:", error);
		return null;
	}
}

function cleanupHandlers() {
	const fileInput = document.getElementById("fileInput");
	const fileInputButton = document.getElementById("fileInputButton");
	const captureButton = document.getElementById("capture");

	if (fileInputButton && handlers.clickHandler) {
		fileInputButton.removeEventListener(
			"click",
			handlers.clickHandler
		);
	}
	if (fileInput && handlers.changeHandler) {
		fileInput.removeEventListener("change", handlers.changeHandler);
	}
	if (captureButton && handlers.captureHandler) {
		captureButton.removeEventListener(
			"click",
			handlers.captureHandler
		);
	}

	handlers.clickHandler = null;
	handlers.changeHandler = null;
	handlers.captureHandler = null;
	isInitialized = false;
}

async function initializeImageHandlers() {
	// Prevent multiple initializations
	if (isInitialized) {
		console.log("Image handlers already initialized");
		return;
	}

	// Clean up any existing handlers
	cleanupHandlers();

	// Get event data first
	const eventCode = await getCurrentData().then(
		(data) => data.code || ""
	);
	const eventId = localStorage.getItem("currentEventId");

	if (!eventCode || !eventId) {
		console.error("No event code or ID available");
		return;
	}

	// Initialize DOM elements
	const video = document.getElementById("video");
	const canvas = document.getElementById("canvas");
	const gallery = document.getElementById("gallery");
	const captureButton = document.getElementById("capture");
	const fileInput = document.getElementById("fileInput");
	const fileInputButton = document.getElementById("fileInputButton");

	// Handle file selection button
	if (fileInputButton) {
		handlers.clickHandler = () => {
			if (fileInput) {
				fileInput.click();
			}
		};
		fileInputButton.addEventListener("click", handlers.clickHandler);
	}

	// Handle file selection
	if (fileInput) {
		handlers.changeHandler = async (event) => {
			const files = event.target.files;
			if (!files || files.length === 0) return;

			for (const file of files) {
				if (!file.type.startsWith("image/")) {
					alert("Please select only image files.");
					continue;
				}

				const imageUrl = await uploadImage(file, eventCode, eventId);
				if (imageUrl) {
					// Add the image to the gallery
					if (gallery) {
						const img = document.createElement("img");
						img.src = imageUrl;
						img.alt = "Event photo";

						gallery.appendChild(img);
					}
				}
			}
			// Reset the input to allow selecting the same file again
			event.target.value = "";
		};
		fileInput.addEventListener("change", handlers.changeHandler);
	}

	// Handle camera capture
	if (captureButton) {
		handlers.captureHandler = () => {
			if (!canvas || !video) return;

			const context = canvas.getContext("2d");

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			canvas.toBlob(async (blob) => {
				const file = new File([blob], `capture-${Date.now()}.jpg`, {
					type: "image/jpeg",
				});
				const imageUrl = await uploadImage(file, eventCode, eventId);
				if (imageUrl) {
					// Add the image to the gallery
					if (gallery) {
						const img = document.createElement("img");
						img.src = imageUrl;
						img.alt = "Camera capture";

						gallery.appendChild(img);
					}
				}
			}, "image/jpeg");
		};
		captureButton.addEventListener("click", handlers.captureHandler);
	}

	isInitialized = true;
	console.log("Image handlers initialized successfully");
}

let lastVisibilityState = null;

// Watch for event view becoming visible
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.target.id === "event-view") {
			const isHidden = mutation.target.classList.contains("hidden");

			// Only act if the visibility state has changed
			if (lastVisibilityState !== isHidden) {
				lastVisibilityState = isHidden;

				if (!isHidden) {
					startCamera();
					initializeImageHandlers();
				} else {
					cleanupHandlers();
				}
			}
		}
	});
});

// Start observing when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	const eventView = document.getElementById("event-view");
	if (eventView) {
		lastVisibilityState = eventView.classList.contains("hidden");
		observer.observe(eventView, {
			attributes: true,
			attributeFilter: ["class"],
		});
	}
});
