import { endpointRegister } from "./url.js";

document
    .getElementById("registerBtn")
    .addEventListener("click", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const data = {
            name: name,
            username: username,
            email: email,
            password: password,
        };
        
        fetch(endpointRegister, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message === "User registered successfully") {
                Swal.fire({
                    icon: "success",
                    title: "Register Success",
                    text: "Please login to continue",
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "login.html";
                    }
                });
            } else {
                throw new Error(
                    data.message || "Register failed, please try again later"
                );
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Register Failed",
                text: error.message,
            });
        });
    });