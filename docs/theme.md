# Theme Name: "Neon Console" (aka Lumina Core)

## 1. Core Philosophy
*   **High Density & Data-Rich:** Avoids massive padding and huge fonts. It embraces dense information architecture.
*   **Military / Aerospace Typography:** Relies heavily on micro-typography (9px - 11px), uppercase text, and extreme letter spacing to mimic hardware interfaces.
*   **Deep Darkness & Neon Glows:** Uses an almost-black background canvas punctuated by thin, semi-transparent borders and highly saturated, glowing accent colors.
*   **Alive & Resonant:** Frequent use of subtle animations (pulsing dots, shimmering lines, rotating elements) to make the interface feel like a living machine reading a continuous data stream.

---

## 2. Color Palette
The theme abandons standard grays in favor of very dark, cool, purple-tinted blacks, allowing the neon accents to pop.

### Backgrounds (The Canvas)
*   **App Background:** `#08070b` (Deep void)
*   **Sidebar/Navigation:** `#060509` (Slightly darker for depth)
*   **Panels/Modals/Cards:** `#0c0a14` or `bg-white/[0.01]` to `bg-white/[0.04]` (Translucent overlays)

### Text (The Data)
*   **Primary Text:** `text-white` or `text-slate-200` (Used sparingly for actual values)
*   **Secondary/Labels:** `text-slate-400` to `text-slate-600`
*   **Muted/Metadata:** `text-slate-700`

### Accents (The Neon)
*   **Primary Brand (Violet):** `violet-400` (`#a78bfa`) and `violet-500` (`#8b5cf6`). Used for primary actions, active states, and focus rings.
*   **Success/Online (Emerald):** `emerald-400` / `emerald-500`. Used for "Nominal" status and uptime.
*   **Warning/Load (Amber):** `amber-400` / `amber-500`.
*   **Critical/Error (Red):** `red-400` / `red-500`.
*   **Secondary Tech (Cyan):** `cyan-400` / `cyan-500`. Used for contrast against Violet in charts.

---

## 3. Typography Rules
This is the secret sauce of the theme. The typography makes it look like a terminal.

*   **Font Families:** 
    *   Sans-serif: `Inter` (or system UI).
    *   Monospace: `JetBrains Mono` (Crucial for IDs, logs, metrics, and code).
*   **The "Micro-Header" Pattern:**
    Almost all labels, table headers, and section titles use this exact Tailwind class combination:
    `text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500`
*   **The "Metric" Pattern:**
    Large data points use ultra-light weights to contrast with the heavy micro-headers:
    `text-2xl font-light text-white tracking-tighter`

---

## 4. Key UI Primitives & Patterns

### 1. Borders & Panels (The "Glass Wireframe")
Instead of solid backgrounds for cards, the theme uses highly transparent white backgrounds with thin borders. When hovered, the border opacity increases slightly.
*   **Base Card:** `border border-white/[0.04] bg-white/[0.01]`
*   **Hover State:** `hover:border-white/[0.08] transition-colors`

### 2. The "Neon Glow" (Shadows)
Buttons, active elements, and status indicators don't just change color; they emit light. This is done using specific box-shadows matching the accent color.
*   **Violet Glow:** `shadow-[0_0_15px_rgba(139,92,246,0.3)]`
*   **Active Button:** `bg-violet-600 border border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]`

### 3. Badges
Badges are structural and technical, using low-opacity backgrounds with matching colored borders and text.
*   **Example (Success):** `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] uppercase tracking-[0.2em] font-bold px-2.5 py-0.5`

### 4. Status Indicators (Pulsing Dots)
Every panel that represents a live system uses a pulsing dot to imply continuous connection.
*   **Live Dot:** `<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>`

### 5. Abstract Decorators
The UI feels complex because it adds meaningless (but aesthetically pleasing) structural elements:
*   **Crosshairs:** `border-x-4 border-x-transparent border-t-4 border-t-violet-500/40`
*   **Circuit Lines:** `w-8 h-[1px] bg-white/[0.06]` acting as dividers.
*   **Kbd Tags:** Tiny keyboard shortcuts styled like physical keys: `bg-white/[0.04] border border-white/10 text-[8px] font-mono`.

---

## 5. How to Replicate It (The Setup)

To drop this theme into any new Vite/Tailwind project, use this setup:

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // You can rely mostly on Tailwind's default slate, violet, emerald
        // But setting your specific dark voids is helpful:
        void: {
          900: '#060509', // Deepest (Sidebar)
          800: '#08070b', // Main background
          700: '#0c0a14', // Panels/Modals
          600: '#12101c', // Tooltips/Popovers
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(350%)' },
        }
      }
    },
  },
  plugins: [],
}
```

### Base CSS (`index.css`)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-void-800 text-slate-400 font-sans antialiased selection:bg-violet-500/30;
  }
}

/* Custom Scrollbar for the Terminal Vibe */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.15); /* violet-500 at 15% */
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.3);
}

/* Custom Range Slider */
input[type=range]::-webkit-slider-runnable-track { height: 6px; }
```

### The Ultimate Copy-Paste Component Wrapper
If you want to build a new component in this style, use this wrapper mentally:
```tsx
<div className="border border-white/[0.04] bg-void-700/50 p-6 hover:border-white/[0.08] transition-colors relative group">
  {/* Header */}
  <div className="flex items-center justify-between mb-4 border-b border-white/[0.04] pb-2">
    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
      Panel_Title
    </h3>
    <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
  </div>
  
  {/* Content */}
  <div className="text-[11px] font-mono text-slate-300">
    System nominal.
  </div>
</div>
