const express = require("express");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Serve static files (CSS, JS, etc.)
app.use(express.static("public"));

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Handle QR code generation
app.post("/generate", (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.status(400).send("URL is required");
  }

  // Generate QR code
  const qr_svg = qr.image(url, { type: "png" });
  const qrImagePath = path.join(__dirname, "public", "qr_img.png"));

  qr_svg.pipe(fs.createWriteStream(qrImagePath));

  qr_svg.on("end", () => {
    // Send the QR code image back to the client
    res.send(`
      <h1>QR Code Generated!</h1>
      <img src="/qr_img.png" alt="QR Code">
      <br>
      <a href="/">Generate Another QR Code</a>
    `);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});