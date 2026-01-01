// Log out
let btnLogout = document.querySelector("#btnLogout");
let btnLogout2 = document.querySelector("#btnLogout2");
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
btnLogout2.addEventListener("click", () => {
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