/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                kepler: {
                    red: '#9D2235',
                    gold: '#FFCD00',
                    aqua: '#e0f2f1',
                    black: '#1a1a1a'
                }
            },
            fontFamily: {
                sans: ['Noto Sans', 'sans-serif'],
            }
        },
    },
    plugins: [],
}