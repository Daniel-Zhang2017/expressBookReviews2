const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


//Task-6
public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
   res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
    res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  try {
    // Retrieve author from request parameters
    // This extracts the author name from the URL path (e.g., /author/Jane%20Austen)
    const requestedAuthor = req.params.author;
    
    // Initialize an empty array to store books by the requested author
    const matchingBooks = [];

    // Get all book keys (ISBNs) from the books object
    // This returns an array of keys like ["1", "2", "3", ...]
    const bookKeys = Object.keys(books);

    // Iterate through all book keys and find matches
    for (const key of bookKeys) {
      // Access the book object using the current key (ISBN)
      const book = books[key];
      
      // Check if the book's author exactly matches the requested author
      // Note: This is case-sensitive comparison
      if (book.author === requestedAuthor) {
        // Add the matching book to the results array
        matchingBooks.push(book);
      }
    }

    // Check if any books were found
    if (matchingBooks.length > 0) {
      // Send matching books as a JSON response
      // Returns array of book objects with author, title, and reviews
      res.json(matchingBooks);
    } else {
      // Handle case where no books were found by the author
      // Return 404 status with informative message
      res.status(404).json({ message: "No books found by that author" });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    
    // Handle unexpected server errors
    // Return 500 status with generic error message
    res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try {
    // Retrieve author from request parameters
    // This extracts the author name from the URL path (e.g., /author/Jane%20Austen)
    const requestedTitle = req.params.title;
    
    // Initialize an empty array to store books by the requested author
    const matchingBooks = [];

    // Get all book keys (ISBNs) from the books object
    // This returns an array of keys like ["1", "2", "3", ...]
    const bookKeys = Object.keys(books);

    // Iterate through all book keys and find matches
    for (const key of bookKeys) {
      // Access the book object using the current key (ISBN)
      const book = books[key];
      
      // Check if the book's author exactly matches the requested author
      // Note: This is case-sensitive comparison
      if (book.title === requestedTitle) {
        // Add the matching book to the results array
        matchingBooks.push(book);
      }
    }

    // Check if any books were found
    if (matchingBooks.length > 0) {
      // Send matching books as a JSON response
      // Returns array of book objects with author, title, and reviews
      res.json(matchingBooks);
    } else {
      // Handle case where no books were found by the author
      // Return 404 status with informative message
      res.status(404).json({ message: "No books found by that author" });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    
    // Handle unexpected server errors
    // Return 500 status with generic error message
    res.status(500).json({ message: "Error retrieving books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    try {
        // Retrieve ISBN from request parameters
        // Extracts the ISBN from the URL path (e.g., /review/1)
        const requestedIsbn = req.params.isbn;
        
        // Look up the book in the books object using the ISBN as key
        // Returns the book object if found, undefined if not found
        const book = books[requestedIsbn];
    
        // Check if the book exists in the collection
        if (book) {
          // Extract the reviews object from the book
          // This contains all reviews for the specified book
          const reviews = book.reviews;
          
          // Send the reviews as a JSON response
          // Returns the reviews object directly
          res.json(reviews);
        } else {
          // Handle case where book with the specified ISBN is not found
          // Return 404 status with appropriate error message
          res.status(404).json({ message: "Book not found" });
        }
      } catch (error) {
        // Log the error to the console for debugging purposes
        console.error(error);
        
        // Handle any unexpected server errors
        // Return 500 status with generic error message
        res.status(500).json({ message: "Error retrieving reviews" });
      }
});

module.exports.general = public_users;
