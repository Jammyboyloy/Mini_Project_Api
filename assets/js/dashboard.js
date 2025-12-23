let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
let token = localStorage.getItem("token");

if (!token) location.href = "../index.html";

// Get Profile
fetch(baseUrl + "/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((item) => {
    document.querySelector(".user").innerHTML = `
          <h6 class="p-0 m-0 text-end">${item.data.firstName} ${item.data.lastName}</h6>
          <small>${item.data.email}</small>`;

    document.querySelector(".userProfile").innerHTML = `
          <img src="${item.data.avatar}"alt="no" class="img-fluid rounded-circle object-fit-cover" style="width: 40px;">`;
  });

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
