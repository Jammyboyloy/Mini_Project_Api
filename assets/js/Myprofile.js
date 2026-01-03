document.addEventListener("DOMContentLoaded", () => {
  const baseurl =`${baseUrl}/auth/profile`;
  const token = localStorage.getItem("token");
  fetch(baseurl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then(res => res.json())
    .then((res) => {
      const user = res.data;
      const avatar = document.getElementById("avatar");
      if (avatar) {
        avatar.src = user.avatar ?? "default.png";
      }
      document.getElementById("profile-id").value = user.id;
      document.getElementById("firstname").value = user.firstName;
      document.getElementById("lastname").value = user.lastName;
      document.getElementById("email").value = user.email;
      document.getElementById("registered-at").value = formatDate(user.registeredAt);
      document.getElementById("username").value = user.firstName + " " + user.lastName;
      document.getElementById("usernames").innerHTML = user.firstName + " " + user.lastName;
    })
});

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
