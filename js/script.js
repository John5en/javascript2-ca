const logoutButton = document.getElementById("logoutButton");

// checks if token exists
const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  logoutButton.style.display = "inline-block";
}

// log out button event listener
logoutButton.addEventListener("click", function () {
  localStorage.removeItem("accessToken");

  window.location.href = "index.html";
});
