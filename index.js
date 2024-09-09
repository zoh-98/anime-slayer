const axios = require("axios");
const express = require("express");
const qs = require('qs');
const { log } = require("console");
const App = express();
const PORT = process.env.PORT || 3000;
App.use(express.json());
const headers = {
    "Host": "anslayer.com",
    "Client-Id": "android-app2",
    "Client-Secret": "7befba6263cc14c90d2f1d6da2c5cf9b251bfbbd",
    "Accept": "application/json",
    "Accept": "application/*+json",
    "Accept-Encoding": "gzip, deflate, br",
};

App.get("/search", async (req, res) => {
    const text = req.query.text;
    if (!text ) {
        return res.json({
            err: "403"
        });
    };
    try {
        let response = await axios.get(`https://anslayer.com/anime/public/animes/get-published-animes?json=%7B%22_offset%22%3A0%2C%22_limit%22%3A30%2C%22_order_by%22%3A%22latest_first%22%2C%22list_type%22%3A%22filter%22%2C%22anime_name%22%3A%22${encodeURIComponent(text)}%22%2C%22just_info%22%3A%22Yes%22%7D`, {
            headers: headers
        });
        res.json(response.data);
    } catch (e) {
        res.json({
            err: "403"
        });
        console.log(e);
    }

});

App.get("/getinfo", async (req, res) => {
    const id = req.query.id;
    if (!id || (isNaN(id) == true)) {
        return res.json({
            err: "403"
        });
    };
    try {
        let response = await axios.get(`https://anslayer.com/anime/public/anime/get-anime-details?anime_id=${encodeURIComponent(id)}&fetch_episodes=No&more_info=Yes`, {
            headers: headers
        });
        res.json(response.data);
    } catch (e) {
        res.json({
            err: "403"
        });
    }
});

App.get("/getepisodes", async (req, res) => {
    const id = req.query.id;
    if (!id || (isNaN(id)) == true) {
        return res.json({
            err: "403"
        });
    };
    try {
        let body = qs.stringify({
            'json': {"more_info":"Yes","anime_id":`${id}` }});
        let response = await axios.post(`https://anslayer.com/anime/public/episodes/get-episodes-new`, body, {
            headers: headers
        });
        let arr = response.data.response.data;

let narr = [];
for (const ar of arr) {
   let url = ar.episode_urls[1].episode_url;
   const match = url.match(/n=([^&]*)/);
const ma = match ? match[1] : null;
narr.push({
n: ma,
name: ar.episode_name,
idEPS: ar.episode_id,
rating: ar.episode_rating
});
};
        res.json(narr);
    } catch (e) {
        res.json({
            err: "403"
        });
    }
});


App.post("/downloadEPS", async (req, res) => {
    const id = req.body.id;
    const N = req.body.n;
    const idEPS = req.body.idEPS;

    if (!id || !idEPS || !N) {
        return res.json({ err: "403" });
    }

    const body = {"anime_id": Number(id), "episode_id": idEPS.toString()};
       const config = `n=${N}&json=${encodeURIComponent(JSON.stringify(body))}`;
    try {
        const response = await axios.post("https://anslayer.com/la/public/api/fw", config, {
            headers: headers
        });
        res.json(response.data);
    } catch (e) {
        res.json({ err: "403" });
        console.log(e);
    }
});


App.listen(PORT, () => {
    log(" S R IN PORT: " + PORT)
});