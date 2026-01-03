document.addEventListener("DOMContentLoaded", () => {
  const GET_PROFILE_URL = `${baseUrl}/auth/profile`;
  const UPDATE_PROFILE_URL = `${baseUrl}/profile`;
  const TOKEN = localStorage.getItem("token");

  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const email = document.getElementById("email1");
  const btnEdit = document.getElementById("btnEdit");
  const msgs = document.querySelectorAll(".mes");

  const showFname = document.getElementById("firstname");
  const showLname = document.getElementById("lastname");
  const showEmail = document.getElementById("email");

  const namePattern = /^[A-Za-z]/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // get profile
  fetch(GET_PROFILE_URL, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    },
  })
    .then(res => res.json())
    .then(res => {
      const user = res.data;
      fname.value = user.firstName;
      lname.value = user.lastName;
      email.value = user.email;
    });

  // clear messages on input
  const inputs = [fname, lname, email];
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      msgs[index].innerText = "";
    });
  });

  // edit profile
  btnEdit.addEventListener("click", () => {
    const firstName = fname.value.trim();
    const lastName = lname.value.trim();
    const emailVal = email.value.trim();
    let ok = true;

    if (!firstName) {
      msgs[0].innerText = "First name required";
      ok = false;
    } else if (!namePattern.test(firstName)) {
      msgs[0].innerText = "First name must start with a letter";
      ok = false;
    }

    if (!lastName) {
      msgs[1].innerText = "Last name required";
      ok = false;
    } else if (!namePattern.test(lastName)) {
      msgs[1].innerText = "Last name must start with a letter";
      ok = false;
    }

    if (!emailVal) {
      msgs[2].innerText = "Email required";
      ok = false;
    } else if (!emailPattern.test(emailVal)) {
      msgs[2].innerText = "Invalid email format";
      ok = false;
    }

    if (!ok) return;

    fetch(UPDATE_PROFILE_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email: emailVal,
      }),
    })
      .then(res => res.json())
      .then(() => {
        // update UI
        if (showFname) {
          showFname.value = firstName;
        };
        if (showLname){
          showLname.value = lastName;
        }
        if (showEmail) {
          showEmail.value = emailVal;
        }
        // close modal
        bootstrap.Modal.getInstance(document.getElementById("exampleModal4")).hide();
        showToast("Profile updated successfully");
      });
  });

  // Toast function
  function showToast(message) {
    const toast = document.getElementById("success");
    toast.innerHTML = `
      <i class="bi bi-check-circle-fill me-2 fs-5"></i> ${message}
    `;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
});
