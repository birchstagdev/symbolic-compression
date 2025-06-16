
# 🧠 Perceptual Alchemy Encoder

This module implements the Perceptual Alchemy System — a symbolic encoder that transforms visual scenes into emotionally resonant, culturally contextual symbolic strings.

"This isn't compression — it's perception alchemy."

## 🌌 What It Does

The encoder processes visual data and outputs a 16–32 character symbolic string that captures:

- 🖼️ Scene context and perceptual layout  
- 🎭 Emotional resonance and mood trajectory  
- 🧭 Culturally-aware interpretations (e.g., Norse vs Japanese lens)  
- 🧠 Memory-weighted symbolism for narrative reconstruction  
- 💠 Spatial and archetypal shape detection

These codes are designed not for fidelity, but for meaning — like memory fragments, not raw footage.

## 📂 Key Files

### perceptual-encoder-complete.js
- Final production-ready encoder implementation.
- Includes all perceptual, emotional, and narrative encoding layers.
- Used in tandem with a decoder to reconstruct perceptual experience.

## ⚙️ Input Format

```js
const encoder = new PerceptualAlchemyEncoder({
  mode: 'balanced', // 'mobile', 'balanced', 'rich'
  culture: 'japanese', // or 'norse', 'default', etc.
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

- imageData: raw image, perceptual features, or symbolic input
- mode: affects symbol budget (16 / 26 / 32 chars)
- culture: applies cultural grammar system to symbols
- emotionalContext: influences mood encoding

## 📤 Output Format

```json
{
  "code": "AFKTZQWMLNXPDOUJ...",
  "mood": "bittersweet",
  "narrative": {
    "poetic": "Where cherry blossoms once danced, shadows now waltz alone",
    "scene": "an abandoned spring garden at dusk",
    "emotion": "nostalgic melancholy"
  },
  "symbolMap": [
    { "symbol": "A", "represents": "scene: outdoor, calm" },
    { "symbol": "F", "represents": "dominant object: blossoms" }
  ]
}
```

## 🔍 Features

### ✅ Visual Perception Layers
- Edge saliency via Sobel filters
- Shape detection using marching squares
- Color clustering with CIEDE2000 distance

### 🎭 Emotional Engine
- Valence/arousal estimation
- Mood trajectory over time
- Warm/cool color-emotion mapping

### 🌐 Cultural Grammar
- Radial spatial analysis for cultures with non-Cartesian perception
- Archetype-symbol reweighting (e.g., "tree" = Yggdrasil in Norse mode)

### 🔐 Symbol Management
- Entropy-aware symbolic allocation
- Position encoding
- Reed-Solomon checksum for streaming robustness

### 🧪 Debug + Visualization
- Track source of each symbol
- Output diagnostic object map
- Optional narrative generation preview

## 🛠️ Encoder Modes

| Mode      | Symbol Count | Purpose                          |
|-----------|--------------|----------------------------------|
| mobile    | ~16 chars     | Low-power devices                |
| balanced  | ~26 chars     | Most use cases                   |
| rich      | ~32 chars     | Maximum fidelity and story depth|

## 💾 Storage + Transmission

- Compression ratio: up to 34,000:1
- Output strings are Twitter-length
- Optional: store memory buffers over time to simulate perception evolution

## 🧠 Why It Matters

Unlike traditional encoders, this system focuses on what a moment means, not just how it looks.

It enables:
- Emotion-aware AI/NPC perception
- Memory-based scene reconstruction
- Cross-cultural symbolic storytelling
- Ultra-light streaming of entire perceptual worlds

## 📄 License

MIT — see root LICENSE
