/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

const ButtonColors = {
    TEXT: 'var(--button-text)',
    PRIMARY: 'var(--button-primary)',
    SECONDARY: 'var(--button-secondary)',
    TERTIARY: 'var(--button-tertiary)',
};

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        /*
         * StayFit palette.
         * Brand: vibrant orange (#FF5A1F) for primary actions,
         * emerald (#10B981) for success/accents,
         * cool slate neutrals for surfaces and text.
         *
         * Legacy `lm-*` tokens are kept as aliases that now point at the
         * StayFit palette so existing components rebrand automatically.
         */
        colors: {
            transparent: 'transparent',
            'white': '#ffffff',

            /* StayFit brand */
            'sf-orange': {
                100: '#FFB593',
                200: '#FF7A47',
                300: '#FF5A1F',
                400: '#E04617',
                500: '#B33611',
            },
            'sf-emerald': {
                100: '#6EE7B7',
                200: '#10B981',
                300: '#047857',
            },
            'sf-slate': {
                50: '#F8FAFC',
                100: '#F1F5F9',
                200: '#E2E8F0',
                300: '#CBD5E1',
                400: '#94A3B8',
                500: '#64748B',
                600: '#475569',
                700: '#334155',
                800: '#1E293B',
                900: '#0F172A',
                950: '#020617',
            },

            /* Legacy aliases → StayFit palette */
            'lm-green': '#047857',
            'lm-red': '#EF4444',
            'lm-emerald': '#10B981',
            'lm-cyan': '#0EA5E9',
            'lm-light-blue': '#0284C7',
            'lm-light-yellow': '#FFEDD5',
            'lm-mint': {
                100: '#6EE7B7',
                200: '#10B981',
            },
            'lm-purple': {
                100: '#A78BFA',
                200: '#7C3AED',
            },
            'lm-magenta': {
                100: '#F472B6',
                200: '#DB2777',
            },
            'lm-yellow': {
                100: '#FF7A47',
                200: '#FF5A1F',
            },
            'lm-grey': {
                100: '#CBD5E1',
                200: '#94A3B8',
                300: '#475569',
                400: '#64748B',
                500: '#334155',
            },
            'lm-blue': {
                400: '#1E293B',
                500: '#0F172A',
            },
            'lm-black': {
                100: '#1E293B',
                200: '#0F172A',
                300: '#334155',
                400: '#020617',
            },
            'strava-brand': '#FC4C02',
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            prebase: '0.9375rem',
            base: '1rem',
            md: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.375rem',
            '3xl': '1.75rem',
            '4xl': '2.625rem',
            '5xl': '5rem',
        },
        fontWeight: {
            light: '300',
            normal: '400',
            semibold: '500',
            bold: '600',
            extrabold: '700',
            heavybold: '800',
        },
        lineHeight: {
            '1': '0.75rem',
            '2': '0.875rem',
            '3': '1rem',
            '4': '1.25rem',
            '5': '1.375rem',
            '6': '1.75rem',
            '7': '2.125rem',
            '8': '2.25rem',
            '9': '3.5856rem',
        },
        screens: {
            'sm': '370px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1940px',
        },
        extend: {
            animation: {
                'load': 'spin 700ms infinite ease-in-out',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',

                'fade-in': 'fade-in 500ms ease-in',
            },
            keyframes: {
                'fade-in': {
                    '0%': {
                        transform: 'scale(0)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                },
                pulse: {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.05)', opacity: 0.5 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                },
            },
            fontFamily: {
                sans: ['Manrope', ...defaultTheme.fontFamily.sans],
                accent: ['Lato', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                'auth': 'linear-gradient(to right, #FF5A1F 20%, transparent 130%), linear-gradient(to right, #0F172A 20%, transparent 100%), url("~/assets/img/auth-bg.png")',
                'rectangle':
                    'linear-gradient(89.83deg, #FF5A1F 36.42%, rgba(255, 90, 31, 0) 125.23%)',
                'goalWidget': 'var(--gradient-goal-widget)',
                'scheduleWidget': 'var(--gradient-schedule-widget)',
                'wave-yellow': 'url("~/assets/img/wave-yellow.svg")',
                'wave-magenta': 'url("~/assets/img/wave-magenta.svg")',
                'wave-purple': 'url("~/assets/img/wave-purple.svg")',
                'wave-grey': 'url("~/assets/img/wave-grey.svg")',
                'wave-green': 'url("~/assets/img/wave-green.svg")',
                'progress-line': 'url("~/assets/img/progress-line.svg")',
            },
            borderRadius: {
                '30': '1.9rem',
                '34': '2.1rem',
            },
            width: {
                '30': '7.5625rem',
                '50': '12.5',
                '83': '5.1875',
                '115': '115px',
                '120': '120px',
                '150': '9.375rem',
                '176': '11rem',
                '874': '54.625',
            },
            height: {
                '30': '7.5625rem',
                '37': '2.3125rem',
                '38': '2.375rem',
                '54': '3.375rem;',
                '176': '11rem',
            },
            spacing: {
                '13': '3.25',
                '18': '4.875',
                '44': '2.75rem',
                '60': '3.75rem',
            },
            minHeight: {
                '90': 'calc(100vh - 5.5rem)',
            },
            maxHeight: {
                '90': 'calc(100vh - 5.5rem)',
            },
            textColor: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
                action: 'var(--text-action)',
                infoSection: 'var(--text-info-section)',
                card: 'var(--text-card)',
                buttonText: ButtonColors.TEXT,
                buttonPrimary: ButtonColors.PRIMARY,
                buttonSecondary: ButtonColors.SECONDARY,
                buttonTertiary: ButtonColors.TERTIARY,
            },
            backgroundColor: {
                primary: 'var(--background-primary)',
                secondary: 'var(--background-secondary)',
                tertiary: 'var(--background-tertiary)',
                overlay: 'var(--modal-overlay)',
                buttonPrimary: ButtonColors.PRIMARY,
                buttonSecondary: ButtonColors.SECONDARY,
                buttonTertiary: ButtonColors.TERTIARY,
                schedule: 'var(--background-schedule)',
            },
            borderColor: {
                primary: 'var(--border-primary)',
                secondary: 'var(--border-secondary)',
                inactive: 'var(--border-inactive)',
                buttonPrimary: ButtonColors.PRIMARY,
                buttonSecondary: ButtonColors.SECONDARY,
                buttonTertiary: ButtonColors.TERTIARY,
            },
            ringColor: {
                primary: 'var(--ring-primary)',
                inactive: 'var(--ring-inactive)',
            },
            stroke: {
                progressBase: 'var(--stroke-progress-base-bg)',
                primary: 'var(--circle-primary)',
            },
        },
    },
    plugins: [],
};
