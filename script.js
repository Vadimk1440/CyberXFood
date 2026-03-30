const menuItems = [
    {
        id: 1,
        name: "Кибербургер",
        description: "Булочки с кунжутом, сочная говяжья котлета, сыр чеддер, салат, лук, помидор, фирменный соус",
        price: 350,
        category: "burgers",
        image: "images/кибербургер.jpg"
    },
    {
        id: 2,
        name: "Пицца Пепперони",
        description: "Американская классика с пикантной пепперони, моцареллой и томатным соусом",
        price: 650,
        category: "pizza",
        image: "images/пепперони.png"
    },
    {
        id: 3,
        name: "Наггетсы с соусом",
        description: "Хрустящие куриные наггетсы с выбором соуса: кетчуп, сырный, барбекю или чесночный",
        price: 280,
        category: "snacks",
        image: "images/наггетсы.jpg"
    },
    {
        id: 4,
        name: "Энергетик Adrenaline Rush",
        description: "Освежающий энергетический напиток с классическим вкусом",
        price: 140,
        category: "drinks",
        image: "images/энергетик.png"
    },
    {
        id: 5,
        name: "Чизбургер с беконом",
        description: "Говяжья котлета, бекон, сыр, лук, соленые огурцы, соус",
        price: 260,
        category: "burgers",
        image: "images/чизбургер.png"
    },
    {
        id: 6,
        name: "Картофель фри",
        description: "Хрустящий картофель фри с солью и специями",
        price: 180,
        category: "snacks",
        image: "images/картофель.png"
    },
    {
        id: 7,
        name: "Пицца Маргарита",
        description: "Двойная порция моцареллы, томаты и орегано",
        price: 700,
        category: "pizza",
        image: "images/маргарита.png"
    },
    {
        id: 8,
        name: "Кола",
        description: "Освежающий газированный напиток",
        price: 150,
        category: "drinks",
        image: "images/кола.png"
    }
];

// Корзина
let cart = [];
const deliveryCost = 200;

// DOM элементы
let menuGridElement, cartItemsElement, cartCountElement,
    itemsTotalElement, orderTotalElement, emptyCartMessage,
    filterButtons, checkoutButton, indexPage, cartPage,
    navHome, navMenu, navAbout, navCart, homeLink, goToMenu;

let currentPage = 'index';

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    menuGridElement = document.getElementById('menu-grid');
    cartItemsElement = document.getElementById('cart-items');
    cartCountElement = document.querySelector('.cart-count');
    itemsTotalElement = document.getElementById('items-total');
    orderTotalElement = document.getElementById('order-total');
    emptyCartMessage = document.getElementById('empty-cart-message');
    filterButtons = document.querySelectorAll('.filter-btn');
    checkoutButton = document.getElementById('checkout-btn');
    indexPage = document.getElementById('index-page');
    cartPage = document.getElementById('cart-page');
    navHome = document.getElementById('nav-home');
    navMenu = document.getElementById('nav-menu');
    navAbout = document.getElementById('nav-about');
    navCart = document.getElementById('nav-cart');
    homeLink = document.getElementById('home-link');
    goToMenu = document.getElementById('go-to-menu');

    loadCartFromStorage();
    renderMenuItems(menuItems);
    updateCartDisplay();
    setupEventListeners();
    showIndexPage();
});

// Отображение товаров с изображениями
function renderMenuItems(items) {
    menuGridElement.innerHTML = '';

    items.forEach(item => {
        const menuItemElement = document.createElement('div');
        menuItemElement.className = 'menu-item';
        menuItemElement.setAttribute('data-category', item.category);

        menuItemElement.innerHTML = `
            <div class="menu-item-img">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-footer">
                    <div class="menu-item-price">${item.price} ₽</div>
                    <button class="add-to-cart" data-id="${item.id}">
                        +
                    </button>
                </div>
            </div>
        `;

        menuGridElement.appendChild(menuItemElement);
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            addToCart(itemId);
        });
    });
}

function setupEventListeners() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            if (category === 'all') {
                renderMenuItems(menuItems);
            } else {
                const filteredItems = menuItems.filter(item => item.category === category);
                renderMenuItems(filteredItems);
            }
        });
    });

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Добавьте товары в корзину перед оформлением заказа');
                return;
            }

            const address = document.getElementById('address').value;
            if (!address.trim()) {
                alert('Пожалуйста, укажите адрес доставки');
                return;
            }

            const clubName = document.getElementById('club-name').value;
            const notes = document.getElementById('notes').value;

            alert(`Заказ оформлен!\nАдрес: ${address}\nКлуб: ${clubName || 'Не указан'}\nПримечания: ${notes || 'Нет'}\nСумма заказа: ${calculateOrderTotal()} ₽\n\nСпасибо за заказ! Ожидайте доставку в течение 40 минут.`);

            cart = [];
            saveCartToStorage();
            updateCartDisplay();

            document.getElementById('address').value = '';
            document.getElementById('club-name').value = '';
            document.getElementById('notes').value = '';

            showIndexPage();
        });
    }

    navHome.addEventListener('click', function(e) {
        e.preventDefault();
        showIndexPage();
        updateActiveNav('home');
    });

    navMenu.addEventListener('click', function(e) {
        e.preventDefault();
        showIndexPage();
        setTimeout(() => {
            const menuSection = document.getElementById('menu');
            if (menuSection) {
                window.scrollTo({
                    top: menuSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }, 100);
        updateActiveNav('menu');
    });

    navAbout.addEventListener('click', function(e) {
        e.preventDefault();
        showIndexPage();
        setTimeout(() => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                window.scrollTo({
                    top: aboutSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }, 100);
        updateActiveNav('about');
    });

    navCart.addEventListener('click', function(e) {
        e.preventDefault();
        showCartPage();
        updateActiveNav('cart');
    });

    homeLink.addEventListener('click', function(e) {
        e.preventDefault();
        showIndexPage();
        updateActiveNav('home');
    });

    if (goToMenu) {
        goToMenu.addEventListener('click', function(e) {
            e.preventDefault();
            showIndexPage();
            updateActiveNav('menu');
            setTimeout(() => {
                const menuSection = document.getElementById('menu');
                if (menuSection) {
                    window.scrollTo({
                        top: menuSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });
    }

    document.querySelectorAll('#index-page a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#menu' || href === '#about') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function showIndexPage() {
    indexPage.style.display = 'block';
    cartPage.style.display = 'none';
    currentPage = 'index';
    document.title = 'CyberFood - Доставка еды для геймеров';
}

function showCartPage() {
    indexPage.style.display = 'none';
    cartPage.style.display = 'block';
    currentPage = 'cart';
    document.title = 'Корзина - CyberFood';
    updateCartDisplay();
}

function updateActiveNav(activeItem) {
    [navHome, navMenu, navAbout, navCart].forEach(nav => {
        nav.classList.remove('nav-active');
    });

    switch(activeItem) {
        case 'home':
            navHome.classList.add('nav-active');
            break;
        case 'menu':
            navMenu.classList.add('nav-active');
            break;
        case 'about':
            navAbout.classList.add('nav-active');
            break;
        case 'cart':
            navCart.classList.add('nav-active');
            break;
    }
}

function addToCart(itemId) {
    const item = menuItems.find(product => product.id === itemId);
    if (!item) return;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${item.name} добавлен в корзину`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartDisplay();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }

    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    if (cartItemsElement) {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsElement.innerHTML = '';
            cartItemsElement.appendChild(emptyCartMessage);
        } else {
            emptyCartMessage.style.display = 'none';

            let cartHTML = '';

            cart.forEach(item => {
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-img">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>${item.price} ₽</p>
                            </div>
                        </div>
                        <div class="cart-item-controls">
                            <div class="quantity-control">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <img src="icons/delete.png" style="width: 25px; height: 25px;">
                            </button>
                        </div>
                    </div>
                `;
            });

            cartItemsElement.innerHTML = cartHTML;

            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    const item = cart.find(item => item.id === itemId);
                    if (item) {
                        updateQuantity(itemId, item.quantity - 1);
                    }
                });
            });

            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    const item = cart.find(item => item.id === itemId);
                    if (item) {
                        updateQuantity(itemId, item.quantity + 1);
                    }
                });
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(itemId);
                });
            });
        }
    }

    updateOrderSummary();
}

function updateOrderSummary() {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderTotal = itemsTotal + deliveryCost;

    if (itemsTotalElement) itemsTotalElement.textContent = `${itemsTotal} ₽`;
    if (orderTotalElement) orderTotalElement.textContent = `${orderTotal} ₽`;
}

function calculateOrderTotal() {
    const itemsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return itemsTotal + deliveryCost;
}

function saveCartToStorage() {
    localStorage.setItem('cyberfood_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cyberfood_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #ff0000;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(255, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}
