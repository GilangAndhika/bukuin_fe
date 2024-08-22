import { endpointGetAllBooks } from "./url.js";

function fetchDataFromEndPoint(){
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
                updateTable([]);
            } else {
                updateTable(data.data);
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
        })
    }
}


function updateTable(book) {
    console.log(book);
    const tableBody = document.getElementById("tbody");
    let rows = ""; // Accumulate all rows in a string

    book.forEach((books) => {
        rows += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${books.title}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${books.author}</td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-900">${books.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${books.launch_year}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${books.isbn}</td>
                <td class="px-6 py-4 whitespace-normal text-sm text-blue-500 hover:underline">${books.cover_image_url}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="javascript:(0);" onclick="editBook('${books.id_book}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</a>
                    <a href="javascript:(0);" onclick="deleteBook('${books.id_book}')" class="text-red-600 hover:text-red-900">Delete</a>
                </td>
            </tr>
        `;
    tableBody.innerHTML = rows; // Update the table body with all rows at once
    });
    
    
    window.deleteBook = function (IdBook) {
        const url = `${endpointGetAllBooks}/delete?id_book=${IdBook}`; 
        const token = localStorage.getItem("LOGIN");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        LOGIN: `${token}`,
                    },
                    body: JSON.stringify({ id_book: IdBook }),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to delete data");
                    }
                    return response.json();
                })
                .then(() => {
                    Swal.fire("Deleted!", "Your file has been deleted.", "success");
                    window.location.reload(true);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Delete Failed",
                        text: error.message,
                    });
                });
            }
        });
    };

}
window.editBook = function (IdBook) {
    localStorage.setItem("currentBookId", IdBook);
    window.location.href = "editbook.html";
};

fetchDataFromEndPoint();