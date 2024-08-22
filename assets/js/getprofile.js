import { endpointGetUser } from "./url.js";

function fetchDataFromEndPoint(){
    const url = endpointGetUser;
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
            updateUi(data.user);
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                icon: "warning",
                title: "Attention!",
                text: error.message,
            });
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Attention!",
            text: "You need to login first",
        }).then(() => {
            window.location.href = "login.html";
        });
    }
}

function updateUi(user) {
    const id_user = document.getElementById("id_user");
    const username = document.getElementById("username");

    if(id_user){
        id_user.textContent = `UID: ${user.id_user}` || "";
    }
    if(username){
        username.textContent = `${user.username}` || "";
    }
}

fetchDataFromEndPoint();