const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
   
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        const requestedIsbn = req.params.isbn;
        const reviewText = req.query.review;
        const username = req.session.authorization.username; // Assuming username is stored in the session
    
        if (!username) {
          return res.status(401).json({ message: "Unauthorized" }); // Handle unauthorized access
        }
    
        const book = books[requestedIsbn];
    
        if (book) {
          book.reviews[username] = reviewText; // Add or modify review based on username
          res.json({ message: "Review added/modified successfully" });
        } else {
          res.status(404).json({ message: "Book not found" }); // Handle book not found
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding/modifying review" }); // Handle unexpected errors
      }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
