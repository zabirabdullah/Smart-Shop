let productCount = new Array(16).fill(0);
let productTitles = ["empty"];
let productPrices = new Array(16).fill(0);

let category = 'all';

let totalPrice = 0;
let itemCount = 0;
let discount = 0;
let deliveryCharge = 100;
let grandTotal = 0;
let balance = 2000;


const productFetcher=()=>{
    fetch('https://fakestoreapi.com/products')
    .then(output => output.json())
    .then(data => productLoader(data))
};

const productLoader=(api)=>{
    document.getElementById("Products").innerHTML = "";
    let output = "";
    api.slice(0,16).forEach(element => {
        output += `
        <div id="${element.id}" class="max-w-xs bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between p-4 border border-gray-100 transition duration-300 hover:shadow-xl">
            <div class="h-48 flex items-center justify-center bg-gray-50 rounded-lg p-4 mb-4">
                <img src="${element.image}" alt="Product Image" class="max-h-full max-w-full object-contain">
            </div>

            <div class="flex flex-col flex-grow">
                <h1 class="text-gray-900 text-sm font-medium mb-2 leading-snug">
                    ${element.title.slice(0,30)}...
                </h1>

                <div class="flex items-center mb-2">
                    <div class="text-yellow-400 flex space-x-0.5">
                        <span>${starFunction(Math.floor(element.rating.rate))}</span>
                    </div>
                    <span class="text-xs text-gray-500 ml-2">(${element.rating.count})</span>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <h1 class="text-2xl font-bold text-blue-800">
                        $ ${element.price}
                    </h1>
                    <div class="flex items-center space-x-2">
                        <button class="bg-gray-200 px-2 py-1 rounded text-gray-700 font-bold" onclick="minusToCart(${element.id},${element.price})">−</button>
                        <span id="productCount-${element.id}" class="text-lg font-semibold">0</span>
                        <button class="bg-gray-200 px-2 py-1 rounded text-gray-700 font-bold" onclick="addToCart(${element.id},${element.price})">+</button>
                    </div>
                </div>

            </div>

                <button class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-150 ease-in-out hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none" onClick="addToCart(${element.id},${element.price})">
                Add to cart
                </button>
        </div>
        `
        productTitles.push(`${element.title}`);
        productPrices[element.id] = parseFloat(element.price);

    });
    document.getElementById("Products").innerHTML += output;
    renderAllProductCounts()
}

function starFunction(star){
    let stars ="";
    for(i=1; i<=star; i++){
    stars += `<i class="fa-solid fa-star" style="color: #FFD43B;"></i>`;
    }
    for(; i<=5; i++){
    stars += `<i class="fa-regular fa-star" style="color: #FFD43B;"></i>`;
    }
    return stars;
}


function cartDetails(){
    if(itemCount == 0){
        document.getElementById("cartContents").innerHTML = `
        <p>Cart is empty</p>
        `
    }
    else{
        balance = parseFloat(document.getElementById("balance").innerText);
        if(balance<grandTotal){
            document.getElementById("warning").innerHTML +=`
            <p class="text-orange-800">The total price exceeds your current balance</p>
            `
        }
        else{
            document.getElementById("warning").innerHTML = "";
        }
        let output = "";
        for(element=1; element<=16; element++){
            if(productCount[element]){
                output += `
                <div class="h-px my-2 bg-gray-400 "></div>
                <div class="flex justify-between px-2">
                <p>${productTitles[element]}</p>
                <p>${productCount[element]}</p>
            </div>

            <div class="flex justify-between px-2">
                <p>Price:</p>
                <p>$${(productCount[element] * productPrices[element]).toFixed(2)}</p>
            </div>
                
                `
            }
        }

        document.getElementById("cartContents").innerHTML = `
        
            <p>Item Count: <span id="itemCount">${itemCount}</span></p>
            <p>Price: <span id="price">${totalPrice.toFixed(2)}</span></p>
            <p>Discount: <span id="discount">${discount}</span></p>
            <p>Delivery Charge: <span id="deliveryCharge">${deliveryCharge}</span></p>
            <p class="font-bold text-sky-600">Grand Total: <span id="grandTotal">${grandTotal.toFixed(2)}</span></p>
        
        ${output}
        `
    }
    
    document.getElementById("cartSection").classList.remove("hidden");

}

function closeCart(){
    document.getElementById("cartSection").classList.add("hidden");
}

const addToCart=(id, price)=>{
    productCount[id]++;
    totalPrice += price;
    itemCount++;
    freeShipping();
    updateCart(id);
}

const minusToCart=(id, price)=>{
    if(productCount[id]>0){
        productCount[id]--;
        totalPrice -= price;
        itemCount--;
        if(totalPrice<0) {totalPrice = 0;}
        freeShipping();
        updateCart(id);
    }
}

function updateCart(id){
    grandTotal = totalPrice - (totalPrice * discount/100) + deliveryCharge;
    
    document.getElementById("cartContents").innerHTML = `
    <p>Item Count: <span id="itemCount">${itemCount}</span></p>
    <p>Price: <span id="price">${totalPrice.toFixed(2)}</span></p>
    <p>Discount: <span id="discount">${discount}</span></p>
    <p>Delivery Charge: <span id="deliveryCharge">${deliveryCharge}</span></p>
    <p class="font-bold text-sky-600">Grand Total: <span id="grandTotal">${grandTotal.toFixed(2)}</span></p>
    `

    document.getElementById("cartCount").innerHTML = `${itemCount}`

    productCountRender(id);
}

function productCountRender(id){
    document.getElementById(`productCount-${id}`).innerHTML = productCount[id];
}

function freeShipping(){
    if(totalPrice<1000 && itemCount>0){
    deliveryCharge = 100;
    }
    else if(totalPrice<2000){
    deliveryCharge = 50;
    }
    else{
    deliveryCharge = 0;
    }
}


const filterId = ['all', 'electronics', 'jewelery', `men's clothing`, `women's clothing`];

function filterFunction(filter){
    category = filter;
    filterDesigner(category);
    if(category=='all'){
        productFetcher();
    }
    else{
        fetch('https://fakestoreapi.com/products')
        .then(output => output.json())
        .then(data => productFilter(data))

        const productFilter=(api)=>{
            let output = "";
            api.slice(0,16).forEach(element => {
                if(category == element.category){
                    output += `
        <div id="${element.id}" class="max-w-xs bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between p-4 border border-gray-100 transition duration-300 hover:shadow-xl">
            <div class="h-48 flex items-center justify-center bg-gray-50 rounded-lg p-4 mb-4">
                <img src="${element.image}" alt="Product Image" class="max-h-full max-w-full object-contain">
            </div>

            <div class="flex flex-col flex-grow">
                <h1 class="text-gray-900 text-sm font-medium mb-2 leading-snug">
                    ${element.title.slice(0,30)}...
                </h1>

                <div class="flex items-center mb-2">
                    <div class="text-yellow-400 flex space-x-0.5">
                        <span>${starFunction(Math.floor(element.rating.rate))}</span>
                    </div>
                    <span class="text-xs text-gray-500 ml-2">(${element.rating.count})</span>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <h1 class="text-2xl font-bold text-blue-800">
                        $ ${element.price}
                    </h1>
                    <div class="flex items-center space-x-2">
                        <button class="bg-gray-200 px-2 py-1 rounded text-gray-700 font-bold" onclick="minusToCart(${element.id},${element.price})">−</button>
                        <span id="productCount-${element.id}" class="text-lg font-semibold">0</span>
                        <button class="bg-gray-200 px-2 py-1 rounded text-gray-700 font-bold" onclick="addToCart(${element.id},${element.price})">+</button>
                    </div>
                </div>

            </div>

                <button class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-150 ease-in-out hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none" onClick="addToCart(${element.id},${element.price})">
                Add to cart
                </button>
        </div>
        `
                }
            });
            
            document.getElementById("Products").innerHTML = "";
            document.getElementById("Products").innerHTML += output;
            renderAllProductCounts()
        }
    }
    
}

function filterDesigner(category){
    const clickedStyle = `px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition`
    const unClickedStyle = `px-5 py-2 bg-white text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition`

    for(let i=0; i<5; i++){
        const div = document.getElementById(`${filterId[i]}`);
        if(filterId[i] == category){
            div.className = clickedStyle;
        }
        else{
            div.className = unClickedStyle;
        }
    }
}

function sortProducts(type){
    filterFunction('all');
    filterDesigner('all')

    setTimeout(() => {temp()}, 400)

    function temp(){
        let products = [];
        for(let i=1; i<=16; i++){
            products.push(document.getElementById(i));
        }

        for(let i=0; i<15; i++){
            for(let j=i+1; j<16; j++){
                let swap = false;
                let priceI = productPrices[products[i].id];
                let priceJ = productPrices[products[j].id];
                let titleI = productTitles[products[i].id].toLowerCase();
                let titleJ = productTitles[products[j].id].toLowerCase();

                if (type === "high" && priceI < priceJ) swap = true;
                if (type === "low" && priceI > priceJ) swap = true;
                if (type === "a" && titleI > titleJ) swap = true;
                if (type === "z" && titleI < titleJ) swap = true;

                if (swap) {
                    let temp = products[i];
                    products[i] = products[j];
                    products[j] = temp;
                }
            }
        }
        document.getElementById("Products").innerHTML = "";
        for (let i = 0; i < 16; i++){
            document.getElementById("Products").appendChild(products[i]);
        } 
    
    }
    renderAllProductCounts()

}


function applyCoupon(){
    let couponcode = document.getElementById("coupon").value;
    const divp = document.createElement("p");
    divp.id = "couponMsg";
    let msg = document.getElementById("couponMsg");
    if(msg){
    msg.remove();
    }
    if(couponcode == "QUACK20"){
    discount = 20;
    divp.innerText = `Discount successfully added!`
    document.getElementById("couponSection").appendChild(divp);
    updateCart();
    }
    else{
    divp.innerText = `Fake Coupon!`
    document.getElementById("couponSection").appendChild(divp);
    }
}

const placeOrder=()=>{
    balance = parseFloat(document.getElementById("balance").innerText);
    if(itemCount==0){
        document.getElementById("orderMsg").innerHTML = `<p class="font-bold text-green-600 text-lg">Cart is empty</p>`
    }
    else if(balance>=grandTotal){
        balance -= grandTotal;
        reset();
        document.getElementById("balance").innerHTML = `${balance.toFixed(2)}`;
        document.getElementById("orderMsg").innerHTML = `<p class="font-bold text-green-600 text-lg">✅ Order Placed Successfully! <br> Thanks for Shopping!</p>`
    }
    else{
        document.getElementById("orderMsg").innerHTML = `<p class="font-bold text-orange-600 text-lg">Insufficient Credit!</p>`
    }
}

const reset=()=>{
    productCount = new Array(16).fill(0);
    totalPrice = 0;
    itemCount = 0;
    discount = 0;
    deliveryCharge = 100;
    grandTotal = 0;
    document.getElementById("cartCount").innerHTML = 0;
    document.getElementById("cartContents").innerHTML = "";
    renderAllProductCounts();
}

const balanceChecker=()=>{
    balance = parseFloat(document.getElementById("balance").innerText);
    let password = prompt("Enter password: ");
    if(password == "quack"){
        balance += 1000;
    }
    else{
        alert("Invalid Password!");
    }
    
    document.getElementById("balance").innerHTML = `${balance}`;
};

function renderAllProductCounts() {
    for (let i = 1; i <= 16; i++) {
        let countSpan = document.getElementById(`productCount-${i}`);
        if (countSpan) {
            countSpan.innerText = productCount[i];
        }
    }
}

productFetcher();