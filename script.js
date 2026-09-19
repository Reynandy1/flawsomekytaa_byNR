/* =========================================
   FLAWSOMEKYTAA_BYNR
   MAIN JAVASCRIPT
========================================= */


/* =========================================
   PRODUCT DATA
========================================= */

const products = [

    {
        id: 1,
        name: "Pashmina Latte",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 59000,
        image: "images/hijab1.jpeg",
        description:
            "Pashmina dengan nuansa latte yang lembut untuk menciptakan tampilan clean, feminine, dan effortless."
    },

    {
        id: 2,
        name: "Pashmina Sand",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        price: 59000,
        image: "images/hijab2.jpeg",
        description:
            "Pashmina bernuansa sand yang versatile dan mudah dipadukan dengan berbagai gaya outfit."
    },

    {
        id: 3,
        name: "Square Cream",
        category: "square",
        categoryName: "Square Collection",
        price: 55000,
        image: "images/hijab3.jpeg",
        description:
            "Square hijab dengan nuansa cream yang memberikan kesan soft, minimal, dan timeless."
    },

    {
        id: 4,
        name: "Square Mocha",
        category: "square",
        categoryName: "Square Collection",
        price: 55000,
        image: "images/hijab4.jpeg",
        description:
            "Square hijab dengan karakter warna mocha yang hangat untuk tampilan yang sederhana namun elegan."
    },

    {
        id: 5,
        name: "Silk Cocoa",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab5.jpeg",
        description:
            "Koleksi premium bernuansa cocoa untuk kamu yang menyukai tampilan lebih sophisticated dan timeless."
    },

    {
        id: 6,
        name: "Silk Rose",
        category: "premium",
        categoryName: "Premium Collection",
        price: 89000,
        image: "images/hijab6.jpeg",
        description:
            "Koleksi premium bernuansa rose dengan karakter feminine dan elegan untuk berbagai kesempatan."
    }

];


/* =========================================
   SETTINGS
========================================= */

const WHATSAPP_NUMBER = "62882002403676";

const CART_STORAGE_KEY = "flawsomekytaa_cart";


/* =========================================
   STATE
========================================= */

let cart = [];

let toastTimeout = null;

let currentFilter = "all";

let currentSearch = "";

let selectedProductId = null;

let selectedProductColor = "";

let selectedProductQuantity = 1;


/* =========================================
   DOM - NAVBAR
========================================= */

const navbar = document.getElementById("navbar");

const searchToggle = document.getElementById("searchToggle");

const searchPanel = document.getElementById("searchPanel");

const searchInput = document.getElementById("searchInput");

const searchClose = document.getElementById("searchClose");

const menuToggle = document.getElementById("menuToggle");

const mobileNav = document.getElementById("mobileNav");


/* =========================================
   DOM - COLLECTION
========================================= */

const productGrid = document.getElementById("productGrid");

const productCards = document.querySelectorAll(".product-card");

const filterButtons = document.querySelectorAll(".filter-btn");

const quickAddButtons = document.querySelectorAll(".quick-add");

const noResults = document.getElementById("noResults");


/* =========================================
   DOM - CART
========================================= */

const cartToggle = document.getElementById("cartToggle");

const cartClose = document.getElementById("cartClose");

const cartOverlay = document.getElementById("cartOverlay");

const cartSidebar = document.getElementById("cartSidebar");

const cartItems = document.getElementById("cartItems");

const cartEmpty = document.getElementById("cartEmpty");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const continueShopping = document.getElementById("continueShopping");


/* =========================================
   DOM - PRODUCT MODAL
========================================= */

const productModalOverlay =
    document.getElementById("productModalOverlay");

const productModal =
    document.getElementById("productModal");

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

const selectedColorText =
    document.getElementById("selectedColorText");

const modalQuantityElement =
    document.getElementById("modalQuantity");

const modalQuantityMinus =
    document.getElementById("modalQuantityMinus");

const modalQuantityPlus =
    document.getElementById("modalQuantityPlus");

const modalAddToBag =
    document.getElementById("modalAddToBag");


/* =========================================
   DOM - TOAST
========================================= */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================
   PRICE FORMATTER
========================================= */

function formatPrice(price) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(price);

}


/* =========================================
   GET PRODUCT
========================================= */

function getProduct(productId) {

    return products.find(
        product => product.id === Number(productId)
    );

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================
   LOAD CART
========================================= */

function loadCart() {

    try {

        const savedCart =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!savedCart) {

            cart = [];

            return;
        }

        const parsedCart =
            JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {

            cart = [];

            return;
        }

        cart = parsedCart
            .filter(item => item && item.id)
            .map(item => {

                return {
                    id: Number(item.id),
                    color: item.color || "",
                    quantity: Math.max(
                        1,
                        Number(item.quantity) || 1
                    )
                };

            });

    } catch (error) {

        console.error(
            "Gagal membaca cart:",
            error
        );

        cart = [];

    }

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(
    productId,
    color = "",
    quantity = 1
) {

    const product =
        getProduct(productId);

    if (!product) {
        return;
    }

    const cleanQuantity =
        Math.max(1, Number(quantity) || 1);

    const existingItem =
        cart.find(item =>
            item.id === Number(productId) &&
            item.color === color
        );

    if (existingItem) {

        existingItem.quantity += cleanQuantity;

    } else {

        cart.push({
            id: Number(productId),
            color: color,
            quantity: cleanQuantity
        });

    }

    saveCart();

    renderCart();

    showToast(
        `${product.name} berhasil ditambahkan ke bag.`
    );

}


/* =========================================
   CHANGE CART QUANTITY
========================================= */

function changeCartQuantity(
    cartIndex,
    amount
) {

    const index = Number(cartIndex);

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


/* =========================================
   REMOVE CART ITEM
========================================= */

function removeCartItem(cartIndex) {

    const index = Number(cartIndex);

    if (!cart[index]) {
        return;
    }

    const product =
        getProduct(cart[index].id);

    cart.splice(index, 1);

    saveCart();

    renderCart();

    if (product) {

        showToast(
            `${product.name} dihapus dari bag.`
        );

    }

}


/* =========================================
   CALCULATE CART COUNT
========================================= */

function calculateCartCount() {

    return cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

}


/* =========================================
   CALCULATE CART TOTAL
========================================= */

function calculateCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                getProduct(item.id);

            if (!product) {
                return total;
            }

            return total +
                product.price *
                Number(item.quantity || 0);

        },
        0
    );

}


/* =========================================
   RENDER CART
========================================= */

function renderCart() {

    const count =
        calculateCartCount();

    const total =
        calculateCartTotal();


    /* COUNT */

    cartCount.textContent = count;


    /* TOTAL */

    cartTotal.textContent =
        formatPrice(total);


    /* EMPTY */

    if (cart.length === 0) {

        cartItems.innerHTML = "";

        cartEmpty.classList.add("show");

        return;
    }

    cartEmpty.classList.remove("show");


    /* ITEMS */

    cartItems.innerHTML =
        cart.map((item, index) => {

            const product =
                getProduct(item.id);

            if (!product) {
                return "";
            }

            const itemTotal =
                product.price *
                Number(item.quantity);


            const colorHTML =
                item.color
                    ? `
                        <span class="cart-item-color">
                            Warna: ${escapeHTML(item.color)}
                        </span>
                    `
                    : `
                        <span class="cart-item-color">
                            Warna: Belum dipilih
                        </span>
                    `;


            return `

                <div class="cart-item">

                    <div class="cart-item-image">

                        <img
                            src="${product.image}"
                            alt="${escapeHTML(product.name)}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <span class="cart-item-category">
                            ${escapeHTML(product.categoryName)}
                        </span>

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        ${colorHTML}

                        <span class="cart-item-price">
                            ${formatPrice(itemTotal)}
                        </span>


                        <div class="cart-item-controls">

                            <button
                                type="button"
                                data-cart-action="decrease"
                                data-cart-index="${index}"
                                aria-label="Kurangi jumlah"
                            >
                                <i class="fa-solid fa-minus"></i>
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                data-cart-action="increase"
                                data-cart-index="${index}"
                                aria-label="Tambah jumlah"
                            >
                                <i class="fa-solid fa-plus"></i>
                            </button>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="cart-item-remove"
                        data-cart-action="remove"
                        data-cart-index="${index}"
                        aria-label="Hapus produk"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `;

        }).join("");

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   CART EVENT DELEGATION
========================================= */

cartItems.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-cart-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.cartAction;

        const index =
            Number(button.dataset.cartIndex);


        if (action === "increase") {

            changeCartQuantity(index, 1);

        }


        if (action === "decrease") {

            changeCartQuantity(index, -1);

        }


        if (action === "remove") {

            removeCartItem(index);

        }

    }
);


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.classList.add("cart-open");

}


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.classList.remove("cart-open");

}


/* =========================================
   CART BUTTON
========================================= */

cartToggle.addEventListener(
    "click",
    openCart
);

cartClose.addEventListener(
    "click",
    closeCart
);

cartOverlay.addEventListener(
    "click",
    closeCart
);


/* =========================================
   CONTINUE SHOPPING
========================================= */

continueShopping.addEventListener(
    "click",
    closeCart
);


/* =========================================
   QUICK ADD
========================================= */

quickAddButtons.forEach(button => {

    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const productId =
                button.dataset.productId;

            /*
             * Quick Add tetap dipertahankan seperti
             * versi website sebelumnya.
             *
             * Karena Quick Add tidak membuka pilihan warna,
             * produk ditambahkan tanpa warna terlebih dahulu.
             */

            addToCart(
                productId,
                "",
                1
            );

        }
    );

});


/* =========================================
   FILTER
========================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                item =>
                    item.classList.remove("active")
            );

            button.classList.add("active");

            currentFilter =
                button.dataset.filter;

            applyFilters();

        }
    );

});


/* =========================================
   APPLY FILTERS + SEARCH
========================================= */

function applyFilters() {

    let visibleCount = 0;

    productCards.forEach(card => {

        const productId =
            Number(card.dataset.productId);

        const product =
            getProduct(productId);

        if (!product) {
            return;
        }

        const matchesFilter =
            currentFilter === "all" ||
            product.category === currentFilter;

        const searchText =
            currentSearch.trim().toLowerCase();

        const matchesSearch =
            !searchText ||
            product.name.toLowerCase().includes(searchText) ||
            product.categoryName.toLowerCase().includes(searchText);


        const shouldShow =
            matchesFilter &&
            matchesSearch;


        if (shouldShow) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleCount === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }

}


/* =========================================
   SEARCH OPEN
========================================= */

function openSearch() {

    searchPanel.classList.add("active");

    setTimeout(
        () => searchInput.focus(),
        100
    );

}


/* =========================================
   SEARCH CLOSE
========================================= */

function closeSearch() {

    searchPanel.classList.remove("active");

}


/* =========================================
   SEARCH EVENTS
========================================= */

searchToggle.addEventListener(
    "click",
    openSearch
);

searchClose.addEventListener(
    "click",
    closeSearch
);

searchInput.addEventListener(
    "input",
    () => {

        currentSearch =
            searchInput.value;

        applyFilters();

    }
);


/* =========================================
   MOBILE MENU
========================================= */

menuToggle.addEventListener(
    "click",
    () => {

        mobileNav.classList.toggle("active");

    }
);


/* =========================================
   MOBILE NAV LINKS
========================================= */

const mobileLinks =
    mobileNav.querySelectorAll("a");

mobileLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            mobileNav.classList.remove("active");

        }
    );

});


/* =========================================
   PRODUCT CARD DETAIL
========================================= */

productCards.forEach(card => {

    card.addEventListener(
        "click",
        event => {

            /*
             * Jangan buka modal ketika
             * tombol Quick Add ditekan.
             */

            if (
                event.target.closest(".quick-add")
            ) {
                return;
            }

            const productId =
                card.dataset.productId;

            openProductModal(productId);

        }
    );

});


/* =========================================
   OPEN PRODUCT MODAL
========================================= */

function openProductModal(productId) {

    const product =
        getProduct(productId);

    if (!product) {
        return;
    }

    selectedProductId =
        Number(productId);

    selectedProductColor = "";

    selectedProductQuantity = 1;


    /* PRODUCT INFO */

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


    /* RESET COLOR */

    selectedColorText.textContent =
        "Belum dipilih";

    document
        .querySelectorAll(".color-swatch")
        .forEach(swatch => {

            swatch.classList.remove("active");

        });


    /* RESET QUANTITY */

    modalQuantityElement.textContent =
        selectedProductQuantity;


    /* OPEN */

    productModalOverlay.classList.add("active");

    document.body.classList.add("modal-open");

}


/* =========================================
   CLOSE PRODUCT MODAL
========================================= */

function closeProductModal() {

    productModalOverlay.classList.remove("active");

    document.body.classList.remove("modal-open");

    selectedProductId = null;

    selectedProductColor = "";

    selectedProductQuantity = 1;

}


/* =========================================
   CLOSE MODAL BUTTON
========================================= */

modalClose.addEventListener(
    "click",
    closeProductModal
);


/* =========================================
   CLOSE MODAL WHEN CLICK OUTSIDE
========================================= */

productModalOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModalOverlay
        ) {

            closeProductModal();

        }

    }
);


/* =========================================
   COLOR SELECTION
========================================= */

colorOptions.addEventListener(
    "click",
    event => {

        const swatch =
            event.target.closest(
                ".color-swatch"
            );

        if (!swatch) {
            return;
        }


        document
            .querySelectorAll(".color-swatch")
            .forEach(item => {

                item.classList.remove("active");

            });


        swatch.classList.add("active");


        selectedProductColor =
            swatch.dataset.color;


        selectedColorText.textContent =
            selectedProductColor;

    }
);


/* =========================================
   QUANTITY MINUS
========================================= */

modalQuantityMinus.addEventListener(
    "click",
    () => {

        if (
            selectedProductQuantity > 1
        ) {

            selectedProductQuantity--;

            modalQuantityElement.textContent =
                selectedProductQuantity;

        }

    }
);


/* =========================================
   QUANTITY PLUS
========================================= */

modalQuantityPlus.addEventListener(
    "click",
    () => {

        if (
            selectedProductQuantity < 99
        ) {

            selectedProductQuantity++;

            modalQuantityElement.textContent =
                selectedProductQuantity;

        }

    }
);


/* =========================================
   ADD FROM PRODUCT DETAIL
========================================= */

modalAddToBag.addEventListener(
    "click",
    () => {

        if (!selectedProductId) {
            return;
        }


        /*
         * Warna wajib dipilih
         */

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


        /*
         * Buka shopping bag setelah produk
         * berhasil dimasukkan.
         */

        setTimeout(
            () => {
                openCart();
            },
            250
        );

    }
);


/* =========================================
   CHECKOUT WHATSAPP
========================================= */

checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Shopping bag masih kosong."
            );

            return;
        }


        let message =
            "Halo flawsomekytaa_byNR, saya ingin memesan:%0A%0A";


        cart.forEach(
            (item, index) => {

                const product =
                    getProduct(item.id);

                if (!product) {
                    return;
                }

                const itemTotal =
                    product.price *
                    Number(item.quantity);


                message +=
                    `${index + 1}. ${product.name}%0A`;

                message +=
                    `Warna: ${
                        item.color ||
                        "Belum dipilih"
                    }%0A`;

                message +=
                    `Jumlah: ${item.quantity}%0A`;

                message +=
                    `Subtotal: ${formatPrice(itemTotal)}%0A%0A`;

            }
        );


        message +=
            `Total: ${formatPrice(
                calculateCartTotal()
            )}%0A%0A`;

        message +=
            "Mohon informasi mengenai ketersediaan dan proses selanjutnya. Terima kasih.";


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    clearTimeout(toastTimeout);

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove("show");

            },
            2800
        );

}


/* =========================================
   NAVBAR SCROLL
========================================= */

function handleNavbarScroll() {

    if (
        window.scrollY > 30
    ) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

}

window.addEventListener(
    "scroll",
    handleNavbarScroll
);


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        if (
            productModalOverlay.classList.contains(
                "active"
            )
        ) {

            closeProductModal();

            return;
        }


        if (
            cartSidebar.classList.contains(
                "active"
            )
        ) {

            closeCart();

            return;
        }


        if (
            searchPanel.classList.contains(
                "active"
            )
        ) {

            closeSearch();

            return;
        }


        mobileNav.classList.remove(
            "active"
        );

    }
);


/* =========================================
   CLICK OUTSIDE SEARCH
========================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !searchPanel.contains(event.target) &&
            !searchToggle.contains(event.target) &&
            searchPanel.classList.contains("active")
        ) {

            closeSearch();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

loadCart();

renderCart();

applyFilters();

handleNavbarScroll();