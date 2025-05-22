const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("TTLock Auth Server is running");
});

app.get("/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        console.log("No code received in callback");
        return res.status(400).send("No code provided");
    }

    console.log("Callback received:", req.query);

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

        console.log("Token response:", response.data);

        // Pokazanie u¿ytkownikowi, ¿e wszystko posz³o dobrze:
        res.send("Zalogowano pomyœlnie. Mo¿esz zamkn¹æ to okno.");

        // lub alternatywnie:
        // res.json(response.data); // Jeœli chcesz wyœwietliæ token JSON
    } catch (error) {
        console.error("Error exchanging code for token:", error.response?.data || error.message);
        res.status(500).send("Error exchanging code for token");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
