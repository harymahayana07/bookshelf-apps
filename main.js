const incompleteBook = "incompleteBookshelfList";
const completeBook = "completeBookshelfList";
const bookItemId = "ItemId";

function addBook() {
  const incomplete = document.getElementById(incompleteBook);
  const complete = document.getElementById(completeBook);

  const Title = document.getElementById("inputBookTitle").value;
  const Author = document.getElementById("inputBookAuthor").value;

  const Year = document.getElementById("inputBookYear").value;
  const checkComplete = document.getElementById("inputBookIsComplete").checked;

  const book = makeBook(Title, Author, Year, checkComplete);
  const bookObject = generateBookObject(Title, Author, Year, checkComplete);
  book[bookItemId] = bookObject.id;
  books.push(bookObject);

  if (checkComplete==false){
    incomplete.append(book);
  } else {
    complete.append(book);
  }
  updateDataStorage();
}
function makeBook(Title, Author, Year, checkComplete) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = Title;
  bookTitle.classList.add("move")

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = Author;

  const bookYear = document.createElement("p");
  bookYear.classList.add("year");
  bookYear.innerText = Year;

  const bookIsComplete = createCompleteButton();

  const bookRemove = createRemoveButton();
  bookRemove.innerText = "Hapus";

  const aksi = document.createElement("div");
  aksi.classList.add("action");

  if (checkComplete == true){
    bookIsComplete.innerText = "Belum Selesai";
  } else {
    bookIsComplete.innerText = "Sudah Selesai";
  }

  aksi.append(bookIsComplete, bookRemove);
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.append(bookTitle, bookAuthor, bookYear, aksi);

  return bookItem;
};

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
};

function createCompleteButton() {
  return createButton("green", function(event) {
    const parent = event.target.parentElement;
    addBookFromCompleted(parent.parentElement);
  });
};
function removeBook(bookElement) {
  const bookTarget = findBookIndex(bookElement[bookItemId]);
  if (window.confirm("apakah anda yakin ingin menghapus buku ini dari rak?")) {
    books.splice(bookTarget, 1);
    bookElement.remove();
  }
  updateDataStorage();
};

function createRemoveButton() {
  return createButton("red", function (event) {
    const parent = event.target.parentElement;
    removeBook(parent.parentElement);
  });
};

function addBookFromCompleted(bookElement) {
    
  const addTitle = bookElement.querySelector(".book_item > h3").innerText;
  const addAuthor = bookElement.querySelector(".book_item > p").innerText;
  const addYear = bookElement.querySelector(".year").innerText;
  const addIsComplete = bookElement.querySelector(".green").innerText;

  if (addIsComplete == "Sudah Selesai") {
    const bookNew = makeBook(addTitle, addAuthor, addYear, true);
    const book = findbook(bookElement[bookItemId]);
    book.isCompleted = true;
    bookNew[bookItemId] = book.id;

    const CompleteBookshelfList = document.getElementById(completeBook);
    CompleteBookshelfList.append(bookNew);
  } else {
    const bookNew = makeBook(addTitle, addAuthor, addYear, false);
    const book = findbook(bookElement[bookItemId]);
    book.isCompleted = false;
    bookNew[bookItemId] = book.id;

    const InCompleteBookshelfList = document.getElementById(incompleteBook);
    InCompleteBookshelfList.append(bookNew);
  }
  bookElement.remove();
  updateDataStorage();
};

function refreshDatabook() {
  const inCompleteList = document.getElementById(incompleteBook);
  const completeList = document.getElementById(completeBook);

  for(book of books){
    const bookNew = makeBook(
      book.Title,
      book.Author,
      book.Year,
      book.isCompleted
    );
    bookNew[bookItemId] = book.id;

    if (book.isCompleted == false) {
      inCompleteList.append(bookNew);
    } else {
      completeList.append(bookNew);
    }
  }
}

function searchBook() {
  const searchInput = document.getElementById("searchBookTitle").value;
  const moveBook = document.querySelectorAll(".move");

  for (move of moveBook) {
    if (searchInput !== move.innerText){
      console.log(move.innerText);
      move.parentElement.remove();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()){
    loadDataFromStorage();
  }
});

document.addEventListener("ondatabooksaved", () => {
  console.log("data dari buku berhasil di Simpan.");
});
document.addEventListener("ondatabookloaded", () => {
  refreshDatabook();
});
function checkButtonForm() {
  const cbox = document.getElementById("inputBookIsComplete");
  const submit = document.getElementById("textSubmit");
  if (cbox.checked == true){
    submit.innerText = "Sudah selesai dibaca";
  } else {
    submit.innerText = "Belum selesai dibaca";
  }
};

const STORAGE_KEY = "bookShelf-Apps";
let books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser Kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("ondatabooksaved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null)
  books = data;
  document.dispatchEvent(new Event("ondatabookloaded"));
}

function updateDataStorage() {
  if (isStorageExist()) 
  saveData();
}

function generateBookObject(Title, Author, Year, isCompleted) {
  return {
    id: +new Date(),
    Title,
    Author,
    Year,
    isCompleted
  };
}
function findbook(bookId) {
  for(book of books){
    if(book.id === bookId) 
    return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0
  for (book of books) {
    if (book.id === bookId) 
    return index;
    index++;
  }
  return -1;
}