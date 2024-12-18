// DOM Elements
const elements = {
	welcomeSection: document.getElementById("welcome-section"),
	eventForm: document.getElementById("event-form"),
	joinForm: document.getElementById("join-form"),
	eventView: document.getElementById("event-view"),
	createEventBtn: document.getElementById("create-event-btn"),
	joinEventBtn: document.getElementById("join-event-btn"),
	createEventForm: document.getElementById("create-event-form"),
	joinEventForm: document.getElementById("join-event-form"),
	photoGallery: document.getElementById("photo-gallery"),
	takePhotoBtn: document.getElementById("take-photo"),
	uploadPhotoBtn: document.getElementById("upload-photo"),
};

// State Management
const state = {
	currentEvent: null,
	photos: [],
	isCreator: false,
};

// Event Handlers
elements.createEventBtn.addEventListener("click", () => {
	hideAllSections();
	elements.eventForm.classList.remove("hidden");
});

elements.joinEventBtn.addEventListener("click", () => {
	hideAllSections();
	elements.joinForm.classList.remove("hidden");
});

elements.createEventForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const eventData = {
		title: e.target.querySelector("#event-title").value,
		description: e.target.querySelector("#event-description").value,
		date: e.target.querySelector("#event-date").value,
		code: generateEventCode(),
		createdAt: new Date().toISOString(),
	};

	try {
		await createEvent(eventData);
		state.currentEvent = eventData;
		state.isCreator = true;
		showEventView();
	} catch (error) {
		console.error("Error creating event:", error);
		alert("Failed to create event. Please try again.");
	}
});

elements.joinEventForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const eventCode = e.target.querySelector("#event-code").value;

	try {
		const event = await joinEvent(eventCode);
		state.currentEvent = event;
		state.isCreator = false;
		showEventView();
	} catch (error) {
		console.error("Error joining event:", error);
		alert("Invalid event code. Please try again.");
	}
});

// Photo Handling
elements.takePhotoBtn.addEventListener("click", async () => {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
		});
		// Implementation for taking photos will go here
		stream.getTracks().forEach((track) => track.stop());
	} catch (error) {
		console.error("Error accessing camera:", error);
		alert("Unable to access camera. Please check permissions.");
	}
});

elements.uploadPhotoBtn.addEventListener("click", () => {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	input.multiple = true;

	input.addEventListener("change", async (e) => {
		const files = Array.from(e.target.files);
		try {
			for (const file of files) {
				await uploadPhoto(file);
			}
		} catch (error) {
			console.error("Error uploading photos:", error);
			alert("Failed to upload photos. Please try again.");
		}
	});

	input.click();
});

// Utility Functions
function hideAllSections() {
	elements.welcomeSection.classList.add("hidden");
	elements.eventForm.classList.add("hidden");
	elements.joinForm.classList.add("hidden");
	elements.eventView.classList.add("hidden");
}

function showEventView() {
	hideAllSections();
	elements.eventView.classList.remove("hidden");
	updateEventView();
}

function updateEventView() {
	if (!state.currentEvent) return;

	const eventDetails = document.getElementById("event-details");
	eventDetails.innerHTML = `
        <h2>${state.currentEvent.title}</h2>
        <p>${state.currentEvent.description}</p>
        <p>Date: ${new Date(
					state.currentEvent.date
				).toLocaleDateString()}</p>
        ${
					state.isCreator
						? `<p>Event Code: ${state.currentEvent.code}</p>`
						: ""
				}
    `;
}

function generateEventCode() {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// API Functions (to be implemented with your preferred backend)
async function createEvent(eventData) {
	// TODO: Implement with your backend
	return eventData;
}

async function joinEvent(eventCode) {
	// TODO: Implement with your backend
	return {
		title: "Test Event",
		description: "Test Description",
		date: new Date().toISOString(),
		code: eventCode,
	};
}

async function uploadPhoto(file) {
	// TODO: Implement with your backend
	console.log("Uploading photo:", file.name);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
	// Check for existing session and restore state if needed
});
