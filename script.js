const books = [
    // Романы
    { id: 1, title: "Игра предателя", genre: "роман", price: 590, image: "https://static.wikia.nocookie.net/warhammer40k/images/f/ff/CCTraitorsHand.jpg/revision/latest?cb=20210425070130&path-prefix=ru" },
    { id: 2, title: "Смерть или слава", genre: "роман", price: 620, image: "https://static.wikia.nocookie.net/warhammer40k/images/f/f8/CCDeathOrGlory.jpg/revision/latest?cb=20210425065856&path-prefix=ru" },
    { id: 3, title: "Ледяные пещеры", genre: "роман", price: 550, image: "https://static.wikia.nocookie.net/warhammer40k/images/7/7f/CCCavesOfIce.jpg/revision/latest?cb=20210425065805&path-prefix=ru" },
    // Рассказы
    { id: 5, title: "Гамбит предателя", genre: "рассказ", price: 320, image: "https://static.wikia.nocookie.net/warhammer40k/images/6/62/CCTraitorsGambit.jpg/revision/latest?cb=20210425070121&path-prefix=ru" },
    { id: 6, title: "Мельчайший нюанс", genre: "рассказ", price: 290, image: "https://static.wikia.nocookie.net/warhammer40k/images/4/4e/CCTheSmallestDetail.jpg/revision/latest?cb=20210425091057&path-prefix=ru" },
    // Повесть
    { id: 7, title: "Старые вояки никогда не умирают", genre: "повесть", price: 450, image: "https://static.wikia.nocookie.net/warhammer40k/images/9/9d/CCOldSoldiers.jpg/revision/latest?cb=20210425090524&path-prefix=ru" }
];

let cart = [];

const catalogDiv = document.getElementById('catalog');
const filterDiv = document.getElementById('filterButtons');
const cartModal = document.getElementById('cartModal');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartClose = document.querySelector('.cart-close');
const cartItemsDiv = document.getElementById('cartItems');
const cartTotalSpan = document.getElementById('cartTotal');
const cartCountSpan = document.getElementById('cartCount');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

let currentFilter = 'all';

const renderCatalog = () => {
    const filtered = currentFilter === 'all' ? books : books.filter(b => b.genre === currentFilter);
    catalogDiv.innerHTML = '';
    filtered.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <div class="genre">${book.genre}</div>
            <div class="price">${book.price} руб.</div>
            <button data-id="${book.id}">Добавить в корзину</button>
        `;
        catalogDiv.appendChild(card);
    });

    document.querySelectorAll('.book-card button').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
};

const addToCart = (id) => {
    const book = books.find(b => b.id === id);
    if (!book) return;
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...book, quantity: 1 });
    updateCartUI();
    updateCartCount();
};

const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    updateCartCount();
};

const updateCartUI = () => {
    if (!cartItemsDiv) return;
    cartItemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price} руб. x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">Удалить</button>
        `;
        cartItemsDiv.appendChild(div);
        total += item.price * item.quantity;
    });
    cartTotalSpan.textContent = total;

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', e => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
};

const updateCartCount = () => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = count;
};

const clearCart = () => {
    cart = [];
    updateCartUI();
    updateCartCount();
    alert('Корзина очищена');
};

const checkout = () => {
    if (cart.length === 0) alert('Корзина пуста');
    else {
        alert('Покупка прошла успешно!');
        clearCart();
        cartModal.style.display = 'none';
    }
};

const initFilters = () => {
    const genres = [...new Set(books.map(b => b.genre))];
    filterDiv.innerHTML = `<button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">Все</button>` +
        genres.map(g => `<button class="filter-btn ${currentFilter === g ? 'active' : ''}" data-filter="${g}">${g}</button>`).join('');
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalog();
        });
    });
};

const openCart = () => { cartModal.style.display = 'block'; };
const closeCart = () => { cartModal.style.display = 'none'; };

cartToggleBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
window.addEventListener('click', e => { if (e.target === cartModal) closeCart(); });
clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', checkout);

initFilters();
renderCatalog();
updateCartUI();
updateCartCount();