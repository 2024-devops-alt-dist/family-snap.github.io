import { QRGenerator } from "./qrGenerator.js";
import { translations } from "./translations.js";
import { supabase } from "./supabase-config.js";
import {
	showLoginSection,
	handleLoginForm,
	setupBackButtons,
	showRegisterSection,
	handleRegisterForm,
	handleLogout,
} from "./authentification.js";

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
	gallery: document.getElementById("gallery"),
	capture: document.getElementById("capture"),
	fileInputButton: document.getElementById("fileInputButton"),
	eventTitleDisplay: document.getElementById("event-title-display"),
	eventDescriptionDisplay: document.getElementById(
		"event-description-display"
	),
	eventDateDisplay: document.getElementById("event-date-display"),
	eventCodeDisplay: document.getElementById("event-code-display"),
	qrContainer: document.getElementById("qr-container"),
	backButtons: document.querySelectorAll(".back-btn"),
	languageSelector: document.getElementById("language-selector"),
	loginSection: document.getElementById("login-section"),
	registerSection: document.getElementById("register-section"),
	logoutBtn: document.getElementById("logout-btn"),
};

// State Management
const state = {
	currentEvent: null,
	photos: [],
	isCreator: false,
	currentLanguage: localStorage.getItem("language") || "en",
};

// Initialize QR Generator
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
	if (elements.capture) elements.capture.textContent = t.takePhoto;
	if (elements.fileInputButton)
		elements.fileInputButton.textContent = t.uploadPhoto;

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
let currentData = {};
elements.createEventForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const eventData = {
		title: e.target.querySelector("#event-title").value,
		description: e.target.querySelector("#event-description").value,
		date: e.target.querySelector("#event-date").value,
		code: generateEventCode(),
		createdAt: new Date().toISOString(),
	};
	currentData = eventData;	
	try {
		const eventId = await uploadEvent(eventData); 
		localStorage.setItem('currentEventId', eventId);
		await createEvent(eventData);
		state.currentEvent = eventData;
		state.isCreator = true;
		showEventView();
	} catch (error) {
		console.error("Error creating event:", error);
		alert("Failed to create event. Please try again.");
	}
});
export function getCurrentData() {
    return new Promise((resolve) => {
        const checkData = setInterval(() => {
            if (currentData && currentData.code) {
                clearInterval(checkData);
                resolve(currentData);
            }
        }, 100);
    });
}
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
	elements.loginSection.classList.add("hidden");
	elements.registerSection.classList.add("hidden");
}

// Setup login functionality
showLoginSection(hideAllSections);
handleLoginForm(hideAllSections, elements.welcomeSection, supabase);
showRegisterSection(hideAllSections);
handleRegisterForm(
	hideAllSections,
	elements.welcomeSection,
	supabase
);
handleLogout(supabase);
setupBackButtons(hideAllSections, elements.welcomeSection);

function showEventView() {
	hideAllSections();
	elements.eventView.classList.remove("hidden");
	updateEventView();
}

function updateEventView() {
	if (!state.currentEvent) return;

	const t = translations[state.currentLanguage];

	// Update event details
	if (elements.eventTitleDisplay) {
		elements.eventTitleDisplay.textContent = state.currentEvent.title;
	}
	if (elements.eventDescriptionDisplay) {
		elements.eventDescriptionDisplay.textContent =
			state.currentEvent.description;
	}
	if (elements.eventDateDisplay) {
		elements.eventDateDisplay.textContent = `${t.date}: ${new Date(
			state.currentEvent.date
		).toLocaleDateString(state.currentLanguage)}`;
	}
	if (elements.eventCodeDisplay && state.isCreator) {
		elements.eventCodeDisplay.textContent = state.currentEvent.code;
	}

	// Generate QR code if creator
	if (state.isCreator && elements.qrContainer) {
		qrGenerator.generate(state.currentEvent.code);
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
	return eventData;
}

// get the id of the user that's currently logged
async function getUserId() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Error fetching user:", error.message);
        return null;
    }

    return user?.id;
}

async function uploadEvent(eventData) {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error("Couldn't get the user");
        }

        const { data, error } = await supabase
            .from("events")
            .insert({
                title: eventData.title,
                description: eventData.description,
                date: eventData.date,
                code: eventData.code,
                user_id: userId,
            })
            .select();

        if (error) {
            console.error("Error inserting event:", error.message);
            throw error;
        }

        console.log("Event inserted:", data);
        return data[0]?.id;
    } catch (error) {
        console.error("Error in uploadEvent:", error);
        throw error;
    }
}


// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
	// Set initial language
	elements.languageSelector.value = state.currentLanguage;
	updateUIText();
});
