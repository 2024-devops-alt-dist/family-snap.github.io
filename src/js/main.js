import { QRGenerator } from "./qrGenerator.js";
import { translations } from "./translations.js";

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
	backButtons: document.querySelectorAll(".back-btn"),
	languageSelector: document.getElementById("language-selector"),
};

// State Management
const state = {
	currentEvent: null,
	photos: [],
	isCreator: false,
	currentLanguage: localStorage.getItem("language") || "en",
};

// Initialize QR Generator
elements.qrContainer.id = "qr-code";
const qrGenerator = new QRGenerator(elements.qrContainer);

// Language handling
function updateLanguage(lang) {
	state.currentLanguage = lang;
	localStorage.setItem("language", lang);
	updateUIText();
}

function updateUIText() {
	const t = translations[state.currentLanguage];

	// Update static text
	document.querySelector("h1").textContent = t.title;
	document.querySelector("#welcome-section h2").textContent =
		t.welcome;
	elements.createEventBtn.textContent = t.createEvent;
	elements.joinEventBtn.textContent = t.joinEvent;

	// Update form texts
	document.querySelector("#event-form h2").textContent =
		t.createNewEvent;
	document.querySelector('label[for="event-title"]').textContent =
		t.eventTitle;
	document.querySelector(
		'label[for="event-description"]'
	).textContent = t.description;
	document.querySelector('label[for="event-date"]').textContent =
		t.date;

	// Update buttons
	document.querySelector(
		"#create-event-form .btn.primary"
	).textContent = t.create;
	document
		.querySelectorAll(".back-btn")
		.forEach((btn) => (btn.textContent = t.back));

	// Update join form
	document.querySelector("#join-form h2").textContent = t.joinEvent;
	document.querySelector('label[for="event-code"]').textContent =
		t.enterEventCode;
	document.querySelector(
		"#join-event-form .btn.primary"
	).textContent = t.join;

	// Update photo controls
	elements.takePhotoBtn.textContent = t.takePhoto;
	elements.uploadPhotoBtn.textContent = t.uploadPhoto;

	// Update footer
	document.querySelector("footer p").textContent = t.footer;

	// Update event view if there's a current event
	if (state.currentEvent) {
		updateEventView();
	}
}

// Event Handlers
elements.languageSelector.addEventListener("change", (e) => {
	updateLanguage(e.target.value);
});

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

// Back button functionality
elements.backButtons.forEach((button) => {
	button.addEventListener("click", () => {
		hideAllSections();
		elements.welcomeSection.classList.remove("hidden");
		// Reset form if needed
		const form = button.closest("form");
		if (form) {
			form.reset();
		}
	});
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

	const t = translations[state.currentLanguage];
	const eventDetails = document.getElementById("event-details");
	eventDetails.innerHTML = `
        <h2>${state.currentEvent.title}</h2>
        <p class="event-description">${
					state.currentEvent.description
				}</p>
        <p class="event-date">${t.date}: ${new Date(
		state.currentEvent.date
	).toLocaleDateString(state.currentLanguage)}</p>
        ${
					state.isCreator
						? `<div class="event-code">
            <p>${t.shareCode}:</p>
            <h3>${state.currentEvent.code}</h3>
            <p>${t.orScanQR}:</p>
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
				);
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
	// Set initial language
	elements.languageSelector.value = state.currentLanguage;
	updateUIText();
});
