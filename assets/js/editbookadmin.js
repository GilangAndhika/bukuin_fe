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
            const title = document.getElementById("title").value.trim();
            const author = document.getElementById("author").value.trim();
            const description = document.getElementById("description").value.trim();
            const launch_year = parseInt(document.getElementById("launch_year").value.trim(), 10);
            const isbn = document.getElementById("isbn").value.trim();
            const cover_image_url = document.getElementById("cover_image_url").value.trim();
            const id_book = localStorage.getItem("currentBookId");

            // Validate inputs
            if (!title || !author || !description || isNaN(launch_year) || !isbn || !cover_image_url) {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: "Please fill all fields with valid values.",
                });
                return;
            }

            // Validate launch_year
            if (launch_year < 1900 || launch_year > new Date().getFullYear()) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid launch year",
                    text: "The year must be between 1900 and the current year.",
                });
                return;
            }

            // Validate ISBN (simple validation)
            const isbnPattern = /^(97(8|9))?\d{9}(\d|X)$/;
            if (!isbnPattern.test(isbn)) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid ISBN",
                    text: "The ISBN must be 10 or 13 digits long, with optional prefix '978' or '979'.",
                });
                return;
            }

            // Validate cover_image_url (basic URL check)
            const urlPattern = /^(-|https?:\/\/[^\s/$.?#].[^\s]*)$/;
            if (!urlPattern.test(cover_image_url)) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid cover image URL",
                    text: "URL must start with http:// or https:// or just be a dash (-).",
                });
                return;
            }

            await postData(title, author, description, launch_year, isbn, cover_image_url, id_book);
        } catch (error) {
            console.error("Error editing book:", error);
            displayError("Failed to edit book", error.message);
        }
    });

async function postData(title, author, description, launch_year, isbn, cover_image_url, id_book) {
    const url = `http://127.0.0.1:3000/books/update?id_book=${id_book}`;
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
        cancelButtonText: "Stay on this page",
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
