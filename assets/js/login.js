import { endpointLogin } from "../js/url.js";

document
    .getElementById("loginBtn")
    .addEventListener("click", function (event) {
        event.preventDefault();

        const emailOrUsername = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const data = {
            username: emailOrUsername,
            password: password,
        };

        fetch(endpointLogin, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
           if (!response.ok) {
               if (response.status === 401) {
                    throw new Error("Wrong username or password");
               } else {
                    throw new Error("Server error, please try again later");
               };
           }
        return response.json();
        })
        .then((data) => {
            if (data.token) {
                localStorage.setItem("LOGIN", data.token);
                document.cookie = `LOGIN=${data.token};path=/;max-age=3600`;
                return getUserDetails(data.token);
            } else {
                throw new Error("Token not found");
            }
        })
        .then((user) => {
            if (user.id_role === 1) {
                window.location.href = "/dashboard-admin.html";
            } else if (user.id_role === 2) {
                window.location.href = "/catalog.html";
            }
        })
        .catch((error) => {
            console.error("Error(:", error);
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: error.message,
            });
        });
    });

function getUserDetails(token) {
    return fetch("http://127.0.0.1:3000/auth", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            LOGIN: ` ${token}`,
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to get user details");
        }
        return response.json();
    })
    .then((data) => data.user)
    .catch((error) => {
        console.error("Error fetching user data:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to get user details",
            text: error.message,
        });
        throw error;
    });
}