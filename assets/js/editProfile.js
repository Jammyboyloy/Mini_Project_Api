document.addEventListener("DOMContentLoaded", function () {
  const GET_PROFILE_URL = "http://blogs.csm.linkpc.net/api/v1/auth/profile";
  const UPDATE_PROFILE_URL = "http://blogs.csm.linkpc.net/api/v1/profile";
  const TOKEN = localStorage.getItem("token");
  fetch(GET_PROFILE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      const user = res.data;
      document.getElementById("firstname").value = user.firstName || "";
      document.getElementById("lastname").value = user.lastName || "";
      document.getElementById("email").value = user.email || "";

      document.getElementById("fname").value = user.firstName || "";
      document.getElementById("lname").value = user.lastName || "";
      document.getElementById("email1").value = user.email || "";
    })
  document.getElementById("btnEdit").addEventListener("click", function () {
    const firstName = document.getElementById("fname").value.trim();
    const lastName = document.getElementById("lname").value.trim();
    const email = document.getElementById("email1").value.trim();
    if (!firstName || !lastName || !email) {
      alert("Please fill all fields");
      return;
    }
    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    fetch(UPDATE_PROFILE_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        document.getElementById("firstname").value = firstName;
        document.getElementById("lastname").value = lastName;
        document.getElementById("email").value = email;

        const modalEl = document.getElementById("exampleModal4");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      })
  });
});



