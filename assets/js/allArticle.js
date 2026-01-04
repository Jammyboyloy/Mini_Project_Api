
const baseUrl = "http://blogs.csm.linkpc.net/api/v1";
const token = localStorage.getItem("token");

//----------------------------
//              Get Profile
// --------------------------

const getprofile = () =>{
    fetch(baseUrl + "/auth/profile", {
    headers: {
        Authorization: `Bearer ${token}`,
    },
    })
    .then((res) => res.json())
    .then((item) => {
        document.querySelector(".user").innerHTML = `
            <h6 class="p-0 m-0 text-end text-main">${item.data.firstName} ${item.data.lastName}</h6>
            <small class="nav-text">${item.data.email}</small>`;

        document.querySelector(".userProfile").innerHTML = `
            <img src="${item.data.avatar}"alt="no" class="img-fluid rounded-circle object-fit-cover" style="width: 40px; height: 40px">`;
    });
}
// ---call getprofile
getprofile();

//----------------------------
//  Get Own AllArticles
// --------------------------
let showitems = 0;
let showing = 1;
let intries = document.querySelectorAll('.entries');
let number = document.querySelector("#number");

const allArticles = () => {
    let tbodys = document.querySelector('#tbody');
    let ifnotdata = document.querySelector('#undata');
    
    fetch(baseUrl + `/articles/own?search=&_page=1&_per_page=100&sortBy=createdAt&sortDir=asc`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(res => {

        let row = '';
        let number = 1;
        let showing = 0;
        if (res.result == true) {
            let reversedData = res.data.items.reverse();

            // if data == emty
            if (reversedData.length === 0) {
                ifnotdata.classList.remove('d-none');
                document.querySelector('#number').innerHTML = Number(number)-1;
                document.querySelector('.entries').innerHTML = showing ;
            } else {
                ifnotdata.classList.add('d-none');
                document.querySelector('#number').innerHTML = Number(number);
                
                showing = null;
                for (let el of reversedData) {
                    showing++;
                    const isoDateString = el.createdAt;
                    const date = new Date(isoDateString);
                    const options = { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit', hour12: true 
                    };
                    const khmerTime = date.toLocaleString('km-KH', options);

                    row += `
                        <tr>
                            <td><img style="width: 80px; height: 80px;" class="rounded-3" src="${el.thumbnail}" alt="No image"></td>
                            <td class="text-main h-100 my-auto">${el.title}</td>
                            <td class="text-main "><small class="fs-6 bg-primary w-fit h-fit rounded-4 px-3 text-primary ms-auto" style="padding: 2px;">
                            ${el.category?.name ?? "null"
              }</small></td>
                            <td class="text-main">${khmerTime}</td>
                            <td class="p-0">               
                                <button class="btn btn-sm nav-text p-0 ms-3 me-4 border-0" data-bs-toggle="modal" data-bs-target="#articleEdit" onclick="editeArticle(${el.id})">
                                    <i class="bi bi-pencil-square fs-5"></i>
                                </button>
                                <button class="btn btn-sm nav-text p-0 border-0" data-bs-toggle="modal" data-bs-target="#deleteArticle" onclick="showModledelete(${el.id})">
                                    <i class="bi bi-trash3 fs-5 p-0"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }
                document.querySelector('.entries').innerHTML = showing
            }
        }
        
        tbodys.innerHTML = row;

    })
    .catch(error => {
        console.error(error);
        showError("Fetch Article false");
    });
}
// ----call all Articles
allArticles();

//----------------------------
//      Delete Own Article
// --------------------------

let getIdtodelete = null
function showModledelete(id){
    getIdtodelete = id;
}
document.querySelector('#confirmDelete').addEventListener('click',function(){

    if(!getIdtodelete){
        showError("Delete Id false"); 
        return;
    }
        fetch(baseUrl+`/articles/${getIdtodelete}`,{
            method:'DELETE',
            headers:{Authorization:`Bearer ${token}`}
        })
        .then(res => res.json())
        .then(res =>{
            console.log(res);
            bootstrap.Modal.getInstance(document.getElementById("deleteArticle")).hide();
            showSuccess("Article Delete successfully!");
            getIdtodelete = null;
            allArticles();
        })
})    

//----------------------------
//      Loop all category for update data
// --------------------------

let selectElement = document.querySelector('#select-id');
const allCategory = ()=> {
    fetch(baseUrl + '/categories?_page=1&_per_page=100&sortBy=name&sortDir=ASC&search=')
    .then(cat => cat.json())
    .then(data => {
        let allValue = '';
        const uniqueNames = new Set();
        for (let el of data.data.items) {
            // -----add el to uniqueNames
            uniqueNames.add(el);
        }
        uniqueNames.forEach(opt => {
            allValue += `<option value="${opt.id}">${opt.name}</option>`;
        });
        selectElement.innerHTML = allValue;
    });
}
// --cate allcategory
allCategory();

//-----------------------------------------------
//                      Update Own Articles
// -----------------------------------------------

let upTitle = document.querySelector('#up-title');
let upImg = document.querySelector('#up-image');

// --about form select
let select_id = document.querySelector('#select-id');
let content = document.querySelector('#content');
let oldimage = document.querySelector('#old-image');



// ------get data to modale

let errorThumbnail = document.querySelector('#errorThumbnail')
const editeArticle = (id) => {

    resetRq();
    localStorage.setItem('updateId', id);
    fetch(baseUrl + `/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => res.json())
    .then(updat => {

        //-----get content by quil
        let rawContent = updat.data.content; 
        let cleanText = "";
        try{
            let delta = JSON.parse(rawContent);
            if (delta && delta.ops) {
                cleanText = delta.ops.map(op => op.insert).join("");
            } else {
                cleanText = rawContent; // if no data vea tok ddel
            }
        }catch(e){
            cleanText = rawContent.replace(/<\/?[^>]+(>|$)/g, "");
        }
        
        content.value = cleanText;

        let categoryid = updat.data.category?.id || "";
        upTitle.value = updat.data.title;
        select_id.value = categoryid; 
        oldimage.value = updat.data.thumbnail.split('/').pop();
        Array.from(select_id.options).forEach(option => {
            option.selected = (option.value == categoryid);
        });
    });
}

// --------------validateThumbnail = "";
function validateThumbnail(file) {
    let allowed = ["image/jpeg", "image/png"];
    let maxSize = 1024 * 1024; // 1MB

    if (!allowed.includes(file.type)) {
        errorThumbnail.textContent = "Only JPG or PNG images allowed";
        return false;
    }

    if (file.size > maxSize) {
        errorThumbnail.textContent = "Image must be under 1MB";
        upImg.classList.add("rq")
        return false;
    }

    errorThumbnail.textContent = "";
    upImg.classList.remove("rq")
    return true;
}

// ----------------key click
upImg.addEventListener("change", (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (!validateThumbnail(file)) {
        upImg.value = "";
    }
});

//-------------------------------------
//                       update articles 
// -----------------------------------


let formElement = document.querySelector("#form-data");

formElement.onsubmit = async (e) => {
    e.preventDefault();

    //  Validate normal fields
    if (!check_validation()) {
        console.log("Validation failed");
        return;
    }

    // Validate thumbnail if user selected one
    if (upImg.files.length > 0) {
        if (!validateThumbnail(upImg.files[0])) {
            return;
        }
    }

    let updatId = localStorage.getItem('updateId');

    try {
        //  Update article text
        const articleRes = await fetch(baseUrl + `/articles/${updatId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: upTitle.value,
                content: content.value,
                categoryId: Number(select_id.value)
            })
        });

        const articleData = await articleRes.json();

        if (articleData.result) {

            // Upload thumbnail only if valid & selected
            if (upImg.files.length > 0) {
                let imgFormData = new FormData();
                imgFormData.append("thumbnail", upImg.files[0]);

                const imgRes = await fetch(baseUrl + `/articles/${updatId}/thumbnail`, {
                    method: 'POST',
                    headers: { "Authorization": `Bearer ${token}` },
                    body: imgFormData
                });

                const imgData = await imgRes.json();
                console.log("Thumbnail updated:", imgData);
            }

            bootstrap.Modal.getInstance(document.getElementById("articleEdit")).hide();
            showSuccess("Article edit successfully!");
            allArticles();
        }

    } catch (error) {
        console.error("Error during update:", error);
        showError("Edit error");
    }
};

//================================checked validation

let check_validation = () => {
    let isvalid = true;
    let upTitle = document.querySelector('#up-title');
    let content = document.querySelector('#content');

    if (!upTitle.value.trim()) {
        document.querySelector('#title-emty').innerHTML = "Title is required";
        isvalid = false;
        upTitle.classList.add("rq");
    } else {
        document.querySelector('#title-emty').innerHTML = "";
    }

    if (!content.value.trim() || content.value.trim().length < 10) {
        // console.log(content.value.trim().length);
        // console.log(document.querySelector('#content-emty'));
        
        document.querySelector('#content-emty').innerHTML = "Title is required, must be at least 10 characters long."; 
        isvalid = false;
        content.classList.add("rq");
    } else {
        document.querySelector('#content-emty').innerHTML = "";
    }

    return isvalid;
}


// Remove error messages when user types or changes value

upTitle.addEventListener("keyup", () => {
  if (upTitle.value.trim() !== "") {
    upTitle.classList.remove("rq");
    document.querySelector('#title-emty').innerHTML = "";
  }
});

content.addEventListener("keyup", () => {
  if (content.value.trim() !== "" ) {
    content.classList.remove("rq");
    document.querySelector('#content-emty').innerHTML = ""; 
  }
});


/* ================= INPUT FOCUS EFFECT all ================= */

upTitle.addEventListener("blur", function () {
  if(upTitle.value.trim() === ""){
    document.querySelector('#title-emty').innerHTML = "Title is required";
    upTitle.classList.remove("rq");
    upTitle.classList.remove("focused");
    upTitle.classList.add('rq')
  }else{
    upTitle.classList.add('focused');
    document.querySelector('#title-emty').innerHTML = "";
  }
});

content.addEventListener("blur", function () {
  if(content.value.trim() === ""){
    document.querySelector('#content-emty').innerHTML = "Title is required, must be at least 10 characters long.";
    content.classList.remove("rq");
    content.classList.remove("focused");
    content.classList.add('rq')
  }else{
    content.classList.add('focused');
    document.querySelector('#content-emty').innerHTML = "";
  }
});

select_id.addEventListener("blur", function () {
  if(select_id.option === ""){
    select_id.classList.remove("focused");
  }else{
    select_id.classList.add('focused');
  }
});

upImg.addEventListener("blur", function () {
  if(upImg.value === ""){
    upImg.classList.remove("focused");
  }else{
    upImg.classList.add('focused');
  }
});


// --------------reset focused all
function resetRq(){
    errorThumbnail.textContent = "";
    upImg.classList.remove("rq");
    upTitle.classList.remove("rq");
    document.querySelector('#title-emty').innerHTML = "";
    document.querySelector('#content-emty').innerHTML = "";
    content.classList.remove('rq');
    upImg.classList.remove("focused");
    select_id.classList.remove("focused");
    content.classList.remove("focused");
    upTitle.classList.remove("focused");
}

// ===================show toast

function showError(msg) {
  const toastError = document.querySelector(".my-toast-error");
  toastError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2 fs-5"></i> ${msg}`;
  toastError.classList.add("show");

  setTimeout(() => toastError.classList.remove("show"), 3000);
}

function showSuccess(msg) {
  const toastSuccess = document.querySelector(".my-toast-success");
  toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
  toastSuccess.classList.add("show");

  setTimeout(() => toastSuccess.classList.remove("show"), 3000);
}

function showToastSuccess(msg) {

  const toastSuccess = document.querySelector("#createSuccess");
  let isCreated = sessionStorage.getItem("isCreated");
  if (isCreated) {
    toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
    setTimeout(() => toastSuccess.classList.add("show"), 800);
    sessionStorage.removeItem("isCreated");
  }

  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isCreated")) {
    showToastSuccess("Article created successfully"); 
  }
});