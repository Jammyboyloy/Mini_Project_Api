document.addEventListener("DOMContentLoaded", function () {
  const avatarImg = document.getElementById("avatar");
  const uploadInput = document.getElementById("uploadImage");
  const removeBtn = document.getElementById("removeProfile");

  const BASE_URL = `${baseUrl}`;
  const AVATAR_URL = BASE_URL + "/profile/avatar";
  const PROFILE_URL = BASE_URL + "/auth/profile";

  const DEFAULT_AVATAR = "../assets/images/default-avatar.png";
  const TOKEN = localStorage.getItem("token");

  function loadProfile() {
    fetch(PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((item) => {
        const user = item.data;
        if (avatarImg) {
          avatarImg.src = user.avatar ?? DEFAULT_AVATAR;
        }
        document.querySelector(".user").innerHTML = `
          <h6 class="p-0 m-0 text-end text-main">
            ${user.firstName} ${user.lastName}
          </h6>
          <small class="nav-text">${user.email}</small>
        `;

        document.querySelector(".userProfile").innerHTML = `
          <img src="${user.avatar ?? DEFAULT_AVATAR}"
            class="img-fluid rounded-circle object-fit-cover"
            style="width:40px;height:40px">
        `;
      })
      .catch((err) => console.error("Load profile error:", err));
  }
  loadProfile();
  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => (avatarImg.src = e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);

    fetch(AVATAR_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData,
    })
      .then((res) => res.json()) 
      .then(() => {
        loadProfile();
      })
  });
  removeBtn.addEventListener("click", function () {
    fetch(AVATAR_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        avatarImg.src = DEFAULT_AVATAR;
        loadProfile();
        const modalEl = document.getElementById("exampleModal3");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      })
  });
  function showToast(msg) {
  const toastError = document.querySelector("#error");
  toastError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
  toastError.classList.add("show");

  setTimeout(() => toastError.classList.remove("show"), 3000);
}

});