// Book Class: Represents a book

class Book{
    constructor(title,author,price){
        this.title = title;
        this.author =  author;
        this.price = price;
    }
}

// UI Class: Handle UI tasks

class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML =`
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.price}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if( el.classList.contains('delete') ) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanishing the alert in 3 sec
        setTimeout(() => { document.querySelector('.alert').remove() }, 1500);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#price').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
      let books;
      if( localStorage.getItem('books') === null ){
         books = [];
      } else{
         books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
    }
    static addBook(book) {
      const books = Store.getBooks();

      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(title) {
      const books = Store.getBooks();

      books.forEach((book, index) => {
          if( book.title === title ) {
             books.splice(index, 1);
          }
      });

      localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : Displays Book
document.addEventListener('DOMContentLoaded',UI.displayBooks);

// Event : Add A Book

document.querySelector('#book-form').addEventListener('submit',(e) => {
    // Prevent actual Submit
    e.preventDefault();
    // Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const price = document.querySelector('#price').value;

    // Validate
    if( title === '' || author === '' || price === '' ) {
        UI.showAlert('Please fill in all fields', 'danger');
    } else{
        // Instanstiate a book
        const book = new Book(title,author,price);

        // Add book to UI
        UI.addBookToList(book);

        // Add book to Store
        Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');
        
        // Clear Fields
        UI.clearFields();
    }

});
// Event : Remove A Book
document.querySelector('#book-list').addEventListener('click',(e) => {
    // Remove from UI
    UI.deleteBook(e.target);

    // Remove From The Store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book Removed', 'success');
});