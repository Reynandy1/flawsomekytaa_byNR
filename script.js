/* ==========================================
   PRODUCT DATA
========================================== */

const products = [

    {
        id: 1,
        name: "Pashmina Latte",
        category: "Pashmina Collection",
        price: 59000,
        image: "images/hijab1.jpg"
    },

    {
        id: 2,
        name: "Pashmina Sand",
        category: "Pashmina Collection",
        price: 59000,
        image: "images/hijab2.jpg"
    },

    {
        id: 3,
        name: "Square Cream",
        category: "Square Collection",
        price: 55000,
        image: "images/hijab3.jpg"
    },

    {
        id: 4,
        name: "Square Mocha",
        category: "Square Collection",
        price: 55000,
        image: "images/hijab4.jpg"
    },

    {
        id: 5,
        name: "Silk Cocoa",
        category: "Premium Collection",
        price: 89000,
        image: "images/hijab5.jpg"
    },

    {
        id: 6,
        name: "Silk Rose",
        category: "Premium Collection",
        price: 89000,
        image: "images/hijab6.jpg"
    }

];


/* ==========================================
   CART
========================================== */

let cart = [];


/* ==========================================
   ELEMENTS
========================================== */

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const toast = document.getElementById("toast");


/* ==========================================
   FORMAT PRICE
========================================== */

function formatPrice(price) {

    return new Intl.NumberFormat("id-ID", {

        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0

    }).format(price);

}


/* ==========================================
   ADD TO CART
========================================== */

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;


    const existingProduct = cart.find(
        item => item.id === productId
    );


    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({

            ...product,
            quantity: 1

        });

    }


    updateCart();

    showToast();

    openCart();

}


/* ==========================================
   REMOVE ITEM
========================================== */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    updateCart();

}


/* ==========================================
   CHANGE QUANTITY
========================================== */

function changeQuantity(productId, change) {

    const product = cart.find(
        item => item.id === productId
    );

    if (!product) return;


    product.quantity += change;


    if (product.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    updateCart();

}


/* ==========================================
   UPDATE CART
========================================== */

function updateCart() {

    cartCount.textContent = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <p>
                    Your bag is empty.
                </p>

                <button
                    class="btn btn-primary"
                    onclick="closeCart()"
                >
                    Explore Collection
                </button>

            </div>

        `;

        cartTotal.textContent = "Rp0";

        return;

    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        total += item.price * item.quantity;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div>

                <h4>
                    ${item.name}
                </h4>

                <p class="cart-item-price">
                    ${formatPrice(item.price)}
                </p>


                <div class="quantity">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent = formatPrice(total);

}


/* ==========================================
   OPEN CART
========================================== */

function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


/* ==========================================
   CLOSE CART
========================================== */

function closeCart() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


openCartButton.addEventListener(
    "click",
    openCart
);


closeCartButton.addEventListener(
    "click",
    closeCart
);


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* ==========================================
   CHECKOUT WHATSAPP
========================================== */

document
    .getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            alert(
                "Keranjang masih kosong."
            );

            return;

        }


        /*
            GANTI NOMOR INI
            dengan nomor WhatsApp bisnis Anda.

            Format:
            628xxxxxxxxxx

            Jangan menggunakan:
            +62
            08
            tanda spasi
        */

        const phoneNumber =
            "62882002403676";


        let message =
            "Halo flawsomekytaa_byNR 👋%0A%0A";

        message +=
            "Saya ingin memesan:%0A%0A";


        cart.forEach(item => {

            message +=
                `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}%0A`;

        });


        const total = cart.reduce(

            (sum, item) =>
                sum + item.price * item.quantity,

            0

        );


        message +=
            `%0ATotal: ${formatPrice(total)}%0A%0A`;

        message +=
            "Mohon info ketersediaan dan proses pemesanannya. Terima kasih 🤍";


        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=${message}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    });


/* ==========================================
   TOAST
========================================== */

let toastTimeout;


function showToast() {

    toast.classList.add("active");


    clearTimeout(toastTimeout);


    toastTimeout = setTimeout(() => {

        toast.classList.remove("active");

    }, 2500);

}


/* ==========================================
   FILTER PRODUCT
========================================== */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");


            const category =
                button.dataset.category;


            productCards.forEach(card => {

                const cardCategory =
                    card.dataset.category;


                if (
                    category === "all" ||
                    cardCategory === category
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        }
    );

});


/* ==========================================
   SEARCH
========================================== */

const searchToggle =
    document.querySelector(".search-toggle");

const searchBox =
    document.getElementById("searchBox");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");


searchToggle.addEventListener(
    "click",
    () => {

        searchBox.classList.add("active");

        searchInput.focus();

    }
);


closeSearch.addEventListener(
    "click",
    () => {

        searchBox.classList.remove("active");

        searchInput.value = "";

        productCards.forEach(
            card => card.style.display = ""
        );

    }
);


searchInput.addEventListener(
    "input",
    () => {

        const searchValue =
            searchInput.value
                .toLowerCase()
                .trim();


        productCards.forEach(card => {

            const productName =
                card.dataset.name.toLowerCase();


            if (
                productName.includes(searchValue)
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    }
);


/* ==========================================
   MOBILE MENU
========================================== */

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");


mobileMenuBtn.addEventListener(
    "click",
    () => {

        mobileMenu.classList.toggle("active");

    }
);


mobileMenu
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "active"
                );

            }
        );

    });


/* ==========================================
   ESC KEY
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeCart();

            searchBox.classList.remove(
                "active"
            );

        }

    }
);


/* ==========================================
   INITIALIZE
========================================== */

updateCart();