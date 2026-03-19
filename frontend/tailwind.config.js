/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-whatsapp-light', 'bg-whatsapp-dark', 'bg-whatsapp-darker', 'bg-whatsapp-bg',
    'text-whatsapp-light', 'text-whatsapp-dark', 'text-whatsapp-darker',
    'border-whatsapp-light', 'border-whatsapp-dark', 'border-whatsapp-darker',
    'from-whatsapp-light', 'from-whatsapp-dark', 'from-whatsapp-darker',
    'to-whatsapp-light', 'to-whatsapp-dark', 'to-whatsapp-darker',
    'shadow-whatsapp-light', 'shadow-whatsapp-dark',
    'ring-whatsapp-light', 'ring-whatsapp-dark',
    'hover:bg-whatsapp-dark', 'hover:bg-whatsapp-darker',
    'focus:ring-whatsapp-light', 'focus:ring-whatsapp-dark',
    'focus:border-whatsapp-light', 'focus:border-whatsapp-dark',
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          dark: '#128C7E',
          darker: '#075E54',
          bg: '#E5DDD5'
        }
      }
    },
  },
  plugins: [],
}
