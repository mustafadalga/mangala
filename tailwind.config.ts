import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            animation: {
                bounce: "bounce 1s ease-in infinite",
                blast: "blast 1s ease-in infinite",
            },
            keyframes: {
                blast: {
                    "0%, 40%": {
                        "font-size": "0.5px"
                    },
                    "70%": {
                        "opacity": "1",
                        "font-size": "4px"
                    },
                    "100%": {
                        "font-size": "6px",
                        "opacity": "0"
                    }
                },
                bounce: {
                    "0%, 100%": {
                        "font-size": "0.75px"
                    },
                    "50%": {
                        "font-size": "1.5px"
                    }
                }
            },
        },
    },
    plugins: [],
}
export default config
