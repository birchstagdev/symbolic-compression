# 🧠 Perceptual Alchemy Encoder

This module implements the Perceptual Alchemy System — a symbolic encoder that transforms visual scenes into emotionally resonant, culturally contextual symbolic strings.

> "This isn't compression — it's perception alchemy."

## 🌌 What It Does

The encoder processes visual data and outputs a 16–32 character symbolic string that captures:

- 🖼️ Scene context and perceptual layout  
- 🎭 Emotional resonance and mood trajectory  
- 🧭 Culturally-aware interpretations (e.g., Norse vs Japanese lens)  
- 🧠 Memory-weighted symbolism for narrative reconstruction  
- 💠 Spatial and archetypal shape detection

These codes are designed not for fidelity, but for meaning — like memory fragments, not raw footage.

## 📂 Key Files

- **symbolic-encoder.js:**  
  Final production-ready encoder implementation.  
  Includes all perceptual, emotional, and narrative encoding layers.

## ⚙️ Usage

```js
const encoder = new PerceptualAlchemyEncoder({
  mode: 'balanced', // 'mobile', 'balanced', 'rich'
  culture: 'japanese', // or 'norse', 'universal', etc.
  emotionalContext: {
    previous: 'melancholic',
    personal: 'nostalgic'
  }
});

const result = encoder.encode(imageData, {
  context: 'viewing old photographs',
  timestamp: Date.now()
});
```

## 📤 Output Format

```json
{
  "code": "AFKTZQWMLNXPDOUJ...",
  "mood": "bittersweet",
  "narrative": {
    "poetic": "Where cherry blossoms once danced, shadows now waltz alone",
    "scene": "an abandoned spring garden at dusk",
    "emotion": "nostalgic melancholy"
  }
}
```

## 🔍 Features

- **Visual Perception Layers:** Edge saliency, shape detection, CIEDE2000 color clustering
- **Emotional Engine:** Valence/arousal, mood trajectory, color-emotion mapping
- **Cultural Grammar:** Radial/spatial and archetype mapping
- **Symbol Management:** Entropy-aware allocation, Reed-Solomon checksum
- **Debug & Visualization:** Track source of each symbol, output object map

## 💾 Storage + Transmission

- Compression ratio: up to 34,000:1
- Output strings are Twitter-length

## 📄 License

MIT — see root LICENSE
