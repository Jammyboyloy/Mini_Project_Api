// Log out
let btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", () => {
  fetch(baseUrl + "/auth/logout", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((item) => {
      if (item.result) {
        localStorage.removeItem("token");
        location.href = "../index.html";
      }
    });
});