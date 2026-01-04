const profileID = document.querySelector("#profile-id");
const email = document.querySelector("#email");
const firstname = document.querySelector("#firstname");
const lastname = document.querySelector("#lastname");
const registerAt = document.querySelector("#registered-at");
const username = document.querySelector("#username");
const avatar = document.querySelector("#avatar");
const usernames = document.querySelector("#usernames");

// Get Profile
function getInfo(){
  fetch(baseUrl + "/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((item) => {
      profileID.value = item.data.id;
      email.value = item.data.email;
      firstname.value = item.data.firstName;
      lastname.value = item.data.lastName;
      registerAt.value = formatDate(item.data.registeredAt);
      username.value = "@" + item.data.firstName + " " + item.data.lastName;
      avatar.src = item.data.avatar;
      usernames.textContent = "@" + item.data.firstName + " " + item.data.lastName;
      fname.value = item.data.firstName;
      lname.value = item.data.lastName;
      emailEdit.value = item.data.email;
    });
}

getInfo();

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
