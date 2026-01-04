const uploadImage = document.querySelector("#uploadImage");
const removeProfile = document.querySelector("#removeProfile");

uploadImage.addEventListener("change", () => {
  if (!uploadImage.files.length) return;
  editAvatar();
});

removeProfile.addEventListener("click", () => {
  removeAvatar();
});

function editAvatar() {
  const file = uploadImage.files[0];
  const formData = new FormData();
  formData.append("avatar", file);

  fetch(baseUrl + "/profile/avatar", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((item) => {
      if (item.result === true) {
        avatar.src = URL.createObjectURL(file);
        const userProfileImg = document.querySelector(".userProfile img");
        if (userProfileImg) userProfileImg.src = URL.createObjectURL(file);
        showToastSuccess("Update avatar successfully.");
      } else {
        showToastError("Avatar must not exceed 1MB.");
      }
    });
}

const defaultAvatar = "http://blogs.csm.linkpc.net/api/v1/uploads/avatars/default-avatar.png";

function removeAvatar() {

  if (avatar.src === defaultAvatar) {
    showToastError("Default avatar cannot delete.");
    return;
  }

  fetch(baseUrl + "/profile/avatar", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((item) => {
      if (item.result === true) {
        const avatarUrl = item.data.avatar;
        avatar.src = avatarUrl;
        const userProfileImg = document.querySelector(".userProfile img");
        if (userProfileImg) userProfileImg.src = avatarUrl;

        showToastSuccess("Remove avatar successfully.");
      }
    })
}

function showToastSuccess(message) {
  const toast = document.getElementById("updateProfileSuccess");
  toast.innerHTML = `
      <i class="bi bi-check-circle-fill me-2 fs-5"></i> ${message}
    `;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function showToastError(message) {
  const toast = document.getElementById("errorTypeFile");
  toast.innerHTML = `
      <i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${message}
    `;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
