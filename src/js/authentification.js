// Références DOM
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const notificationModal = document.getElementById(
	"notification-modal"
);
const notificationMessage = document.getElementById(
	"notification-message"
);

function showNotification(message, duration = 3000) {
	if (!notificationModal || !notificationMessage) {
		console.error("Notification elements not found");
		return;
	}

	notificationMessage.textContent = message;
	notificationModal.classList.remove("hidden");

	// Clear any existing timeout
	if (window.notificationTimeout) {
		clearTimeout(window.notificationTimeout);
	}

	window.notificationTimeout = setTimeout(() => {
		notificationModal.classList.add("hidden");
	}, duration);
}

// Initialize notification elements after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	if (!notificationModal || !notificationMessage) {
		console.error(
			"Notification elements not found during initialization"
		);
	}
});

export function showLoginSection(hideAllSections) {
	loginBtn.addEventListener("click", () => {
		hideAllSections();
		loginSection.classList.remove("hidden");
	});

	// Link to register section
	document
		.getElementById("show-register-btn")
		.addEventListener("click", (e) => {
			e.preventDefault();
			hideAllSections();
			registerSection.classList.remove("hidden");
		});
}

export function showRegisterSection(hideAllSections) {
	// Lien vers la section de connexion
	document
		.getElementById("show-login-btn")
		.addEventListener("click", (e) => {
			e.preventDefault();
			hideAllSections();
			loginSection.classList.remove("hidden");
		});

	document
		.getElementById("show-register-btn")
		.addEventListener("click", (e) => {
			e.preventDefault();
			hideAllSections();
			registerSection.classList.remove("hidden");
		});
}

export function handleLoginForm(
	hideAllSections,
	welcomeSection,
	supabase
) {
	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = e.target.querySelector("#email").value;
		const password = e.target.querySelector("#password").value;

		try {
			// Try to connect with supabase
			const { user, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				showNotification("Login failed: " + error.message);
			} else {
				showNotification("Login successful!");
				hideAllSections();
				welcomeSection.classList.remove("hidden");

				loginBtn.classList.add("hidden");
				logoutBtn.classList.remove("hidden");
			}
		} catch (err) {
			console.error("Unexpected error:", err);
			showNotification("Unexpected error. Please try again later.");
		}
	});
}

function validateEmail(email) {
	const emailPattern =
		/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	return emailPattern.test(email);
}

export function handleRegisterForm(
	hideAllSections,
	welcomeSection,
	supabase
) {
	registerForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = e.target.querySelector("#register-email").value; // Récupération de l'email
		const password = e.target.querySelector(
			"#register-password"
		).value;

		if (!validateEmail(email)) {
			showNotification("Please enter a valid email address.");
			return;
		}

		try {
			// Try to register with supabase
			const { user, error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) {
				showNotification("Registration failed: " + error.message);
			} else {
				showNotification(
					"Registration successful! Please check your email to confirm."
				);
				hideAllSections();
				welcomeSection.classList.remove("hidden");
			}
		} catch (err) {
			console.error("Unexpected error:", err);
			showNotification("Unexpected error. Please try again later.");
		}
	});
}

export function handleLogout(supabase) {
	logoutBtn.addEventListener("click", async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			showNotification("Logout failed: " + error.message);
		} else {
			showNotification("Logged out successfully!");
			loginBtn.classList.remove("hidden");
			logoutBtn.classList.add("hidden");
		}
	});
}

export function setupBackButtons(hideAllSections, welcomeSection) {
	document.querySelectorAll(".back-btn").forEach((button) => {
		button.addEventListener("click", () => {
			hideAllSections();
			welcomeSection.classList.remove("hidden");
		});
	});
}
