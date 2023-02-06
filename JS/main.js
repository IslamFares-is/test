const form = document.querySelector("#form");
const delete_all = document.querySelector(".delete_all button");
const search_field = document.querySelector("#search");
const delete_apporval = document.querySelector(".approve_delete");
const approve_password = document.querySelector(".approve_delete input");
const approve_check = document.querySelector(".check");
const approve =document.querySelector(".approve");
const cancel =document.querySelector(".cancel");
const title = document.querySelector("#title");
const category = document.querySelector("select");
const buying_price = document.querySelector("#buying_price");
const selling_price = document.querySelector("#selling_price");
const amount = document.querySelector("#amount");
const add_btn = document.querySelector("#add");
const phones_tbody = document.querySelector(".phones_table tbody");
const others_tbody = document.querySelector(".others_table tbody")
const myPassword = '55555';
const password_section = document.querySelector(".password_section");
const wrong_password = document.querySelector(".password_section p");
const password = document.querySelector("#password");
const enter = document.querySelector(".password_section button");


let mood = 'create';
let index;
/*
    add password to enter the website
*/
enter.addEventListener("click",()=>{
    if(password.value === myPassword) {
        password_section.style.cssText = "opacity:0; z-index:-1";
    } else {
        wrong_password.style.cssText = "color:red";
        password.value = '';
    }
})

let products_array = [];
let products_array_backup = [];

if(localStorage.stored_products != null) {
    products_array = JSON.parse(localStorage.stored_products);
} 

getStorage();
form.addEventListener("submit",(e)=>{
    e.preventDefault();

    if(mood==='create') {
        if(title.value !== "" & category.value !== '' & buying_price.value !== '' & selling_price.value !== '' & amount.value !== ''){
            productObject(); // add task object to products_array
            title.value = "";
            buying_price.value = '';
            selling_price.value = '';
            amount.value = '';
        }
    } else {
        let product = {
            id: new Date(),
            title: title.value,
            cat: category.value,
            buyingPrice:buying_price.value,
            sellingPirce: selling_price.value,
            amount:amount.value,
            completed: false,
            date: getDate()
        }

        products_array[index] = product;
        productRow(products_array)
        setStorage();
        title.value = "";
        buying_price.value = '';
        selling_price.value = '';
        amount.value = '';
        add_btn.textContent = 'اضافة';
        mood = 'create';
    }
    
    
    
})





// create task objects
function productObject(){
    let product = {
        id: new Date(),
        title: title.value,
        cat: category.value,
        buyingPrice:buying_price.value,
        sellingPirce: selling_price.value,
        amount:amount.value,
        completed: false,
        date: getDate()
    }
    products_array.push(product)
    products_array_backup.push(product)
    productRow(products_array)
    setStorage();
}

// date 

function getDate(){
    let today = new Date();
    let month = today.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let days = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    today = today.getFullYear() + "-" + month + "-" + days;
    return today;
}

//create product row 
function productRow(product){
    // create the row that contains the product
    phones_tbody.innerHTML = '';
    others_tbody.innerHTML = '';

    product.forEach((product, index)=>{
        let tr = document.createElement('tr');
        tr.classList.add("task");
        tr.setAttribute("data-id", product.id);
        tr.setAttribute("completed", product.completed)
        tr.innerHTML = `
            <td class="delete">حذف</td>
            <td onclick="updateData(${index})" class="update">تعديل</td>
            <td>${product.amount}</td>
            <td>${product.sellingPirce}</td>
            <td>${product.buyingPrice}</td>
            <td>${product.title}</td>
            <td>${product.date}</td>
        
        `
        if(product.cat === 'phone') {
            phones_tbody.append(tr)
        } else {
            others_tbody.append(tr)
        }
    })
}

    
//set local storage
function setStorage(){
    window.localStorage.setItem("stored_products", JSON.stringify(products_array));
    window.localStorage.setItem('backup_data', JSON.stringify(products_array_backup));
}

// get from local storage 
function getStorage(){
    if(localStorage.stored_products){
        let stored_data = JSON.parse(localStorage.stored_products);
        productRow(stored_data)
    }

}



// delete one product
phones_tbody.addEventListener("click",(e)=>{
    if(e.target.classList.contains("delete")){
        e.target.parentElement.remove();
        // function to remove from local storage
        remove_from_storage(e.target.parentElement.getAttribute("data-id"))
    }
})


others_tbody.addEventListener("click",(e)=>{
    if(e.target.classList.contains("delete")){
        e.target.parentElement.remove();
        // function to remove from local storage
        remove_from_storage(e.target.parentElement.getAttribute("data-id"))
    }
})


// delete all products
delete_all.addEventListener("click",()=>{
    delete_apporval.style.cssText = "opacity:1; z-index:10;";
    approve.addEventListener("click",()=>{
        if(approve_password.value === myPassword) {
            delete_apporval.style.cssText = "opacity:0, z-index:-2";
            deleteAll();
            approve_password.value = "";
            approve_check.style.cssText = 'opacity:0;'
        } else {
            approve_check.style.cssText = 'opacity:1;'
        }
    })
    
    cancel.addEventListener("click",()=>{
        delete_apporval.style.cssText = "opacity:0, z-index:-2";
        approve_check.style.cssText = 'opacity:0;'
    })
})

function remove_from_storage(element){
    products_array = products_array.filter((task)=> task.id != element);
    setStorage();
}


function deleteAll() {
    products_array = [];
    phones_tbody.innerHTML = '';
    others_tbody.innerHTML = '';
    setStorage();
}



// a function to update data
function updateData(i){
    title.value = products_array[i].title;
    category.value = products_array[i].cat;
    buying_price.value = products_array[i].buyingPrice;
    selling_price.value = products_array[i].sellingPirce;
    amount.value = products_array[i].amount;
    add_btn.textContent = 'تعديل';
    mood = 'update';
    index = i;
}


// Search function

search_field.addEventListener("keyup",()=>{
    
    search(search_field.value);

})

function search(value){
    
    let tr = document.createElement('tr');
    phones_tbody.innerHTML = '';
    others_tbody.innerHTML = '';
    for(let i = 0; i < products_array.length; i++) {
        if(products_array[i].title.toLowerCase().includes(value.toLowerCase())) {
            
            tr.classList.add("task");
            tr.setAttribute("data-id", products_array[i].id);
            tr.setAttribute("completed", products_array[i].completed)
            tr.innerHTML = `
                <td class="delete">حذف</td>
                <td onclick="updateData(${index})" class="update">تعديل</td>
                <td>${products_array[i].amount}</td>
                <td>${products_array[i].sellingPirce}</td>
                <td>${products_array[i].buyingPrice}</td>
                <td>${products_array[i].title}</td>
                <td>${products_array[i].date}</td>
            
            `
            if(products_array[i].cat === 'phone') {
                phones_tbody.append(tr)
            } else {
                others_tbody.append(tr)
            }

        }
    }
    if(value == '') {
        productRow(products_array)
    }
}