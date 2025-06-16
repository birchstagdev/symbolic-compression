# 🧠 Perceptual Alchemy Decoder

This module implements the symbolic decoder for the Perceptual Alchemy System — reconstructing emotional, spatial, and narrative meaning from compact symbolic strings.

> "It’s not an image translator. It’s a symbolic storyteller."

## 🌌 What It Does

The decoder transforms a 16–32 character perceptual code into:

- 🎭 Emotional mood and “memory echo”
- 🖼️ Scene structure and focus zone
- 🧠 Objects and archetypal cues
- 💭 Narrative impressions (primary, poetic, NPC-biased)

Rather than recreating the original image, it reconstructs *how a scene might feel, be remembered, or be retold*.

## 📂 Key Files

- **symbolic-decoder.js:**  
  Final production-ready decoder implementation.  
  Expands codes into symbolic, spatial, and emotional narrative objects.

## ⚙️ Usage

```js
const decoder = new PerceptualAlchemyDecoder({ mode: 'stable' });

const result = decoder.decode(codeString);
console.log(result.narrative.primary); // "A dim, cluttered corridor with a single hot light"
```

## 📤 Output Format

```json
{
  "scene": "abandoned office",
  "objects": ["rusted chair", "glow terminal", "shredded paper"],
  "mood": "stale, low light",
  "focusZone": "bottom-left",
  "complexity": 0.62,
  "memoryEcho": "identical light pattern seen in sector 3"
}
```

## 🔍 Features

- **String Segmentation:** Decodes substrings into named dimensions
- **Lookup + Bias Engine:** Expands character clusters using human-weighted symbol tables
- **Symbolic Scene Model:** Builds emotional-spatial graph of the scene
- **Output Layers:** Narrative text, JSON scene model, memory echoes
- **Expansion Modes:**  
  - Stable (deterministic, reproducible)  
  - Dreamlike (random/contextual)  
  - NPC-tuned (bias by character memory/personality)

## 🧠 Why It Matters

Enables:
- AI/NPCs to “reason” about past scenes
- Narrative, dreamlike playback for players
- Low-bandwidth symbolic world state streaming

## 📄 License

MIT — see root LICENSE
