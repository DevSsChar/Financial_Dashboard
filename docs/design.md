# Design Guidelines and Aesthetic Details

The visual language of Zorvyn is strictly governed by a modern, flat, and high-contrast design system. The goal is to provide a premium, application-like experience that avoids generic web templates.

## Core Design Principles

1. **Flat Design and Zero Shadows**
   The application strictly avoids CSS box-shadows, drop-shadows, and heavy gradients. Hierarchy and depth are established using color contrast, subtle borders, and precise padding. Components should feel distinctly flat and modern.

2. **Shape and Radius Standardization**
   - **Containers and Cards:** Used for large surfaces like transaction tables, chart wrappers, and summary blocks. These elements use a consistent 20px border radius.
   - **Interactive Elements:** Buttons, inputs, and category badges utilize a pill-shape radius (fully rounded edges) to distinguish them from static containers and invite user interaction.

3. **Color Palette and Variables**
   The application relies heavily on dynamic CSS variables mapped within a comprehensive Tailwind configuration.
   - Surfaces utilize specific hexadecimal scales rather than generic Tailwind grays.
   - High-contrast text foregrounds ensure readability.
   - Accent colors (e.g., success green, danger red) are carefully chosen to not overwhelm the interface but to draw attention to critical financial indicators.

4. **Typography**
   Fonts utilize specific weights (such as 500/Medium for primary values and labels) to improve legibility. Tabular numbers are employed to ensure consistent vertical alignment across transaction amounts.

5. **Motion and Micro-interactions**
   Framer Motion is used systematically but sparingly. Elements slide in gracefully on load, and hover effects provide immediate feedback without feeling distracting. Transitions are kept under 300ms to maintain a snappy, responsive feel.
