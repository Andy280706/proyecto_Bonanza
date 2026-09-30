const CART_KEY = "carritoBonanza";

function readCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("bonanza:cart-updated"));
}

export const cartService = {
    getCart: readCart,
    saveCart,

    addItem(product) {
        if (!product?.id) return;
        const cart = readCart();
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.cantidad += 1;
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre || "Producto",
                precio: Number(product.precio) || 0,
                imagen: product.imagen || "",
                categoria: product.categoria || "",
                cantidad: 1
            });
        }

        saveCart(cart);
    },

    addToCart(product) {
        this.addItem(product);
    },

    removeItem(index) {
        const cart = readCart();
        cart.splice(index, 1);
        saveCart(cart);
    },

    updateQuantity(index, change) {
        const cart = readCart();
        if (!cart[index]) return;
        cart[index].cantidad += change;
        if (cart[index].cantidad <= 0) cart.splice(index, 1);
        saveCart(cart);
    },

    clearCart() {
        saveCart([]);
    },

    getTotals() {
        return readCart().reduce((totals, item) => ({
            totalDinero: totals.totalDinero + Number(item.precio) * Number(item.cantidad),
            totalItems: totals.totalItems + Number(item.cantidad)
        }), { totalDinero: 0, totalItems: 0 });
    }
};