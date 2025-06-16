# 🧠 Symbolic Encoding & Decoding System

This project implements a symbolic, emotion-aware compression and reconstruction system for visual scenes. Rather than storing or recovering pixel data, it captures how humans perceive and remember — through structure, mood, saliency, and symbolic presence.

---

## 🔍 Project Goal

To build a perceptual encoding and decoding framework that transforms images and video frames into compact, memory-like codes and reconstructs them into symbolic, emotional, and spatial representations for human-first, ai-ready applications.

---

## 💡 Key Features

- **Perceptual Encoder (Complete)**
  - Converts input images into 16–32 character symbolic codes
  - Adaptive sampling based on edge density, color variance, shape recognition, and spatial entropy
  - Uses CIEDE2000 for color perception and radial spatial analysis for cultural grammar
  - Encodes emotional mood and temporal context
  - Exports optional narrative hint metadata and symbol debug maps
  - Supports Reed-Solomon checksum for streaming integrity

- **Symbolic Decoder (Prototype Complete)**
  - Reconstructs mood, scene type, objects, layout, and narrative hints from encoded strings
  - Culture-aware lens remaps symbols based on mythological/archetypal structure
  - Includes dream logic layer, memory blending, and emotional biasing
  - Supports NPC modes for simulated misperception and memory-driven behavior

- **NPC Integration**
  - Allows game agents to perceive scenes symbolically, not omnisciently
  - Enables long-term memory, mood evolution, and individualized worldviews
  - Designed for low-resource environments or planetary-scale simulations

---

## 🧠 Use Cases

- Symbolic world streaming in low-fidelity or browser-first games  
- Scene reconstruction via memory instead of pixels  
- Mood-based storytelling and dreamlike playback  
- Emotionally tagged perceptual logging  
- Symbolic, low-bandwidth AI vision for persistent NPC behavior

---

**Status Update **
Bugfixes: test_error_1241_06162025
The system's vision is sound, symbolic compression of perception is achievable. These fixes address the immediate failures while preserving the philosophical goal of memory, like visual encoding.

---

## 📁 Repo Structure

```
/docs/
  technical/
    symbolic_compression_technical.md
    updated_symbolic_compression_spec.md
  symbolic_compression_architecture.md

/src/
  encoder/
    perceptual-encoder-complete.js
  decoder/
    perceptual-decoder-v3.js
  utils/

README.md
LICENSE.md
```

---

## 📜 Philosophy

This is a human-first, ai-ready perceptual system.  
It does not aim for realism or photometric accuracy.  
It aims to preserve what mattered and reconstruct what should be remembered.  

> "Perception is no longer pixels — it's meaning."

---

## 🧪 Status

- ✅ Perceptual encoder complete  
- ✅ Symbolic decoder prototype implemented  
- ✅ CIEDE2000 and spatial logic active  
- ✅ Cultural grammar and narrative layer added  
- ☐ Decoder symbol visualizer (planned)  
- ☐ Full NPC integration module (planned)  
- ☐ Rendering engine for symbolic views (pending)

---

## 🧷 License

MIT License (see `LICENSE` file).

---

## 🗺️ Roadmap

- [ ] Finalize decoder components (depth layers, visualizer, echoes)
- [ ] Validate encoder/decoder roundtrip consistency
- [ ] Export visual-symbolic logs for scenes
- [ ] Integrate NPC perceptual engine in *When The Sun Dies*
- [ ] Build symbolic rendering layer (textual → graphical reconstruction)

Sometimes, you don’t need a team.  
You just need obsession, some code, and a world worth remembering.

And maybe a shed.

