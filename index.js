const allCards = document.querySelector('.cards');
const cards = document.getElementsByClassName('card');
const cartBtn = document.getElementsByClassName('cart');
const incrementBtn = document.getElementsByClassName('increment');
const decrementBtn = document.getElementsByClassName('decrement');
const quantityElement = document.getElementsByClassName('add-quantity');
const dessertImage = document.getElementsByClassName('dessert-img');
const addToCart = document.getElementsByClassName('add-to-cart');
const confirm = document.getElementById('confirm');
const overlay = document.querySelector('.overlay');
const emptyCart = document.querySelector('.empty-cart');
const itemCart = document.querySelector('.items-cart');
const totalQuantity = document.querySelector('.total-quantity');
const cartTotal = document.querySelector('.cart-total');
const confirmTotal = document.querySelector('.confirm-total');
const removeButtons = document.getElementsByClassName('remove');
const orderItems = document.querySelector('.order-items');
const orderTotal = document.querySelector('.order-total');
const confirmContainer = document.querySelector('.confirm-order');

async function getData() {
    try {
        let response = await fetch('./data.json');
        let data = await response.json();
        renderData(data);
    } catch (errro) {
        console.log('An error occurred ', error)
    }
}

getData();

//display items from data given
function renderData(data) {
    allCards.innerHTML = '';

    data.forEach((card, index) => {
        allCards.innerHTML += `
        <div class="card" id=${index}>
            <div class="image">
                <img class='dessert-img' src=${card.image.desktop} alt="">
                <button class="cart">
                <img src="assets/images/icon-add-to-cart.svg" alt="icon-add-to-cart">Add to cart</button>
                <button class="add-to-cart">
                    <svg  xmlns="http://www.w3.org/2000/svg" class="decrement" width="25" height="25" fill="hsl(13, 31%, 94%)" viewBox="0 0 10 2"><path fill="hsl(13, 31%, 94%)" d="M0 .375h10v1.25H0V.375Z"/></svg>
                    <p class="add-quantity">0</p>
                    <svg class="increment"  xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="hsl(13, 31%, 94%)" viewBox="0 0 10 10"><path fill="hsl(13, 31%, 94%)" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                </button>
            </div>
            <div class="data">
                <p class="category">${card.category}</p>
                <p class="name">${card.name}</p>
                <p class="price">$ ${card.price.toFixed(2)}</p>
            </div>
        </div> `;
    });
    showCartBtn();
    addQuantity();
    removeQuantity();
}

//display cart button to add item to cart
function showCartBtn(params) {
    Array.from(cartBtn).forEach((cart, index) => {
        cart.addEventListener('click', () => {
            cart.style.display = 'none';
            addToCart[index].style.display = 'flex';
        })
    });
}

//add items to the cart
function addQuantity(params) {
    Array.from(incrementBtn).forEach((plus, index) => {
        plus.addEventListener('click', () => {
            let quantity = parseInt(quantityElement[index].textContent);
            quantity++;
            quantityElement[index].textContent = quantity;
            dessertImage[index].style.border = '4px solid hsl(14, 86%, 42%)';
            updateTotalQuantity();
            addItemsinCart();
        })
    })
}

//remove items from the cart
function removeQuantity(params) {
    Array.from(decrementBtn).forEach((minus, index) => {
        minus.addEventListener('click', () => {
            let quantity = parseInt(quantityElement[index].textContent);
            if (quantity > 0) {
                quantity--;
                quantityElement[index].textContent = quantity;
            }
            if (quantity === 0) {
                dessertImage[index].style.border = 'none';
            }
            updateTotalQuantity();
            addItemsinCart();
        })
    })
}

//Update total quantity in cart
function updateTotalQuantity() {
    let cartQuantity = 0;
    Array.from(cards).forEach(card => {
        const quantity = parseInt(card.querySelector('.add-quantity').textContent);
        cartQuantity += quantity;
    });
    totalQuantity.textContent = `(${cartQuantity})`;
}

//add items in the cart
function addItemsinCart() {
    emptyCart.style.display = 'none';
    itemCart.style.display = 'grid';
    confirmTotal.style.display = 'grid';

    let orderPrice = 0;
    itemCart.innerHTML = '';

    Array.from(cards).forEach((card, index) => {
        const quantity = parseInt(card.querySelector('.add-quantity').textContent);
        if (quantity > 0) {
            const name = card.querySelector('.name').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.substring(1)).toFixed(2);
            let totalprice = (quantity * parseFloat(price)).toFixed(2);
            orderPrice += parseFloat(totalprice);
            const cartData = document.createElement('div');
            cartData.className = 'cart-data';
            cartData.innerHTML = `
            <div class="cart-details">
                <div class="info">
                    <h4 class="item-name">${name}</h4>
                    <div class="all">
                        <p class="show-quantity">${quantity}x</p>
                        <div class="display-price">
                            <p>@</p>
                            <p class="per-price">$ ${price}</p>
                            <p class="total-price">$ ${totalprice}</p>
                        </div>
                    </div>
                </div>
                <svg class="remove" id=${index} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="hsl(7, 20%, 60%)" viewBox="0 0 10 10"><path fill="hsl(7, 20%, 60%)" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
            </div>
            <hr>   `;
            itemCart.appendChild(cartData);
        }
        cartTotal.textContent = `$${(orderPrice).toFixed(2)}`;
        removeItem();
    })
}

//remove items from the cart
function removeItem(params) {
    Array.from(removeButtons).forEach(remove => {
        remove.addEventListener('click', () => {
            const productId = remove.getAttribute('id');
            const product = document.querySelector(`.card[id="${productId}"]`);
            product.querySelector('.add-quantity').textContent = '0';
            product.querySelector('.dessert-img').style.border = 'none';
            addItemsinCart();
            updateTotalQuantity();
        })
    })
}

//event listener on confirm order button
confirm.addEventListener('click', () => {
    overlay.style.display = 'flex';
    confirmOrder();
    confirmContainer.style.display = 'grid';
})

//function to display item in the order 
function confirmOrder() {
    let orderPriceTotal = 0;
    orderItems.innerHTML = '';

    Array.from(cards).forEach(card => {
        const quantity = parseInt(card.querySelector('.add-quantity').textContent);
        if (quantity > 0) {
            const image = card.querySelector('.dessert-img').src;
            const productName = card.querySelector('.name').textContent;
            const productPrice = parseFloat(card.querySelector('.price').textContent.slice(1));
            let productTotalPrice = (quantity * productPrice).toFixed(2);
            orderPriceTotal += parseFloat(productTotalPrice);
            const orderData = document.createElement('div');
            orderData.className = 'order-data';
            orderData.innerHTML = `
            <div class="order-details">
                <div class="show-data">
                    <img src=${image} class='item-img'>
                    <div class="item-info">
                        <h4 class="item-name">${productName}</h4>
                        <div class = 'show-details'>
                            <p class="show-quantity">${quantity}x</p>
                            <div class="item-price">
                                <p>@</p>
                                <p class="per-price">$ ${productPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="total-price">$ ${productTotalPrice}</p>
            </div>
            <hr>   `;
            orderItems.appendChild(orderData);
        }
        orderTotal.textContent = `$${(orderPriceTotal).toFixed(2)}`;
    })
}

document.getElementById('start').addEventListener('click', () => {
    window.location.reload();
})