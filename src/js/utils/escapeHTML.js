const replacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
};

export function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => replacements[character]);
}