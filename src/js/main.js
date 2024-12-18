import { QRGenerator } from "./qrGenerator.js";

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
	eventDetails: document.getElementById("event-details"),
	qrContainer: document.createElement("div"),
};

// State Management
const state = {
	currentEvent: null,
	photos: [],
	isCreator: false,
};

// Initialize QR Generator
elements.qrContainer.id = "qr-code";
const qrGenerator = new QRGenerator(elements.qrContainer);

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
        <p class="event-description">${
					state.currentEvent.description
				}</p>
        <p class="event-date">Date: ${new Date(
					state.currentEvent.date
				).toLocaleDateString()}</p>
        ${
					state.isCreator
						? `<div class="event-code">
            <p>Share this code with participants:</p>
            <h3>${state.currentEvent.code}</h3>
            <p>Or scan QR code:</p>
            <div id="qr-container"></div>
         </div>`
						: ""
				}
    `;

	if (state.isCreator) {
		// Get the container for QR code
		const qrContainer = document.getElementById("qr-container");
		if (qrContainer) {
			try {
				// Create new QR code
				new QRCode(qrContainer, {
					text: state.currentEvent.code,
					width: 180,
					height: 180,
					colorDark: "#000000",
					colorLight: "#ffffff",
					correctLevel: QRCode.CorrectLevel.H,
				});
				console.log(
					"QR Code generated directly for:",
					state.currentEvent.code
				); // Debug log
			} catch (error) {
				console.error("Error generating QR code:", error);
				qrContainer.innerHTML =
					'<p style="color: red;">Error generating QR code</p>';
			}
		}
	}
}

function generateEventCode() {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	const length = 6;
	let code = "";

	// Generate random code
	for (let i = 0; i < length; i++) {
		code += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	return code;
}

// API Functions (to be implemented with your preferred backend)
async function createEvent(eventData) {
	// For now, just return the event data
	// In a real implementation, this would send the data to a backend server
	return eventData;
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
	// Check for existing session and restore state if needed
});
