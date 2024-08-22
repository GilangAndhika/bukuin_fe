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
            : 'https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png';

        const card = document.createElement('div');
        card.className = 'bg-white shadow-md rounded-lg overflow-hidden';
        card.innerHTML = `
            <div class="bg-cover bg-center" style="background-image: url('${coverImageUrl}');">
                <div class="bg-gradient-to-t from-transparent via-transparent to-black ">
                    <div class="bg-gradient-to-b from-transparent via-transparent to-black h-96">
                        <div class="p-4 grid grid-rows-3 grid-flow-row justify-between h-full">
                            <div class="row-span-1">
                                <h2 class="text-2xl font-semibold font-[('Montserrat')] text-blue-100">${book.title}</h2>
                                <p class="text-sm text-gray-400 italic">${book.author}</p>
                            </div>
                            
                            <div class="row-span-2 flex flex-col justify-end gap-2 text-sm text-gray-200">
                                <p class="text-blue-100">${book.description}</p>
                                <div class="flex gap-4 text-xs text-blue-200 font-thin">
                                    <p>Launch Year: ${book.launch_year}</p>
                                    <p>ISBN: ${book.isbn}</p>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

fetchDataFromEndPoint();
