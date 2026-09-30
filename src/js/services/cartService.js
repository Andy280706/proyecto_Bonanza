const CART_KEY = "carritoBonanza";

export const cartService = {
    getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    },

    saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    },

    addToCart(product) {
        const cart = this.getCart();
        const index = cart.findIndex(item => item.id === product.id);
        if (index !== -1) {
            cart[index].cantidad += 1;
        } else {
            cart.push({ ...product, cantidad: 1 });
        }
        this.saveCart(cart);
    },

    updateQuantity(index, cambio) {
        const cart = this.getCart();
        if (cart[index]) {
            cart[index].cantidad += cambio;
            if (cart[index].cantidad < 1) {
                cart[index].cantidad = 1;
            }
            this.saveCart(cart);
        }
    },

    removeItem(index) {
        const cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem(CART_KEY);
    },

    getTotals() {
        const cart = this.getCart();
        let totalDinero = 0;
        let totalItems = 0;

        cart.forEach(item => {
            totalDinero += (item.precio || 0) * (item.cantidad || 0);
            totalItems += item.cantidad || 0;
        });

        return { totalDinero, totalItems };
    }
};