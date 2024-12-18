export class QRGenerator {
	constructor(container) {
		this.container = container;
		this.qrcode = null;
	}

	generate(data) {
		try {
			// Clear previous QR code if any
			this.container.innerHTML = "";
			if (this.qrcode) {
				this.qrcode.clear();
			}

			// Create new QR code
			this.qrcode = new QRCode(this.container, {
				text: data,
				width: 180,
				height: 180,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: QRCode.CorrectLevel.H,
			});

			console.log("QR Code generated for:", data);
		} catch (error) {
			console.error("Error generating QR code:", error);
			this.container.innerHTML =
				'<p style="color: red;">Error generating QR code</p>';
		}
	}
}
