// let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
let token = localStorage.getItem("token");

// Check if the website is running on Netlify or locally
let baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://blogs.csm.linkpc.net/api/v1" // Use direct link for local testing
    : "/api";                              // Use proxy for Netlify hosting