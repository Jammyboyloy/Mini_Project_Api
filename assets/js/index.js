const toggleButton = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");
const currentTheme = localStorage.getItem("theme") || "light";
if (currentTheme === "dark") {
  document.body.classList.add("dark-mode");
  moonIcon.style.display = "inline"; 
  sunIcon.style.display = "none"; 
}

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    moonIcon.style.display = "inline"; 
    sunIcon.style.display = "none"; 
  } else {
    localStorage.setItem("theme", "light");
    moonIcon.style.display = "none"; 
    sunIcon.style.display = "inline"; 
  }
});