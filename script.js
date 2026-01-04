/* ==========================================
   LAUNDRY SERVICES WEB APP - JAVASCRIPT
   ========================================== */

// Initialize EmailJS with your public key
// Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
(function() {
    emailjs.init('YOUR_PUBLIC_KEY');
})();

// Cart data
let cart = [];
let totalAmount = 0;

// ==========================================
// CART FUNCTIONS
// ==========================================

function addToCart(id, name, price) {
    // Check if item already in cart
    if (cart.find(item => item.id === id)) {
        return;
    }
    
    // Add to cart
    cart.push({ id, name, price });
    
    // Update UI
    updateCartDisplay();
    toggleButtons(id, true);
}

function removeFromCart(id) {
    // Remove from cart
    cart = cart.filter(item => item.id !== id);
    
    // Update UI
    updateCartDisplay();
    toggleButtons(id, false);
}

function toggleButtons(id, isInCart) {
    const serviceItem = document.querySelector(`.service-item[data-id="${id}"]`);
    if (serviceItem) {
        const addBtn = serviceItem.querySelector('.add-btn');
        const removeBtn = serviceItem.querySelector('.remove-btn');
        
        if (isInCart) {
            addBtn.classList.add('hidden');
            removeBtn.classList.remove('hidden');
        } else {
            addBtn.classList.remove('hidden');
            removeBtn.classList.add('hidden');
        }
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    
    // Clear current display
    cartItemsContainer.innerHTML = '';
    
    // Calculate total
    totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Add cart items
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${index + 1}</span>
            <span>${item.name}</span>
            <span>₹${item.price.toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total
    totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    servicesSection.scrollIntoView({ behavior: 'smooth' });
}

// ==========================================
// BOOKING FORM HANDLING
// ==========================================

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Validate form
    if (!fullName || !email || !phone) {
        alert('Please fill in all fields');
        return;
    }
    
    // Validate cart
    if (cart.length === 0) {
        alert('Please add at least one service to your cart');
        return;
    }
    
    // Prepare services list for email
    const servicesList = cart.map(item => `${item.name} - ₹${item.price.toFixed(2)}`).join('\n');
    
    // Email parameters
    const templateParams = {
        to_email: email,
        from_name: fullName,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        services: servicesList,
        total_amount: `₹${totalAmount.toFixed(2)}`,
        order_date: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    // Send email using EmailJS
    // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS credentials
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            showSuccessMessage();
            resetForm();
        }, function(error) {
            console.log('Email failed to send:', error);
            // Still show success for demo purposes
            // In production, you would handle this error appropriately
            showSuccessMessage();
            resetForm();
        });
});

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.remove('hidden');
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

function resetForm() {
    // Reset form fields
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    // Reset all buttons
    document.querySelectorAll('.service-item').forEach(item => {
        const addBtn = item.querySelector('.add-btn');
        const removeBtn = item.querySelector('.remove-btn');
        addBtn.classList.remove('hidden');
        removeBtn.classList.add('hidden');
    });
}

// ==========================================
// NEWSLETTER SUBSCRIPTION
// ==========================================

function subscribeNewsletter() {
    const name = document.getElementById('newsletterName').value;
    const email = document.getElementById('newsletterEmail').value;
    
    if (!name || !email) {
        alert('Please enter your name and email');
        return;
    }
    
    // Here you would typically send this to your backend or a service
    console.log('Newsletter subscription:', { name, email });
    
    // Show success
    alert('Thank you for subscribing to our newsletter!');
    
    // Clear fields
    document.getElementById('newsletterName').value = '';
    document.getElementById('newsletterEmail').value = '';
}

// ==========================================
// SMOOTH SCROLL FOR NAV LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// PAGE LOAD INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart display
    updateCartDisplay();
    
    console.log('Laundry Services App initialized successfully!');
    console.log('Note: To enable email functionality, add your EmailJS credentials.');
});
