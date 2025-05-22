const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 8080;

// Logujemy zmienne œrodowiskowe przy starcie serwera
console.log("Starting TTLock Auth Server with the following environment variables:");
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("REDIRECT_URI:", process.env.REDIRECT_URI);
// Nie pokazujemy client_secret dla bezpieczeñstwa

app.get("/", (req, res) => {
    res.send("TTLock Auth Server is running");
});

app.get("/callback", async (req, res) => {
    console.log("Callback endpoint hit. Query parameters received:", req.query);

    const { code } = req.query;

    if (!code) {
        console.log("No code received in callback");
        return res.status(400).send("No code provided");
    }

    try {
        const response = await axios.post("https://euopen.ttlock.com/oauth2/token", null, {
            params: {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: process.env.REDIRECT_URI,
                code,
                grant_type: "authorization_code"
            }
        });

        console.log("Token response received from TTLock:", response.data);

        res.send("Zalogowano pomyœlnie. Mo¿esz zamkn¹æ to okno.");
    } catch (error) {
        console.error("Error exchanging code for token:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error message:", error.message);
        }

        res.status(500).send("Error exchanging code for token");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
