// Global variables
let currentUser = null;
let currentPage = 'home';
let cart = [];
let products = [];
let currentCategory = 'all';

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    loadFeaturedProducts();
});

// Initialize application
function initializeApp() {
    showPage('home');
    updateCartCount();
    updateUserMenu();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) {
                showPage(page);
                updateActiveNavLink(e.target);
            }
        });
    });

    // Category links
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = e.target.dataset.category;
            showPage('products');
            loadProducts();
        });
    });

    // Cart icon
    cartIcon.addEventListener('click', () => {
        if (currentUser) {
            showCartModal();
        } else {
            showToast('Please login to view your cart', 'error');
            showLoginModal();
        }
    });

    // User menu
    userBtn.addEventListener('click', () => {
        userDropdown.classList.toggle('active');
    });

    // Close user dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            userDropdown.classList.remove('active');
        }
    });

    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Auth forms
    setupAuthForms();

    // Checkout form
    setupCheckoutForm();

    // CTA button
    document.querySelector('.cta-button').addEventListener('click', (e) => {
        const page = e.target.dataset.page;
        if (page) {
            showPage(page);
            loadProducts();
        }
    });
}

// Show specific page
function showPage(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(`${pageName}Page`).classList.add('active');
    currentPage = pageName;

    if (pageName === 'products') {
        loadProducts();
    }
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserProfile();
    }
}

// Fetch user profile
async function fetchUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateUserMenu();
            loadCart();
        } else {
            localStorage.removeItem('token');
            currentUser = null;
            updateUserMenu();
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        currentUser = null;
        updateUserMenu();
    }
}

// Update user menu
function updateUserMenu() {
    const userAuthSection = document.getElementById('userAuthSection');
    
    if (currentUser) {
        userAuthSection.innerHTML = `
            <div class="user-info">
                <p>Welcome, ${currentUser.name}</p>
                <a href="#" id="viewOrders">My Orders</a>
                <a href="#" id="logoutBtn">Logout</a>
            </div>
        `;

        // Add event listeners
        document.getElementById('logoutBtn').addEventListener('click', logout);
        document.getElementById('viewOrders').addEventListener('click', viewOrders);
    } else {
        userAuthSection.innerHTML = `
            <div class="auth-buttons">
                <a href="#" id="loginBtn">Login</a>
                <a href="#" id="registerBtn">Register</a>
            </div>
        `;

        // Add event listeners
        document.getElementById('loginBtn').addEventListener('click', showLoginModal);
        document.getElementById('registerBtn').addEventListener('click', showRegisterModal);
    }
}

// Setup authentication forms
function setupAuthForms() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                currentUser = data.user;
                updateUserMenu();
                loadCart();
                document.getElementById('loginModal').classList.remove('active');
                showToast('Login successful!', 'success');
            } else {
                showToast(data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Login failed. Please try again.', 'error');
        }
    });

    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                currentUser = data.user;
                updateUserMenu();
                document.getElementById('registerModal').classList.remove('active');
                showToast('Registration successful!', 'success');
            } else {
                showToast(data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showToast('Registration failed. Please try again.', 'error');
        }
    });

    // Switch between login and register
    document.getElementById('showRegister').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('registerModal').classList.add('active');
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerModal').classList.remove('active');
        document.getElementById('loginModal').classList.add('active');
    });
}

// Show modals
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

// Logout
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cart = [];
    updateUserMenu();
    updateCartCount();
    showToast('Logged out successfully', 'success');
}

// Load featured products
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE}/products/featured/list`);
        const featuredProducts = await response.json();
        
        const container = document.getElementById('featuredProducts');
        container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Load products
async function loadProducts() {
    try {
        let url = `${API_BASE}/products?limit=12`;
        
        if (currentCategory !== 'all') {
            url += `&category=${currentCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        products = data.products;
        
        const container = document.getElementById('productsGrid');
        container.innerHTML = products.map(product => createProductCard(product)).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

// Create product card HTML
function createProductCard(product) {
    const price = product.onSale && product.salePrice ? product.salePrice : product.price;
    const originalPrice = product.onSale ? product.price : null;
    
    return `
        <div class="product-card" data-product-id="${product._id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                <div class="product-price">
                    $${price.toFixed(2)}
                    ${originalPrice ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button onclick="viewProduct('${product._id}')">View Details</button>
                <button onclick="addToCart('${product._id}')">Add to Cart</button>
            </div>
        </div>
    `;
}

// View product details
async function viewProduct(productId) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        const product = await response.json();
        
        const modal = document.getElementById('productModal');
        const productDetails = modal.querySelector('.product-details');
        
        productDetails.innerHTML = `
            <div class="product-detail-content">
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-brand">Brand: ${product.brand || 'N/A'}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        $${(product.onSale && product.salePrice ? product.salePrice : product.price).toFixed(2)}
                        ${product.onSale ? `<span class="original-price">$${product.price.toFixed(2)}</span>` : ''}
                    </div>
                    <p class="product-stock">Stock: ${product.stock} available</p>
                    <div class="product-actions">
                        <button onclick="addToCart('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
                            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading product details:', error);
        showToast('Error loading product details', 'error');
    }
}

// Add to cart
async function addToCart(productId) {
    if (!currentUser) {
        showToast('Please login to add items to cart', 'error');
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Item added to cart!', 'success');
            updateCartCount();
        } else {
            showToast(data.message || 'Failed to add item to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding item to cart', 'error');
    }
}

// Load cart
async function loadCart() {
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/cart`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            cart = cartData.items || [];
            updateCartCount();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Show cart modal
async function showCartModal() {
    try {
        const response = await fetch(`${API_BASE}/cart`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            displayCart(cartData);
            document.getElementById('cartModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        showToast('Error loading cart', 'error');
    }
}

// Display cart
function displayCart(cartData) {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const shippingCost = document.getElementById('shippingCost');
    const taxAmount = document.getElementById('taxAmount');
    const cartTotal = document.getElementById('cartTotal');

    if (cartData.items.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartSubtotal.textContent = '$0.00';
        shippingCost.textContent = '$0.00';
        taxAmount.textContent = '$0.00';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cartData.items.map(item => `
        <div class="cart-item">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div class="cart-item-info">
                <h4>${item.product.name}</h4>
                <p>Price: $${(item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price).toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
                    <span>Quantity: ${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.product._id}')" class="remove-btn">Remove</button>
        </div>
    `).join('');

    const subtotal = cartData.totalAmount;
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    shippingCost.textContent = `$${shipping.toFixed(2)}`;
    taxAmount.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update cart quantity
async function updateCartQuantity(productId, quantity) {
    try {
        const response = await fetch(`${API_BASE}/cart/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (response.ok) {
            showCartModal(); // Refresh cart display
            updateCartCount();
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        showToast('Error updating cart', 'error');
    }
}

// Remove from cart
async function removeFromCart(productId) {
    try {
        const response = await fetch(`${API_BASE}/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            showCartModal(); // Refresh cart display
            updateCartCount();
            showToast('Item removed from cart', 'success');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showToast('Error removing item from cart', 'error');
    }
}

// Setup checkout form
function setupCheckoutForm() {
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        document.getElementById('cartModal').classList.remove('active');
        document.getElementById('checkoutModal').classList.add('active');
    });

    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const shippingAddress = {
            street: document.getElementById('shippingStreet').value,
            city: document.getElementById('shippingCity').value,
            state: document.getElementById('shippingState').value,
            zipCode: document.getElementById('shippingZip').value,
            country: document.getElementById('shippingCountry').value
        };

        const paymentInfo = {
            method: document.getElementById('paymentMethod').value
        };

        try {
            const response = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ shippingAddress, paymentInfo })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('checkoutModal').classList.remove('active');
                showToast('Order placed successfully!', 'success');
                updateCartCount();
                // Reset form
                document.getElementById('checkoutForm').reset();
            } else {
                showToast(data.message || 'Order failed', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Error placing order', 'error');
        }
    });
}

// Perform search
function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        showPage('products');
        loadSearchResults(query);
    }
}

// Load search results
async function loadSearchResults(query) {
    try {
        const response = await fetch(`${API_BASE}/products?search=${encodeURIComponent(query)}`);
        const data = await response.json();
        products = data.products;
        
        const container = document.getElementById('productsGrid');
        container.innerHTML = products.map(product => createProductCard(product)).join('');
    } catch (error) {
        console.error('Error searching products:', error);
        showToast('Error searching products', 'error');
    }
}

// View orders
function viewOrders() {
    // This would typically show a orders page/modal
    showToast('Orders feature coming soon!', 'info');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}
