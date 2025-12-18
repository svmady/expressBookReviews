const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const router = express.Router();
const axios = require('axios');

const app = express();

app.use(express.json());

router.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

router.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found" });
    }
});

router.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found for this author" });
    }
});

router.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "No books found with this title" });
    }
});


app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session.authorization) {
        return res.status(401).json({ message: "User not logged in" });
    }

    const token = req.session.authorization.accessToken;
       
    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
