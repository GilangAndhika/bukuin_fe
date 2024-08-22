import { endpointRegister, endpointCheckUsername } from "./url.js";

// Function to check if username exists
async function checkUsernameAvailability(username) {
    const response = await fetch(`${endpointCheckUsername}?username=${username}`);
    const data = await response.json();
    return data.exists;
}

document
    .getElementById("registerBtn")
    .addEventListener("click", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Client-side validation
        if (!name || !username || !email || !password) {
            Swal.fire({
                icon: "error",
                title: "Failed to Register",
                text: "All fields are required. Please fill out all fields.",
            });
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Please enter a valid email address.",
            });
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Validation Error",
                text: "Password must be at least 6 characters long.",
            });
            return;
        }

        // Check if the username is taken
        const usernameTaken = await checkUsernameAvailability(username);
        if (usernameTaken) {
            Swal.fire({
                icon: "error",
                title: "Username Taken",
                text: "The username is already taken. Please choose a different username.",
            });
            return;
        }

        // Prepare data for submission
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
