document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const searchInput = document.getElementById('search');
    const clearCartButton = document.getElementById('clear-cart');
    let allProducts = []; // Хранение всех продуктов

    // Загрузка товаров
    async function loadProducts() {
        try {
            const response = await fetch('https://webapi.omoloko.ru/api/v1/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            // console.log(data);

            allProducts = data.products || [];
            displayProducts(allProducts.slice(0, 10)); // Первые 10 товаров
            searchInput.addEventListener('input', filterProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Отображение товаров
    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" />
                <h2 class="cardTitle">${product.title}</h2>
                <p class="cardCost">${product.cost} ₽</p>
                <button class="addToCart" onclick="addToCart('${product.id}', '${product.title}', ${product.cost})">Добавить в корзину</button>
            `;
            productList.appendChild(card);
        });
        updateCartInfo();
    }

    // Фильтрация товаров
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm === '') {
            // Если поле поиска пустое, отображаем первые 10 товаров
            displayProducts(allProducts.slice(0, 10));
        } else {
            const filteredProducts = allProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );
            displayProducts(filteredProducts);
        }
    }

    // Добавление товара в корзину
    window.addToCart = (id, title, price) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ id, title, price });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartInfo();
    };

    // Обновление информации о корзине
    function updateCartInfo() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `${total} ₽`;
    }

    // Очистка корзины
    clearCartButton.addEventListener('click', () => {
        localStorage.removeItem('cart');
        updateCartInfo();
    });

    loadProducts();
});