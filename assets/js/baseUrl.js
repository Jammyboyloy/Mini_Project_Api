// let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
let token = localStorage.getItem("token");

// Check if we are testing on our computer or live on Netlify
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// For the API data
const baseUrl = isLocal 
    ? "http://blogs.csm.linkpc.net/api/v1" 
    : "/api";

// For the Images
const baseImgUrl = isLocal 
    ? "http://blogs.csm.linkpc.net/" 
    : "/images/";