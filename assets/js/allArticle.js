
let baseUrl = "http://blogs.csm.linkpc.net/api/v1";
let token = localStorage.getItem("token");

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

// --link to page detailArticle
function detail(id) {
  sessionStorage.setItem("idArticle",id);
  location.href = "detailArticle.html";
}

//----------------------------
//           Darkmode
// --------------------------
if(localStorage.getItem('theme') == 'dark'){
    document.querySelector('.text-muted').classList.add('text-main');
}
if(localStorage.getItem('theme') == "light"){
    document.querySelector("#table-darkmode").classList.remove('table-dark');
}

document.querySelector('#theme-toggle').addEventListener('click',function(){
    let theme = localStorage.getItem('theme');
    let tableDark = document.querySelector("#table-darkmode");
    if(theme == "dark"){
        tableDark.classList.add('table-dark');
    }else{
        tableDark.classList.remove('table-dark');
    }
    
})

//----------------------------
//  Get Own AllArticles
// --------------------------
let showitems = 0;
let showing = 1;
let intries = document.querySelectorAll('.entries');
let number = document.querySelector("#number");

const allArticles = () =>{
    let tbodys = document.querySelector('#tbody');
    let ifnotdata = document.querySelector('#undata');
    fetch(baseUrl+`/articles/own?search=&_page=1&_per_page=100&sortBy=createdAt&sortDir=asc`,{
        method:"GET",
        headers: {Authorization :`Bearer ${token}`}
    })
    .then(res => res.json())
    .then(res =>{
        if(res.result !=""){
            let row = '';
            for(let el of res.data.items){
                showitems++;
                const isoDateString = el.createdAt;
                const date = new Date(isoDateString);
                const options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: true 
                };
                const khmerTime = date.toLocaleString('km-KH', options);
                row +=`
                    <tr>
                        <td><img style="width: 80px; height: 80px;" class="rounded-3" src="${el.thumbnail}" alt="No image"></td>
                        <td class="text-main h-100 my-auto">${el.title}</td>
                        <td class="text-main ">${el.category?.name||"null"}</td>
                        <td class="text-main">
                            ${khmerTime}
                        </td>
                        <td class="">
                            <button class="btn btn-sm nav-text" data-bs-toggle="modal" data-bs-target="#deleteArticle">
                                <i class="bi bi-trash3"></i>
                            </button>

                                     <!-- modol Delete Article -->
                                    <div class="modal fade" id="deleteArticle" tabindex="-1" aria-labelledby="exampleModalLabel3" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content rounded-3 bg-main">
                                                    <div class="modal-body text-center">
                                                        <h5 class="text-danger fw-medium mb-3">Delete Article</h5>
                                                        <p class="text-secondary">Are you sure you want to delete Article?</p>
                                                        <button type="button" class="btn btn-outline-secondary px-5 py-2" data-bs-dismiss="modal">Cancel</button>
                                                        <button class="btn btn-danger ms-2 px-5 py-2" id="deleteCategory" onclick="delArticle(${el.id})">Delete</button>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>

                            <button class="btn btn-sm nav-text me-1" data-bs-toggle="modal"  data-bs-target="#articleEdit" onclick="editeArticle(${el.id})">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbodys.innerHTML = row;
                ifnotdata.classList.add('d-none');
            }  
            // ----checked showing items
            for(let el of intries){
                el.innerHTML = showitems;
            
            }
            if(showitems == 0){
                showing -= 1;
                number.innerHTML = showing;
                
            }else{
                number.innerHTML = showing;
            }
        }
    })
}

// ----call all Articles
allArticles();

//----------------------------
//      Delete Own Article
// --------------------------
const delArticle = function(id){
    event.preventDefault();
    console.log(id);
    fetch(baseUrl+`/articles/${id}`,{
        method:'DELETE',
        headers:{Authorization:`Bearer ${token}`}
    })
    .then(res => res.json())
    .then(res =>{
        if(res.result){
            console.log(res);
            bootstrap.Modal.getInstance(document.getElementById("deleteArticle")).hide();
            showSuccess("Article Delete successfully!");
            allArticles();
        }
    })
    .catch(error => {
        console.error("Error during delete:", error);
    });
    
}

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

//-----------------------------
//       Update Own Articles
// ---------------------------

let upTitle = document.querySelector('#up-title');
let upImg = document.querySelector('#up-image');

// --about form select
let select_id = document.querySelector('#select-id');
let content = document.querySelector('#content');
let oldimage = document.querySelector('#old-image');

//----------------
//       get data to modale
// ---------------

const editeArticle = (id) => {
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
                cleanText = rawContent; // បើមិនមែន Delta ទេ ទុកវាដដែល
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

//----------------
//       update articles 
// ---------------

let formElement = document.querySelector("#form-data");

formElement.onsubmit = async (e) => {
    e.preventDefault();

    // checked Validation
    if (!check_validation()) {
        console.log("Validation failed");
        return;
    }

    let updatId = localStorage.getItem('updateId');
    
    try {
        //Update---------(Title, Category, Content)
        const articleRes = await fetch(baseUrl+`/articles/${updatId}`, {
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
            console.log("Article text updated successfully");

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
}

// -------------checked validation
let check_validation = () => {
    let isvalid = true;
    let upTitle = document.querySelector('#up-title');
    let content = document.querySelector('#content');

    if (!upTitle.value.trim()) {
        document.querySelector('#title-emty').innerHTML = "Title cannot be empty.";
        isvalid = false;
    } else {
        document.querySelector('#title-emty').innerHTML = "";
    }

    if (!content.value.trim() || content.value.trim().length < 10) {
        console.log(content.value.trim().length);
        console.log(document.querySelector('#content-emty'));
        
        document.querySelector('#content-emty').innerHTML = "Content cannot be empty, must be at least 10 characters long."; 
        isvalid = false;
    } else {
        document.querySelector('#content-emty').innerHTML = "";
    }

    return isvalid;
}

// show toast
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

