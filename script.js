/* ==========================================
   PRODUCT DATA
========================================== */

const products = [
    {
        id: 1,
        name: "Pashmina Latte",
        category: "Pashmina Collection",
        price: 59000,
        image: "images/hijab1.jpeg"
    },

    {
        id: 2,
        name: "Pashmina Sand",
        category: "Pashmina Collection",
        price: 59000,
        image: "images/hijab2.jpeg"
    },

    {
        id: 3,
        name: "Square Cream",
        category: "Square Collection",
        price: 55000,
        image: "images/hijab3.jpeg"
    },

    {
        id: 4,
        name: "Square Mocha",
        category: "Square Collection",
        price: 55000,
        image: "images/hijab4.jpeg"
    },

    {
        id: 5,
        name: "Silk Cocoa",
        category: "Premium Collection",
        price: 89000,
        image: "images/hijab5.jpeg"
    },

    {
        id: 6,
        name: "Silk Rose",
        category: "Premium Collection",
        price: 89000,
        image: "images/hijab6.jpeg"
    }
];


/* ==========================================
   CART
========================================== */

let cart = JSON.parse(
    localStorage.getItem("flawsomekytaa_cart")
) || [];


/* ==========================================
   ELEMENTS
========================================== */

const cartSidebar =
    document.getElementById("cartSidebar");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const openCartButton =
    document.getElementById("openCart");

const closeCartButton =
    document.getElementById("closeCart");

const checkoutButton =
    document.getElementById("checkoutBtn");

const toast =
    document.getElementById("toast");


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
   SAVE CART
========================================== */

function saveCart() {

    localStorage.setItem(
        "flawsomekytaa_cart",
        JSON.stringify(cart)
    );

}


/* ==========================================
   ADD TO CART
========================================== */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }


    const existingProduct =
        cart.find(
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


    saveCart();

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

    saveCart();

    updateCart();

}


/* ==========================================
   CHANGE QUANTITY
========================================== */

function changeQuantity(
    productId,
    change
) {

    const product =
        cart.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }


    product.quantity += change;


    if (product.quantity <= 0) {

        removeFromCart(productId);

        return;

    }


    saveCart();

    updateCart();

}


/* ==========================================
   UPDATE CART
========================================== */

function updateCart() {

    saveCart();


    /* COUNT */

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent = totalItems;


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <p>
                    Your bag is empty.
                </p>

                <button
                    type="button"
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


    /* CART ITEMS */

    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
                loading="lazy"
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
                        type="button"
                        onclick="changeQuantity(${item.id}, -1)"
                        aria-label="Kurangi jumlah ${item.name}"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(${item.id}, 1)"
                        aria-label="Tambah jumlah ${item.name}"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                type="button"
                class="remove-item"
                onclick="removeFromCart(${item.id})"
                aria-label="Hapus ${item.name} dari bag"
            >
                Remove
            </button>
        `;


        cartItems.appendChild(cartItem);

    });


    cartTotal.textContent =
        formatPrice(total);

}


/* ==========================================
   OPEN CART
========================================== */

function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    cartSidebar.setAttribute(
        "aria-hidden",
        "false"
    );

    cartOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "cart-open"
    );

}


/* ==========================================
   CLOSE CART
========================================== */

function closeCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    cartSidebar.setAttribute(
        "aria-hidden",
        "true"
    );

    cartOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "cart-open"
    );

}


/* ==========================================
   CART EVENTS
========================================== */

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

checkoutButton.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            alert(
                "Keranjang masih kosong."
            );

            return;
        }


        /*
            Nomor WhatsApp bisnis.
            Format:
            628xxxxxxxxxx

            Jangan menggunakan:
            +62
            08
            spasi
            tanda -
        */

        const phoneNumber =
            "62882002403676";


        /*
            Membuat pesan pesanan
        */

        const messageLines = [

            "Halo flawsomekytaa_byNR 👋",
            "",
            "Saya ingin memesan:",
            ""

        ];


        cart.forEach(item => {

            messageLines.push(
                `• ${item.name} x${item.quantity} = ${formatPrice(
                    item.price * item.quantity
                )}`
            );

        });


        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price *
                    item.quantity,
                0
            );


        messageLines.push(
            "",
            `Total: ${formatPrice(total)}`,
            "",
            "Mohon info ketersediaan dan proses pemesanannya. Terima kasih 🤍"
        );


        /*
            encodeURIComponent digunakan
            agar spasi, emoji, simbol,
            dan karakter lainnya aman
            digunakan dalam URL WhatsApp.
        */

        const message =
            encodeURIComponent(
                messageLines.join("\n")
            );


        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=${message}`;


        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );

    }
);


/* ==========================================
   TOAST
========================================== */

let toastTimeout;


function showToast() {

    toast.classList.add("active");


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "active"
                );

            },
            2500
        );

}


/* ==========================================
   FILTER + SEARCH
========================================== */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

const productCards =
    document.querySelectorAll(
        ".product-card"
    );


const searchToggle =
    document.querySelector(
        ".search-toggle"
    );

const searchBox =
    document.getElementById(
        "searchBox"
    );

const closeSearch =
    document.getElementById(
        "closeSearch"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );


let activeCategory = "all";


/*
    Fungsi utama untuk menggabungkan
    filter kategori + search.
*/

function filterAndSearchProducts() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    productCards.forEach(card => {

        const cardCategory =
            card.dataset.category;


        const productName =
            card.dataset.name
                .toLowerCase();


        const matchCategory =
            activeCategory === "all" ||
            cardCategory === activeCategory;


        const matchSearch =
            productName.includes(
                searchValue
            );


        if (
            matchCategory &&
            matchSearch
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


/* ==========================================
   FILTER BUTTON
========================================== */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                activeCategory =
                    button.dataset.category;


                filterAndSearchProducts();

            }
        );

    }
);


/* ==========================================
   OPEN SEARCH
========================================== */

searchToggle.addEventListener(
    "click",
    () => {

        searchBox.classList.add(
            "active"
        );

        searchInput.focus();

    }
);


/* ==========================================
   CLOSE SEARCH
========================================== */

closeSearch.addEventListener(
    "click",
    () => {

        searchBox.classList.remove(
            "active"
        );

        searchInput.value = "";


        /*
            Setelah search ditutup,
            filter kategori tetap dipertahankan.
        */

        filterAndSearchProducts();

    }
);


/* ==========================================
   SEARCH INPUT
========================================== */

searchInput.addEventListener(
    "input",
    filterAndSearchProducts
);


/* ==========================================
   MOBILE MENU
========================================== */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const mobileMenu =
    document.getElementById(
        "mobileMenu"
    );


mobileMenuBtn.addEventListener(
    "click",
    () => {

        const isActive =
            mobileMenu.classList.toggle(
                "active"
            );


        mobileMenuBtn.setAttribute(
            "aria-expanded",
            String(isActive)
        );


        mobileMenuBtn.setAttribute(
            "aria-label",
            isActive
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    }
);


/* ==========================================
   CLOSE MOBILE MENU AFTER CLICK
========================================== */

mobileMenu
    .querySelectorAll("a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                mobileMenu.classList.remove(
                    "active"
                );


                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );


                mobileMenuBtn.setAttribute(
                    "aria-label",
                    "Open navigation menu"
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

            mobileMenu.classList.remove(
                "active"
            );

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    }
);


/* ==========================================
   INITIALIZE
========================================== */

updateCart();