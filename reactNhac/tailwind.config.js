/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // Đường dẫn đến các file của bạn để Tailwind có thể quét và áp dụng các lớp
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

