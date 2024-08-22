import { endpointGetAllBooks } from "./url.js";

function fetchDataFromEndPoint() {
    const url = endpointGetAllBooks;
    const token = localStorage.getItem("LOGIN") || "";

    if (token) {
        fetch(url, {
            method: "GET",
            headers: {
                LOGIN: `${token}`,
                Accept: "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to get data");
            }
            return response.json();
        })
        .then((data) => {
            if (!data.data || data.data.length === 0) {
                updateCards([]);
            } else {
                updateCards(data.data);
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                icon: "warning",
                title: "Attention!",
                text: "You need to login first",
            }).then(() => {
                window.location.href = "login.html";
            });
        });
    }
}

function updateCards(books) {
    console.log(books);
    const container = document.getElementById('book-container'); // Use ID instead of class
    container.innerHTML = ''; // Clear previous content

    books.forEach((book) => {
        // Check if the cover image URL is valid
        const coverImageUrl = book.cover_image_url && book.cover_image_url.startsWith('https://')
            ? book.cover_image_url
            : 'https://i.pinimg.com/originals/6b/e3/88/6be3885c283e4ea74505fd3b9ffd8f78.jpg';

        const card = document.createElement('div');
        card.className = 'bg-white shadow-md rounded-lg overflow-hidden';
        card.innerHTML = `
            <div class="bg-cover bg-center h-48" style="background-image: url('${coverImageUrl}');"></div>
            <div class="p-4">
                <h2 class="text-lg font-semibold">${book.title}</h2>
                <p class="text-sm text-gray-600">${book.author}</p>
                <p class="text-sm text-gray-500 mt-2">${book.description}</p>
                <p class="text-sm text-gray-500 mt-2">Launch Year: ${book.launch_year}</p>
                <p class="text-sm text-gray-500 mt-2">ISBN: ${book.isbn}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

fetchDataFromEndPoint();
