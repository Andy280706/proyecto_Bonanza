export default {
    props: {
        message: {
            type: String,
            default: "Cargando..."
        }
    },

    template: `
        <div class="loading">
            <div class="loading__spinner"></div>
            <p>
                {{ message }}
            </p>
        </div>
    `
};