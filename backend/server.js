import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import contactRoute from "./routes/contact.js";


dotenv.config();


const app = express();


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://nexus-techworks.vercel.app",
        ],

        methods: [
            "GET",
            "POST",
        ],

        credentials: true,
    })
);


app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        message: "Nexus Techworks API is running.",
    });
});


app.use(
    "/api/contact",
    contactRoute
);


const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Nexus Techworks server running on port ${PORT}`
    );

});