# Bolt Ghana 3D Vehicle Assets

Place the following files in this directory. Names must match **exactly** (lowercase, `.png` extension).

## Required files

| File              | Description                                        | Used in             |
|-------------------|----------------------------------------------------|----------------------|
| `hero.png`        | Landing page hero — all 4 vehicles lined up         | LandingScreen        |
| `basic.png`       | White car with green door panel (Bolt Basic)        | RiderCard, ResultScreen |
| `comfort.png`     | Grey/dark sedan (Bolt Comfort)                      | RiderCard, ResultScreen |
| `send.png`        | Motorbike with package OR standalone box (Bolt Send)| RiderCard, ResultScreen |
| `tricycle.png`    | Green tuk-tuk / 3-wheeler (Bolt Tricycle)           | RiderCard, ResultScreen |
| `logo.svg`        | Bolt logo (white version)                           | Optional branding    |
| `map-bg.svg`      | Tiled diamond/cross pattern for map background      | Optional (CSS fallback exists) |
| `route.svg`       | Hand-drawn green route path                         | Optional (SVG fallback exists) |

## Specs

- **Format**: PNG for vehicles/hero, SVG for logo/map assets
- **Recommended size**: Vehicle renders ~600x400px minimum (displayed at 180x140, rendered at 2x for retina)
- **Hero image**: ~640x280px minimum (displayed at 320x140)
- **Background**: Transparent (PNG-24 with alpha)

If any file is missing, the app falls back to emoji placeholders automatically.
