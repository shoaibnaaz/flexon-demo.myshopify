document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMobileMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    mobileMenuOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Mobile Dropdowns
    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    
    mobileDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
    });
    
    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function goToSlide(slideIndex) {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
            dots[index].classList.toggle('active', index === slideIndex);
        });
        currentSlide = slideIndex;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto slide change
    let slideInterval = setInterval(nextSlide, 5000);
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    nextBtn.addEventListener('click', resetInterval);
    prevBtn.addEventListener('click', resetInterval);
    dotsContainer.addEventListener('click', resetInterval);
    
    // Shopping Cart
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const productsGrid = document.querySelector('.products-grid');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCart() {
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart sidebar
        renderCartItems();
        
        // Update subtotal
        updateSubtotal();
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="#" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="${item.images ? item.images[0] : ''}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="remove-item">Remove</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }
    
    function updateSubtotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
    }
    
    function decreaseQuantity(e) {
        const itemId = e.target.closest('.cart-item').dataset.id;
        const item = cart.find(item => item.id === itemId);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== itemId);
        }
        
        updateCart();
    }
    
    function increaseQuantity(e) {
        const itemId = e.target.closest('.cart-item').dataset.id;
        const item = cart.find(item => item.id === itemId);
        item.quantity += 1;
        updateCart();
    }
    
    function removeItem(e) {
        const itemId = e.target.closest('.cart-item').dataset.id;
        cart = cart.filter(item => item.id !== itemId);
        updateCart();
    }
    
    // Toggle cart sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Product Data - Enhanced with more products and related categories
    const products = [
        {
            id: '1',
            name: 'Classic White T-Shirt',
            category: 'clothing',
            relatedCategory: 'men',
            price: 24.99,
            oldPrice: 29.99,
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Premium quality white t-shirt made from 100% organic cotton. Comfortable fit for everyday wear.',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#ffffff', '#2a2a2a', '#3366cc'],
            badge: 'Sale'
        },
        {
            id: '2',
            name: 'Slim Fit Jeans',
            category: 'clothing',
            relatedCategory: 'men',
            price: 26.99,
            images: [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Modern slim fit jeans with stretch technology for maximum comfort. Perfect for casual outings.',
            sizes: ['28', '30', '32', '34'],
            colors: ['#2a2a2a', '#3a3a3a', '#4a4a4a'],
            badge: 'Popular'
        },
        {
            id: '3',
            name: 'Leather Wallet',
            category: 'accessories',
            relatedCategory: 'men',
            price: 23.00,
            images: [
                'https://images.unsplash.com/photo-1548032885-b5e38734688a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1591561954555-607968c989ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Genuine leather wallet with multiple card slots and cash compartment. Handcrafted for durability.',
            colors: ['#8B4513', '#2a2a2a'],
            badge: 'New'
        },
        {
            id: '4',
            name: 'Wireless Headphones',
            category: 'electronics',
            relatedCategory: 'electronics',
            price: 46.50,
            oldPrice: 53.50,
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Crystal clear sound quality.',
            colors: ['#2a2a2a', '#d10024', '#3366cc'],
            badge: 'Sale'
        },
        {
            id: '5',
            name: 'Running Shoes',
            category: 'footwear',
            relatedCategory: 'sports',
            price: 45.00,
            images: [
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Lightweight running shoes with cushioned soles for maximum comfort. Perfect for marathon runners.',
            sizes: ['7', '8', '9', '10', '11'],
            colors: ['#d10024', '#2a2a2a', '#3366cc'],
            badge: 'New'
        },
        {
            id: '6',
            name: 'Denim Jacket',
            category: 'clothing',
            relatedCategory: 'men',
            price: 35.00,
            images: [
                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Classic denim jacket with modern fit. Features multiple pockets and premium stitching.',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#3366cc', '#2a2a2a'],
            badge: 'Popular'
        },
        {
            id: '7',
            name: 'Floral Summer Dress',
            category: 'clothing',
            relatedCategory: 'women',
            price: 32.00,
            oldPrice: 40.00,
            images: [
                'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Beautiful floral summer dress with comfortable fit. Perfect for beach vacations and summer outings.',
            sizes: ['S', 'M', 'L'],
            colors: ['#ff66b2', '#3366cc', '#ffffff'],
            badge: 'Sale'
        },
        {
            id: '8',
            name: 'Yoga Pants',
            category: 'clothing',
            relatedCategory: 'women',
            price: 10.00,
            images: [
                'https://images.unsplash.com/photo-1583744946564-b52d01e2da64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1583744946564-b52d01e2da64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'High-waisted yoga pants with stretch fabric for maximum comfort during workouts.',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#2a2a2a', '#4a4a4a', '#6a6a6a'],
            badge: 'New'
        },
        {
            id: '9',
            name: 'Smart Watch',
            category: 'electronics',
            relatedCategory: 'electronics',
            price: 20.50,
            images: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1558126319-c9feecbf57ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Feature-packed smart watch with health monitoring, notifications and 7-day battery life.',
            colors: ['#2a2a2a', '#d10024', '#3366cc'],
            badge: 'Popular'
        },
        {
            id: '10',
            name: 'Sports Backpack',
            category: 'accessories',
            relatedCategory: 'sports',
            price: 34.00,
            images: [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Durable sports backpack with multiple compartments and water bottle holder.',
            colors: ['#2a2a2a', '#3366cc'],
            badge: 'New'
        },
        {
            id: '11',
            name: 'Leather Handbag',
            category: 'accessories',
            relatedCategory: 'women',
            price: 30.00,
            images: [
                'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1566150902887-9679ecc155ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'Elegant leather handbag with multiple compartments and adjustable strap.',
            colors: ['#8B4513', '#2a2a2a'],
            badge: 'Popular'
        },
        {
            id: '12',
            name: 'Basketball Shoes',
            category: 'footwear',
            relatedCategory: 'sports',
            price: 15.50,
            images: [
                'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
            ],
            description: 'High-performance basketball shoes with excellent ankle support and cushioning.',
            sizes: ['8', '9', '10', '11', '12'],
            colors: ['#d10024', '#2a2a2a', '#3366cc'],
            badge: 'New'
        }
    ];

    // Product Modal Elements
    const productModal = document.querySelector('.product-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnailImagesContainer = document.querySelector('.thumbnail-images');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const relatedProductsContainer = document.createElement('div');
    relatedProductsContainer.className = 'related-products';

    // Function to open product modal
    function openProductModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        // Set main product details
        productTitle.textContent = product.name;
        productPrice.textContent = `$${product.price.toFixed(2)}`;
        if (product.oldPrice) {
            productPrice.innerHTML += ` <span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
        }
        productDescription.textContent = product.description;
        
        // Set product images
        mainProductImage.src = product.images[0];
        mainProductImage.alt = product.name;
        
        thumbnailImagesContainer.innerHTML = '';
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `${product.name} - ${index + 1}`;
            thumbnail.addEventListener('click', () => {
                mainProductImage.src = image;
            });
            thumbnailImagesContainer.appendChild(thumbnail);
        });
        
        // Show related products
        showRelatedProducts(product);
        
        // Open modal
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to show related products
    function showRelatedProducts(currentProduct) {
        // Clear previous related products
        relatedProductsContainer.innerHTML = '';
        
        // Find related products (same relatedCategory but not the current product)
        const relatedProducts = products.filter(
            product => product.relatedCategory === currentProduct.relatedCategory && 
                      product.id !== currentProduct.id
        );
        
        if (relatedProducts.length > 0) {
            const relatedTitle = document.createElement('h3');
            relatedTitle.textContent = 'You May Also Like';
            relatedProductsContainer.appendChild(relatedTitle);
            
            const relatedGrid = document.createElement('div');
            relatedGrid.className = 'related-products-grid';
            
            // Show up to 4 related products
            relatedProducts.slice(0, 4).forEach(product => {
                const relatedProduct = document.createElement('div');
                relatedProduct.className = 'related-product';
                relatedProduct.dataset.id = product.id;
                
                relatedProduct.innerHTML = `
                    <img src="${product.images[0]}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <p>$${product.price.toFixed(2)}</p>
                `;
                
                relatedProduct.addEventListener('click', () => {
                    openProductModal(product.id);
                });
                
                relatedGrid.appendChild(relatedProduct);
            });
            
            relatedProductsContainer.appendChild(relatedGrid);
            
            // Add to modal if not already there
            if (!productModal.querySelector('.related-products')) {
                productModal.querySelector('.modal-body').appendChild(relatedProductsContainer);
            }
        }
    }

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Update renderProducts function to include click event
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = productsToRender.map(product => `
            <div class="product-card" data-id="${product.id}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="action-btn"><i class="far fa-heart"></i></button>
                        <button class="action-btn quick-view" data-id="${product.id}"><i class="fas fa-search"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to product cards
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't open modal if clicking on buttons inside the card
                if (e.target.closest('.action-btn') || e.target.closest('.add-to-cart')) {
                    return;
                }
                const productId = card.dataset.id;
                openProductModal(productId);
            });
        });
        
        // Add event listeners to quick view buttons
        document.querySelectorAll('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                openProductModal(productId);
            });
        });
        
        // Add event listeners to add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = btn.dataset.id;
                const product = products.find(p => p.id === productId);
                addToCart(product);
                
                // Show cart sidebar
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // Category Filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryCards = document.querySelectorAll('.category-card');

    // Handle category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === category);
                renderProducts(filteredProducts);
            }
        });
    });

    // Handle category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.querySelector('h3').textContent.toLowerCase();
            
            // Remove "Fashion" from "Men's Fashion" to match our relatedCategory
            const relatedCategory = category.includes("men") ? "men" : 
                                  category.includes("women") ? "women" : 
                                  category.includes("sports") ? "sports" : 
                                  category.toLowerCase();
            
            // Update active category button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.category-btn[data-category="all"]`).classList.add('active');
            
            // Filter products by relatedCategory
            const filteredProducts = products.filter(product => 
                product.relatedCategory === relatedCategory
            );
            
            renderProducts(filteredProducts);
            
            // Scroll to products section
            document.querySelector('.product-filter').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initialize with all products
    renderProducts(products);
});





// Add this to your existing JavaScript file
function updateTimeDate() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    
    // Create the time-date element if it doesn't exist
    if (!document.querySelector('.time-date')) {
        const timeDateElement = document.createElement('div');
        timeDateElement.className = 'time-date';
        document.querySelector('.search-container').insertAdjacentElement('afterend', timeDateElement);
    }
    
    document.querySelector('.time-date').textContent = `${timeString} | ${dateString}`;
}

// Update time immediately and then every minute
updateTimeDate();
setInterval(updateTimeDate, 60000);