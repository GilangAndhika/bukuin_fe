document.getElementById("logoutBtn").addEventListener("click", function () {
    Swal.fire({
      title: "You Want To Logout?",
      text: "You will be logged out of the system",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  });
  
  function logout() {
    localStorage.removeItem("LOGIN");
    document.cookie = "LOGIN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "index.html";
  }