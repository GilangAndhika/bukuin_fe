document.addEventListener("DOMContentLoaded", async () => {
    loadBookData().catch((error) => {
        console.error("Error loading book data:", error);
        displayError("Failed to load book data", error.message);
    });
});

async function loadBookData() {
    const book = await getBookByID();
    if (book) {
        document.getElementById("title").value = book.title || "";
        document.getElementById("author").value = book.author || "";
        document.getElementById("description").value = book.description || "";
        document.getElementById("launch_year").value = book.launch_year || "";
        document.getElementById("isbn").value = book.isbn || "";
        document.getElementById("cover_image_url").value = book.cover_image_url || "";
    }
}

async function getBookByID() {
    const IdBook = localStorage.getItem("currentBookId");
    console.log("Current Book ID:", IdBook); 
    if (!IdBook) {
        throw new Error("Book ID not found");
    }

    const url = `http://127.0.0.1:3000/books/get?id_book=${IdBook}`;
    const token = localStorage.getItem("LOGIN");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            LOGIN: `${token}`,
            Accept: "application/json",
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to get book data");
    }
    return data.data;   
}

document
    .getElementById("editBookBtn")
    .addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            const title = document.getElementById("title").value;
            const author = document.getElementById("author").value;
            const description = document.getElementById("description").value;
            const launch_year = parseInt(document.getElementById("launch_year").value, 10);
            const isbn = document.getElementById("isbn").value;
            const cover_image_url = document.getElementById("cover_image_url").value;
            const id_book = localStorage.getItem("currentBookId");
            
            await postData(title, author, description, launch_year, isbn, cover_image_url, id_book);
        } catch (error) {
            console.error("Error to edit book:", error);
            displayError("Failed to edit book", error.message);
        }
    });

async function postData(title, author, description, launch_year, isbn, cover_image_url, id_book) {
    const IdBook = localStorage.getItem("currentBookId");
    const url = `http://127.0.0.1:3000/books/update?id_book=${IdBook}`;
    const token = localStorage.getItem("LOGIN");
    const newData = {
        title,
        author,
        description,
        launch_year,
        isbn,
        cover_image_url,
    };

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            LOGIN: `${token}`,
        },
        body: JSON.stringify(newData),
    });

    handleResponse(response);
}

async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to update book data");
    }
    if (data.success) {
        await displaySuccess("Book updated successfully");
    }
}

function displaySuccess(message) {
    Swal.fire({
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonText: "See dashboard",
        showCancelButton: true,
        cancelButtonText: "Stay in this page",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "dashboard-admin.html";
        }
    });
}

function displayError(title, message) {
    Swal.fire({
        icon: "error",
        title: title,
        text: message,
    });
}