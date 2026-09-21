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
        name: "Pashmina Nude Cream",
        price: 55000,
        image: "images/hijab1.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "Best Seller",
        description:
            "Pashmina dengan warna nude cream yang lembut, elegan, dan mudah dipadukan untuk berbagai gaya."
    },

    {
        id: 2,
        name: "Pashmina Black",
        price: 55000,
        image: "images/hijab2.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "New",
        description:
            "Pashmina hitam dengan warna klasik dan versatile untuk tampilan yang simpel, elegan, dan timeless."
    },

    {
        id: 3,
        name: "Pashmina Light Grey",
        price: 55000,
        image: "images/hijab3.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "",
        description:
            "Pashmina abu-abu muda dengan tone soft dan modern yang cocok untuk tampilan minimalis."
    },

    {
        id: 4,
        name: "Pashmina Broken White",
        price: 55000,
        image: "images/hijab4.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "",
        description:
            "Pashmina broken white dengan nuansa off-white yang clean, lembut, dan timeless."
    },

    {
        id: 5,
        name: "Pashmina Muted Brown",
        price: 55000,
        image: "images/hijab5.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "Premium",
        description:
            "Pashmina muted brown dengan warna cokelat lembut yang memberikan kesan hangat dan sophisticated."
    },

    {
        id: 6,
        name: "Pashmina Taupe",
        price: 55000,
        image: "images/hijab6.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "New",
        description:
            "Pashmina taupe dengan warna coklat muda yang netral dan mudah dipadukan dengan berbagai outfit."
    },

    {
        id: 7,
        name: "Pashmina Soft Purple",
        price: 55000,
        image: "images/hijab7.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "",
        description:
            "Pashmina lilac muda dengan sentuhan soft purple yang memberikan kesan feminin dan elegan."
    },

    {
        id: 8,
        name: "Pashmina Khaki",
        price: 55000,
        image: "images/hijab8.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "",
        description:
            "Pashmina khaki dengan tone cream muda yang natural, lembut, dan versatile untuk berbagai gaya."
    },

    {
        id: 9,
        name: "Pashmina Dark Brown",
        price: 55000,
        image: "images/hijab9.jpeg",
        category: "pashmina",
        categoryName: "Pashmina Collection",
        badge: "Premium",
        description:
            "Pashmina cokelat tua dengan warna deep yang hangat dan elegan untuk tampilan yang lebih sophisticated."
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

const filterButtons =
    document.querySelectorAll(".filter-btn");

const productCards =
    document.querySelectorAll(".product-card");

const noResults =
    document.getElementById("noResults");

const cartToggle =
    document.getElementById("cartToggle");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartSidebar =
    document.getElementById("cartSidebar");

const cartClose =
    document.getElementById("cartClose");

const cartItems =
    document.getElementById("cartItems");

const cartEmpty =
    document.getElementById("cartEmpty");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

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

/*
   Format harga Indonesia.

   Hasil:
   55000
   menjadi:
   Rp. 55.000
*/

function formatPrice(price) {
    return "Rp. " + Number(price).toLocaleString("id-ID");
}


/*
   Mengambil data produk berdasarkan ID.
*/

function getProduct(productId) {
    return products.find(
        (product) =>
            product.id === Number(productId)
    );
}


/*
   Mencegah HTML injection ketika data dimasukkan
   menggunakan innerHTML.
*/

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
            const parsedCart =
                JSON.parse(savedCart);

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


    /*
       Jika warna tidak dipilih,
       gunakan "Belum dipilih".
    */

    const selectedColor =
        color || "Belum dipilih";


    /*
       Cari apakah produk dengan warna yang sama
       sudah ada di shopping bag.
    */

    const existingItem =
        cart.find(
            (item) =>
                Number(item.productId) ===
                    Number(productId) &&
                (item.color || "Belum dipilih") ===
                    selectedColor
        );


    if (existingItem) {

        existingItem.quantity +=
            Number(quantity);

    } else {

        cart.push({
            productId: product.id,
            color: selectedColor,
            quantity: Number(quantity)
        });

    }


    saveCart();

    renderCart();


    showToast(
        `${product.name} ditambahkan ke shopping bag.`
    );
}


/*
   Mengubah jumlah produk dalam cart.
*/

function changeCartQuantity(
    index,
    amount
) {
    if (!cart[index]) {
        return;
    }


    cart[index].quantity =
        Number(cart[index].quantity || 0) +
        Number(amount);


    /*
       Jika jumlah menjadi 0,
       hapus produk dari cart.
    */

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }


    saveCart();

    renderCart();
}


/*
   Menghapus produk dari cart.
*/

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }


    const product =
        getProduct(
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


/*
   Menghitung jumlah seluruh item.
*/

function getCartCount() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.quantity || 0),
        0
    );

}


/*
   Menghitung total harga seluruh item.
*/

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            const product =
                getProduct(item.productId);


            if (!product) {
                return total;
            }


            return (
                total +
                product.price *
                    Number(item.quantity || 0)
            );

        },
        0
    );

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    /*
       Jika shopping bag kosong.
    */

    if (cart.length === 0) {

        if (cartEmpty) {
            cartEmpty.classList.add("show");
        }


        if (cartTotal) {
            cartTotal.textContent =
                formatPrice(0);
        }


        if (cartCount) {
            cartCount.textContent = "0";
        }


        if (checkoutBtn) {

            checkoutBtn.disabled = true;

            checkoutBtn.style.opacity = "0.5";

            checkoutBtn.style.pointerEvents =
                "none";

        }


        return;
    }


    /*
       Shopping bag tidak kosong.
    */

    if (cartEmpty) {
        cartEmpty.classList.remove("show");
    }


    if (checkoutBtn) {

        checkoutBtn.disabled = false;

        checkoutBtn.style.opacity = "1";

        checkoutBtn.style.pointerEvents =
            "auto";

    }


    /*
       Render setiap item.
    */

    cart.forEach(
        (item, index) => {

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


            cartItem.className =
                "cart-item";


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
                        Color:
                        ${escapeHTML(
                            item.color ||
                            "Belum dipilih"
                        )}
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
                                ${Number(
                                    item.quantity || 0
                                )}
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

        }
    );


    /*
       Update total dan jumlah cart.
    */

    if (cartTotal) {
        cartTotal.textContent =
            formatPrice(
                getCartTotal()
            );
    }


    if (cartCount) {
        cartCount.textContent =
            getCartCount();
    }

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

                changeCartQuantity(
                    index,
                    1
                );

            }


            if (action === "decrease") {

                changeCartQuantity(
                    index,
                    -1
                );

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

    if (!cartSidebar || !cartOverlay) {
        return;
    }


    cartSidebar.classList.add("open");

    cartOverlay.classList.add("open");

    document.body.classList.add(
        "no-scroll"
    );

}


function closeCart() {

    if (!cartSidebar || !cartOverlay) {
        return;
    }


    cartSidebar.classList.remove("open");

    cartOverlay.classList.remove("open");

    document.body.classList.remove(
        "no-scroll"
    );

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

document
    .querySelectorAll(".quick-add")
    .forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const productId =
                        Number(
                            button.dataset.productId
                        );


                    /*
                       Quick Add langsung menambahkan
                       produk dengan warna "Belum dipilih".
                    */

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
                shouldShow
                    ? ""
                    : "none";


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


/* =========================================================
   FILTER BUTTON
========================================================= */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                /*
                   Hapus active dari semua button.
                */

                filterButtons.forEach(
                    (btn) =>
                        btn.classList.remove(
                            "active"
                        )
                );


                /*
                   Tambahkan active ke button
                   yang dipilih.
                */

                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter ||
                    "all";


                applyFilters();

            }
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

function openSearch() {

    if (!searchPanel) {
        return;
    }


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

    if (!searchPanel) {
        return;
    }


    searchPanel.classList.remove(
        "open"
    );

}


if (searchToggle) {

    searchToggle.addEventListener(
        "click",
        () => {

            if (
                searchPanel &&
                searchPanel.classList.contains(
                    "open"
                )
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

    if (!mobileNav) {
        return;
    }


    mobileNav.classList.remove(
        "open"
    );

}


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        () => {

            if (!mobileNav) {
                return;
            }


            mobileNav.classList.toggle(
                "open"
            );

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


    /*
       Reset state modal.
    */

    selectedProductId =
        product.id;

    selectedProductColor =
        "";

    selectedProductQuantity =
        1;


    /*
       Isi informasi produk.
    */

    if (modalProductImage) {

        modalProductImage.src =
            product.image;

        modalProductImage.alt =
            product.name;

    }


    if (modalProductCategory) {

        modalProductCategory.textContent =
            product.categoryName;

    }


    if (modalProductName) {

        modalProductName.textContent =
            product.name;

    }


    if (modalProductPrice) {

        modalProductPrice.textContent =
            formatPrice(
                product.price
            );

    }


    if (modalProductDescription) {

        modalProductDescription.textContent =
            product.description ||
            "Pashmina dengan desain elegan dan mudah dipadukan dengan berbagai outfit.";

    }


    /*
       Reset quantity.
    */

    if (modalQuantityElement) {

        modalQuantityElement.textContent =
            "1";

    }


    /*
       Reset pilihan warna.
    */

    if (selectedColorName) {

        selectedColorName.textContent =
            "Belum dipilih";

    }


    if (colorOptions) {

        colorOptions
            .querySelectorAll(
                ".color-swatch"
            )
            .forEach(
                (swatch) => {

                    swatch.classList.remove(
                        "active"
                    );

                }
            );

    }


    /*
       Tampilkan modal.
    */

    if (productModalOverlay) {

        productModalOverlay.classList.add(
            "open"
        );

        document.body.classList.add(
            "no-scroll"
        );

    }

}


function closeProductModal() {

    if (!productModalOverlay) {
        return;
    }


    productModalOverlay.classList.remove(
        "open"
    );


    /*
       Jangan mengunci halaman setelah modal ditutup.
    */

    document.body.classList.remove(
        "no-scroll"
    );

}


/*
   Klik product card membuka modal.
*/

productCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                const productId =
                    Number(
                        card.dataset.id
                    );


                openProductModal(
                    productId
                );

            }
        );

    }
);


/* =========================================================
   MODAL CLOSE
========================================================= */

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
        .querySelectorAll(
            ".color-swatch"
        )
        .forEach(
            (swatch) => {

                swatch.addEventListener(
                    "click",
                    () => {

                        /*
                           Hapus active dari semua
                           pilihan warna.
                        */

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


                        /*
                           Aktifkan warna yang dipilih.
                        */

                        swatch.classList.add(
                            "active"
                        );


                        selectedProductColor =
                            swatch.dataset.color ||
                            "";


                        /*
                           Tampilkan nama warna.
                        */

                        if (selectedColorName) {

                            selectedColorName.textContent =
                                selectedProductColor ||
                                "Belum dipilih";

                        }

                    }
                );

            }
        );

}


/* =========================================================
   MODAL QUANTITY
========================================================= */

function updateModalQuantity() {

    if (!modalQuantityElement) {
        return;
    }


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


            /*
               Warna wajib dipilih
               sebelum produk masuk ke bag.
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

            openCart();

        }
    );

}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

function checkoutViaWhatsApp() {

    /*
       Cek apakah shopping bag kosong.
    */

    if (cart.length === 0) {

        showToast(
            "Shopping bag masih kosong."
        );

        return;
    }


    /*
       Buat pesan WhatsApp.
    */

    let message =
        "Halo Flawsome Kyta by.NR,\n\n";

    message +=
        "Saya ingin melakukan pemesanan:\n\n";


    /*
       Masukkan semua produk ke pesan.
    */

    cart.forEach(
        (item, index) => {

            const product =
                getProduct(
                    item.productId
                );


            if (!product) {
                return;
            }


            const quantity =
                Number(
                    item.quantity || 0
                );


            const subtotal =
                product.price *
                quantity;


            message +=
                `${index + 1}. ${product.name}\n`;

            message +=
                `   Warna: ${
                    item.color ||
                    "Belum dipilih"
                }\n`;

            message +=
                `   Jumlah: ${quantity}\n`;

            message +=
                `   Subtotal: ${
                    formatPrice(subtotal)
                }\n\n`;

        }
    );


    /*
       Total pesanan.
    */

    message +=
        `Total: ${
            formatPrice(
                getCartTotal()
            )
        }\n\n`;


    /*
       Pesan penutup.
    */

    message +=
        "Mohon konfirmasi ketersediaan produk, warna, dan detail pengiriman.\n\n";

    message +=
        "Terima kasih.";


    /*
       Encode pesan agar aman digunakan
       sebagai query parameter WhatsApp.
    */

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            message
        )}`;


    /*
       Buka WhatsApp pada tab baru.
    */

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


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

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
            searchPanel.contains(
                event.target
            );


        const clickedSearchButton =
            searchToggle.contains(
                event.target
            );


        if (
            searchPanel.classList.contains(
                "open"
            ) &&
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