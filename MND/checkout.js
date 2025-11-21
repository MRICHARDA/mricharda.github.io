// Sweet Balance - Checkout System
let cart = [];

// Elementos del DOM
const modal = document.getElementById('checkoutModal');
const cartButton = document.getElementById('cartButton');
const cartCountBadge = document.getElementById('cartCount');
const closeModalBtn = document.getElementById('closeModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const paymentForm = document.getElementById('paymentForm');
const cardFields = document.getElementById('cardFields');

// Botones "Agregar" del menú
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Event Listeners
addToCartButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const name = this.getAttribute('data-name');
    const price = parseFloat(this.getAttribute('data-price'));
    addToCart(name, price);
    
    // Feedback visual
    this.textContent = '✓ Agregado';
    this.style.background = 'linear-gradient(135deg, #25d366, #1ebe57)';
    setTimeout(() => {
      this.textContent = 'Agregar';
      this.style.background = '';
    }, 1200);
  });
});

cartButton.addEventListener('click', () => {
  openModal();
});

closeModalBtn.addEventListener('click', () => {
  closeModal();
});

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Alternar campos de tarjeta según método de pago
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.value === 'card') {
      cardFields.style.display = 'block';
      document.getElementById('cardNumber').required = true;
      document.getElementById('expiry').required = true;
      document.getElementById('cvv').required = true;
    } else {
      cardFields.style.display = 'none';
      document.getElementById('cardNumber').required = false;
      document.getElementById('expiry').required = false;
      document.getElementById('cvv').required = false;
    }
  });
});

// Formateo automático de tarjeta
document.getElementById('cardNumber').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\s/g, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  e.target.value = formattedValue;
});

// Formateo automático de fecha de expiración
document.getElementById('expiry').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  e.target.value = value;
});

// Solo números en CVV
document.getElementById('cvv').addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
});

// Procesar formulario de pago
paymentForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = new FormData(paymentForm);
  const paymentMethod = formData.get('paymentMethod');
  
  // Simular procesamiento
  const submitBtn = paymentForm.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Procesando...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    // Simular éxito
    showSuccessMessage(paymentMethod);
    submitBtn.textContent = 'Confirmar Pedido';
    submitBtn.disabled = false;
    
    // Limpiar carrito y formulario
    cart = [];
    paymentForm.reset();
    updateCartDisplay();
    
    setTimeout(() => {
      closeModal();
    }, 3000);
  }, 2000);
});

// Funciones del carrito
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  
  updateCartDisplay();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity <= 0) {
    removeFromCart(index);
  } else {
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  // Actualizar contador del badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;
  cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío. Agrega postres desde el menú.</p>';
    cartTotalElement.textContent = 'Q 0.00';
    return;
  }
  
  let html = '<ul class="cart-list">';
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    html += `
      <li class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <span class="cart-item-price">Q ${item.price}</span>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
          <span class="qty">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${index})">🗑</button>
        </div>
      </li>
    `;
  });
  
  html += '</ul>';
  cartItemsContainer.innerHTML = html;
  cartTotalElement.textContent = `Q ${total.toFixed(2)}`;
}

function openModal() {
  updateCartDisplay();
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function showSuccessMessage(method) {
  const methodText = method === 'card' ? 'tarjeta' : 'efectivo contra entrega';
  const message = document.createElement('div');
  message.className = 'success-message';
  message.innerHTML = `
    <div class="success-icon">✓</div>
    <h3>¡Pedido confirmado!</h3>
    <p>Tu pedido ha sido procesado exitosamente con pago por ${methodText}.</p>
    <p>Recibirás una confirmación por WhatsApp en breve.</p>
  `;
  
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = '';
  modalContent.appendChild(message);
}
