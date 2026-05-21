# Google Stitch UI & Layout Specification

## 1. Design Tokens (From Stitch Workspace)
- **Primary Vibe:** Clean, engineering-focused dark mode canvas.
- **Colors:** Deep obsidian backgrounds, dark slate cards, highlighting active interactive objects with vibrant teal and cyber green accents.
- **Typography:** Monospace fonts for telemetry and data grids; highly legible sans-serif for main metrics and headers.

## 2. View Transition Architecture
When the primary view selector triggers a perspective shift (`HR` -> `CEO` -> `CTO`):
1. React context triggers state transitions.
2. Active elements scale down and fade out smoothly over 200ms.
3. The layout mutates structural card constraints dynamically.
4. The incoming role data populates the view, scaling up and easing back into visibility over 300ms.