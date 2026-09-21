/* =========================================================
   FLAWSOME KYTAA BY.NR
   JAVASCRIPT
========================================================= */


/* =========================================================
   PRODUCT DATA
========================================================= */

const products = [
    {
        id: 1,
        name: "Pashmina Beige / Nude Cream",
        price: 55000,
        image: "images/hijab1.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Pashmina Hitam / Black",
        price: 55000,
        image: "images/hijab2.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "New"
    },
    {
        id: 3,
        name: "Pashmina Abu-Abu Muda / Light Grey",
        price: 55000,
        image: "images/hijab3.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: ""
    },
    {
        id: 4,
        name: "Pashmina Broken White",
        price: 55000,
        image: "images/hijab4.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: ""
    },
    {
        id: 5,
        name: "Pashmina Muted Brown",
        price: 55000,
        image: "images/hijab5.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "Premium"
    },
    {
        id: 6,
        name: "Pashmina Coklat Muda / Taupe",
        price: 55000,
        image: "images/hijab6.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "New"
    },
    {
        id: 7,
        name: "Pashmina Lilac muda / Soft Purple",
        price: 55000,
        image: "images/hijab7.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: ""
    },
    {
        id: 8,
        name: "Pashmina Khaki / Cream Muda",
        price: 55000,
        image: "images/hijab8.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: ""
    },
    {
        id: 9,
        name: "Pashmina Cokelat Tua / Dark Brown",
        price: 55000,
        image: "images/hijab9.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "Premium"
    }
];


/* =========================================================
   CONSTANTS
========================================================= */

const WHATSAPP_NUMBER = "62882002403676";
const CART_STORAGE_KEY = "flawsomekytaa_cart";

let cart = [];
let toastTimeout = null;

let currentFilter = "all";
let currentSearch = "";

let selectedProductId = null;
let selectedProductColor = "";
let selectedProductQuantity = 1;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const navbar = document.getElementById("navbar");

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const noResults = document.getElementById("noResults");

const cartToggle = document.getElementById("cartToggle");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");
const cartClose = document.getElementById("cartClose");

const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const continueShopping =
    document.getElementById("continueShopping");

const checkoutBtn =
    document.getElementById("checkoutBtn");


const productModalOverlay =
    document.getElementById("productModalOverlay");

const modalClose =
    document.getElementById("modalClose");

const modalProductImage =
    document.getElementById("modalProductImage");

const modalProductCategory =
    document.getElementById("modalProductCategory");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const modalProductDescription =
    document.getElementById("modalProductDescription");

const colorOptions =
    document.getElementById("colorOptions");

const selectedColorName =
    document.getElementById("selectedColorName");

const modalQuantityElement =
    document.getElementById("modalQuantity");

const modalQuantityMinus =
    document.getElementById("modalQuantityMinus");

const modalQuantityPlus =
    document.getElementById("modalQuantityPlus");

const modalAddToBag =
    document.getElementById("modalAddToBag");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

function formatPrice(price) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(price);
}


function getProduct(productId) {
    return products.find(
        (product) => product.id === Number(productId)
    );
}


function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadCart() {
    try {
        const savedCart =
            localStorage.getItem(CART_STORAGE_KEY);

        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);

            if (Array.isArray(parsedCart)) {
                cart = parsedCart;
            }
        }
    } catch (error) {
        console.error(
            "Gagal memuat shopping bag:",
            error
        );

        cart = [];
    }
}


function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error(
            "Gagal menyimpan shopping bag:",
            error
        );
    }
}


/* =========================================================
   CART
========================================================= */

function addToCart(productId, color = "", quantity = 1) {
    const product = getProduct(productId);

    if (!product) {
        return;
    }

    const existingItem = cart.find(
        (item) =>
            Number(item.productId) === Number(productId) &&
            item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            color: color || product.color || "Belum dipilih",
            quantity: quantity
        });
    }

    saveCart();
    renderCart();

    showToast(
        `${product.name} ditambahkan ke shopping bag.`
    );
}


function changeCartQuantity(index, amount) {
    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
}


function removeFromCart(index) {
    if (!cart[index]) {
        return;
    }

    const product = getProduct(
        cart[index].productId
    );

    cart.splice(index, 1);

    saveCart();
    renderCart();

    if (product) {
        showToast(
            `${product.name} dihapus dari shopping bag.`
        );
    }
}


function getCartCount() {
    return cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );
}


function getCartTotal() {
    return cart.reduce((total, item) => {

        const product =
            getProduct(item.productId);

        if (!product) {
            return total;
        }

        return total +
            product.price *
            Number(item.quantity || 0);

    }, 0);
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItems) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartEmpty.classList.add("show");

        cartTotal.textContent = "Rp0";
        cartCount.textContent = "0";

        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = "0.5";
        checkoutBtn.style.pointerEvents = "none";

        return;
    }


    cartEmpty.classList.remove("show");

    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.pointerEvents = "auto";


    cart.forEach((item, index) => {

        const product =
            getProduct(item.productId);

        if (!product) {
            return;
        }


        const itemTotal =
            product.price *
            Number(item.quantity || 0);


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                >
            </div>

            <div class="cart-item-info">

                <p class="cart-item-category">
                    ${escapeHTML(product.categoryName)}
                </p>

                <h3 class="cart-item-name">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="cart-item-color">
                    Color: ${escapeHTML(item.color || "Belum dipilih")}
                </p>

                <div class="cart-item-bottom">

                    <strong class="cart-item-price">
                        ${formatPrice(itemTotal)}
                    </strong>

                    <div class="cart-quantity">

                        <button
                            type="button"
                            data-action="decrease"
                            data-index="${index}"
                            aria-label="Kurangi jumlah"
                        >
                            −
                        </button>

                        <span>
                            ${Number(item.quantity || 0)}
                        </span>

                        <button
                            type="button"
                            data-action="increase"
                            data-index="${index}"
                            aria-label="Tambah jumlah"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="cart-remove"
                        data-action="remove"
                        data-index="${index}"
                        aria-label="Hapus produk"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>
        `;


        cartItems.appendChild(cartItem);
    });


    cartTotal.textContent =
        formatPrice(getCartTotal());

    cartCount.textContent =
        getCartCount();
}


/* =========================================================
   CART EVENTS
========================================================= */

if (cartItems) {

    cartItems.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest("button");

            if (!button) {
                return;
            }

            const action =
                button.dataset.action;

            const index =
                Number(button.dataset.index);


            if (action === "increase") {
                changeCartQuantity(index, 1);
            }


            if (action === "decrease") {
                changeCartQuantity(index, -1);
            }


            if (action === "remove") {
                removeFromCart(index);
            }

        }
    );

}


/* =========================================================
   OPEN / CLOSE CART
========================================================= */

function openCart() {

    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");

    document.body.classList.add("no-scroll");
}


function closeCart() {

    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");

    document.body.classList.remove("no-scroll");
}


if (cartToggle) {
    cartToggle.addEventListener(
        "click",
        openCart
    );
}


if (cartClose) {
    cartClose.addEventListener(
        "click",
        closeCart
    );
}


if (cartOverlay) {
    cartOverlay.addEventListener(
        "click",
        closeCart
    );
}


if (continueShopping) {

    continueShopping.addEventListener(
        "click",
        closeCart
    );

}


/* =========================================================
   QUICK ADD
========================================================= */

document.querySelectorAll(".quick-add").forEach(
    (button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                const productId =
                    Number(
                        button.dataset.productId
                    );

                addToCart(
                    productId,
                    "",
                    1
                );

                openCart();
            }
        );

    }
);


/* =========================================================
   FILTER
========================================================= */

function applyFilters() {

    let visibleCount = 0;


    productCards.forEach(
        (card) => {

            const category =
                card.dataset.category || "";

            const name =
                card.dataset.name || "";


            const matchesFilter =
                currentFilter === "all" ||
                category === currentFilter;


            const matchesSearch =
                name
                    .toLowerCase()
                    .includes(
                        currentSearch.toLowerCase()
                    );


            const shouldShow =
                matchesFilter &&
                matchesSearch;


            card.style.display =
                shouldShow ? "" : "none";


            if (shouldShow) {
                visibleCount++;
            }

        }
    );


    if (noResults) {

        noResults.classList.toggle(
            "show",
            visibleCount === 0
        );

    }

}


/* FILTER BUTTON */
filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(
                    (btn) =>
                        btn.classList.remove("active")
                );


                button.classList.add("active");


                currentFilter =
                    button.dataset.filter || "all";


                applyFilters();

            }
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

function openSearch() {

    searchPanel.classList.add("open");

    setTimeout(
        () => {

            if (searchInput) {
                searchInput.focus();
            }

        },
        150
    );
}


function closeSearch() {

    searchPanel.classList.remove("open");
}


if (searchToggle) {

    searchToggle.addEventListener(
        "click",
        () => {

            if (
                searchPanel.classList.contains("open")
            ) {
                closeSearch();
            } else {
                openSearch();
            }

        }
    );

}


if (searchClose) {

    searchClose.addEventListener(
        "click",
        closeSearch
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        (event) => {

            currentSearch =
                event.target.value.trim();

            applyFilters();

        }
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

function closeMobileMenu() {
    mobileNav.classList.remove("open");
}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            mobileNav.classList.toggle("open");

        }
    );

}


if (mobileNav) {

    mobileNav
        .querySelectorAll("a")
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            }
        );

}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function openProductModal(productId) {

    const product =
        getProduct(productId);

    if (!product) {
        return;
    }


    selectedProductId =
        product.id;

    selectedProductColor = "";
    selectedProductQuantity = 1;


    modalProductImage.src =
        product.image;

    modalProductImage.alt =
        product.name;


    modalProductCategory.textContent =
        product.categoryName;


    modalProductName.textContent =
        product.name;


    modalProductPrice.textContent =
        formatPrice(product.price);


    modalProductDescription.textContent =
        product.description;


    modalQuantityElement.textContent =
        "1";


    selectedColorName.textContent =
        "Belum dipilih";


    colorOptions
        .querySelectorAll(".color-swatch")
        .forEach(
            (swatch) => {

                swatch.classList.remove("active");

            }
        );


    productModalOverlay.classList.add("open");

    document.body.classList.add("no-scroll");
}


function closeProductModal() {

    productModalOverlay.classList.remove("open");

    document.body.classList.remove("no-scroll");

}


productCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                const productId =
                    Number(card.dataset.id);

                openProductModal(productId);

            }
        );

    }
);


/* MODAL CLOSE */
if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeProductModal
    );

}


if (productModalOverlay) {

    productModalOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                productModalOverlay
            ) {
                closeProductModal();
            }

        }
    );

}


/* =========================================================
   COLOR SELECTION
========================================================= */

if (colorOptions) {

    colorOptions
        .querySelectorAll(".color-swatch")
        .forEach(
            (swatch) => {

                swatch.addEventListener(
                    "click",
                    () => {

                        colorOptions
                            .querySelectorAll(
                                ".color-swatch"
                            )
                            .forEach(
                                (item) =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        swatch.classList.add("active");


                        selectedProductColor =
                            swatch.dataset.color || "";


                        selectedColorName.textContent =
                            selectedProductColor;

                    }
                );

            }
        );

}


/* =========================================================
   MODAL QUANTITY
========================================================= */

function updateModalQuantity() {

    modalQuantityElement.textContent =
        selectedProductQuantity;
}


if (modalQuantityMinus) {

    modalQuantityMinus.addEventListener(
        "click",
        () => {

            if (
                selectedProductQuantity > 1
            ) {

                selectedProductQuantity--;

                updateModalQuantity();

            }

        }
    );

}


if (modalQuantityPlus) {

    modalQuantityPlus.addEventListener(
        "click",
        () => {

            if (
                selectedProductQuantity < 99
            ) {

                selectedProductQuantity++;

                updateModalQuantity();

            }

        }
    );

}


/* =========================================================
   MODAL ADD TO BAG
========================================================= */

if (modalAddToBag) {

    modalAddToBag.addEventListener(
        "click",
        () => {

            if (!selectedProductId) {
                return;
            }


            if (!selectedProductColor) {

                showToast(
                    "Silakan pilih warna terlebih dahulu."
                );

                return;
            }


            addToCart(
                selectedProductId,
                selectedProductColor,
                selectedProductQuantity
            );


            closeProductModal();

            openCart();

        }
    );

}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

function checkoutViaWhatsApp() {

    if (cart.length === 0) {

        showToast(
            "Shopping bag masih kosong."
        );

        return;
    }


    let message =
        "Halo Flawsome Kyta by.NR,%0A%0A";

    message +=
        "Saya ingin melakukan pemesanan:%0A%0A";


    cart.forEach(
        (item, index) => {

            const product =
                getProduct(item.productId);

            if (!product) {
                return;
            }


            const subtotal =
                product.price *
                Number(item.quantity || 0);


            message +=
                `${index + 1}. ${product.name}%0A`;

            message +=
                `   Warna: ${item.color || "Belum dipilih"}%0A`;

            message +=
                `   Jumlah: ${item.quantity}%0A`;

            message +=
                `   Subtotal: ${formatPrice(subtotal)}%0A%0A`;

        }
    );


    message +=
        `Total: ${formatPrice(getCartTotal())}%0A%0A`;

    message +=
        "Mohon konfirmasi ketersediaan produk, warna, dan detail pengiriman.%0A%0A";

    message +=
        "Terima kasih.";


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        checkoutViaWhatsApp
    );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    if (!toast || !toastMessage) {
        return;
    }


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimeout);


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove("show");

            },
            2500
        );

}


/* =========================================================
   NAVBAR SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        if (!navbar) {
            return;
        }


        if (window.scrollY > 30) {

            navbar.style.boxShadow =
                "0 10px 30px rgba(61, 48, 45, 0.06)";

        } else {

            navbar.style.boxShadow =
                "none";

        }

    },
    {
        passive: true
    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }


        closeSearch();
        closeMobileMenu();
        closeCart();
        closeProductModal();

    }
);


/* =========================================================
   CLICK OUTSIDE SEARCH
========================================================= */

document.addEventListener(
    "click",
    (event) => {

        if (
            !searchPanel ||
            !searchToggle
        ) {
            return;
        }


        const clickedInsideSearch =
            searchPanel.contains(event.target);


        const clickedSearchButton =
            searchToggle.contains(event.target);


        if (
            searchPanel.classList.contains("open") &&
            !clickedInsideSearch &&
            !clickedSearchButton
        ) {
            closeSearch();
        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

loadCart();
renderCart();
applyFilters();