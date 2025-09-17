const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//Task-6
public_users.post("/register", (req,res) => {
    const username = req.body.username || req.query.username;
    const password = req.body.password || req.query.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password required"});
  }

  if (isValid(username)) { // Now assuming isValid returns true if user exists
    return res.status(409).json({message: "User already exists!"});
  }

  users.push({"username": username, "password": password});
  return res.status(201).json({message: "User successfully registered"});
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

//Task-10-13 common function
// Function to fetch book list using Promise callbacks
function getBookListWithPromise(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
   // Function to fetch book list using async-await
  async function getBookListAsync(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error; // Re-throw the error for handling in the route
    }
  }
    //Task-10 With Promise
  public_users.get('/promise', function (req, res) {
    try {
      getBookListWithPromise('http://localhost:5000/') 
        .then(bookList => {
          res.json(bookList);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book list" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });
    //Task-10 With Async
  public_users.get('/async', async function (req, res) {
    try {
      const bookList = await getBookListAsync('http://localhost:5000/'); //
      res.json(bookList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book list" });
    }
  });
  
  // Task-11 With Promise
  public_users.get('/promise/isbn/:isbn', function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      getBookListWithPromise("http://localhost:5000/isbn/" + requestedIsbn) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });
  // Task-11 With Async
  public_users.get('/async/isbn/:isbn', async function (req, res) {
    try {
      const requestedIsbn = req.params.isbn;
      const book = await getBookListAsync("http://localhost:5000/isbn/" + requestedIsbn);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  
  // Task-12 With Promise
  public_users.get('/promise/author/:author', function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      getBookListWithPromise("http://localhost:5000/author/" + requestedAuthor) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });
  // Task-12 With Async
  public_users.get('/async/author/:author', async function (req, res) {
    try {
      const requestedAuthor = req.params.author;
      const book = await getBookListAsync("http://localhost:5000/author/" + requestedAuthor);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  
  // Task-13 With Promise
  public_users.get('/promise/title/:title', function (req, res) {
    try {
      const requestedTitle = req.params.title;
      getBookListWithPromise("http://localhost:5000/title/" + requestedTitle) 
        .then(book => {
          res.json(book);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: "Error retrieving book details" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Unexpected error" });
    }
  });
  // Task-13 With Async
  public_users.get('/async/title/:title', async function (req, res) {
    try {
      const requestedTitle = req.params.title;
      const book = await getBookListAsync("http://localhost:5000/title/" + requestedTitle);
      res.json(book);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving book details" });
    }
  });
  
  module.exports = {
    general: public_users,
    getBookListWithPromise,
    getBookListAsync
  };


