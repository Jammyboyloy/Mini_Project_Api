let btnLogout2 = document.querySelector("#btnLogout2");
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

const fname = document.querySelector("#fname");
const lname = document.querySelector("#lname");
const emailEdit = document.querySelector("#emailEdit");
const btnEdit = document.querySelector("#btnEdit");
const getInfoBack = document.querySelector(".getInfoBack");
const check = [fname, lname];
const inputs = [fname, lname, emailEdit];
const mes = document.querySelectorAll(".mes");
const messages = [
  "First name is required",
  "Last name is required",
  "Email is required",
];

getInfoBack.addEventListener("click", () => {
  getInfo();
  inputs.forEach((input, index) => {
    mes[index].innerHTML = "";
    input.classList.remove("rq");
    input.classList.remove("focused");
  });
});

inputs.forEach((input, index) => {
  input.addEventListener("blur", () => {
    if (input.value === "") {
      mes[index].innerHTML = messages[index];
      input.classList.add("rq");
    } else if (/^\d/.test(input.value)) {
      mes[index].innerHTML = "Cannot start with a number";
      input.classList.add("rq");
    }
  });

  input.addEventListener("input", () => {
    if (input.value === "") {
      mes[index].innerHTML = "";
      input.classList.remove("rq");
    }
  });

  input.addEventListener("focus", () => {
    input.classList.add("focused");
    input.select();
  });
});

emailEdit.addEventListener("input", () => {
  if (emailEdit.value.includes("@gmail.com") || emailEdit.value === "") {
    mes[2].innerHTML = "";
    emailEdit.classList.remove("rq");
  }
});

emailEdit.addEventListener("blur", () => {
  if (emailEdit.value === "") {
    mes[2].innerHTML = "Email is required";
    emailEdit.classList.add("rq");
  } else if (/^\d/.test(emailEdit.value)) {
    mes[2].innerHTML = "Cannot start with a number";
    emailEdit.classList.add("rq");
  } else if (!emailEdit.value.includes("@gmail.com")) {
    mes[2].innerHTML = "Please enter a valid email address";
    emailEdit.classList.add("rq");
  }
});

btnEdit.addEventListener("click", () => {
  let isValid = true;
  inputs.forEach((input, index) => {
    if (/^\d/.test(input.value)) {
      mes[index].innerHTML = "Cannot start with a number";
      input.classList.add("rq");
      isValid = false;
    }

    if (input.value === "") {
      mes[index].innerHTML = messages[index];
      input.classList.add("rq");
      isValid = false;
    }
  });

  if (!emailEdit.value.includes("@gmail.com")) {
    mes[2].innerHTML = "Please enter a valid email address";
    emailEdit.classList.add("rq");
    isValid = false;
  }

  if (isValid) {
    updateInfo();
    btnEdit.setAttribute("data-bs-dismiss", "modal");
    btnEdit.click();
  }
});

function updateInfo() {
  const data = {
    firstName: fname.value,
    lastName: lname.value,
    email: emailEdit.value,
  };

  fetch(baseUrl + "/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((item) => {
      if (item.result === true) {
        showToastSuccess("Info updated successfully");
        getProfile();
        getInfo();
      }
    });
}

// Toast function
function showToastSuccess(message) {
  const toast = document.getElementById("editSuccess");
  toast.innerHTML = `
      <i class="bi bi-check-circle-fill me-2 fs-5"></i> ${message}
    `;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
