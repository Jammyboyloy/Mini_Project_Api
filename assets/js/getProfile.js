// Get Profile
fetch(baseUrl + "/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((item) => {
    document.querySelector(".user").innerHTML = `
          <h6 class="p-0 m-0 text-end text-main">${item.data.firstName} ${item.data.lastName}</h6>
          <small class="nav-text">${item.data.email}</small>`;

    document.querySelector(".userProfile").innerHTML = `
          <img src="${item.data.avatar}"alt="no" class="img-fluid rounded-circle object-fit-cover" style="width: 40px; height: 40px">`;
  });