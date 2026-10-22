export function mostrarToast(mensaje) {
    let contenedor = document.getElementById("toastContainer");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "toastContainer";
        contenedor.className = "toast-container position-fixed top-0 end-0 p-3";
        document.body.append(contenedor);
    }

    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-success border-0";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
    `;
    toast.querySelector(".toast-body").textContent = mensaje;
    toast.addEventListener("hidden.bs.toast", () => toast.remove(), { once: true });
    contenedor.append(toast);

    window.bootstrap.Toast.getOrCreateInstance(toast, { delay: 2500 }).show();
}
