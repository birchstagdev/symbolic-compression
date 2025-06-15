### 📄 NPC Perception Module: Symbolic Cognition for Game Characters

---

### ❖ Abstract

This paper details a symbolic perception system for NPCs, enabling them to interact with game worlds through emotionally biased, memory-retentive perceptual feeds. Each NPC receives a modified instance of the perceptual encoder, tuned to their personality, cognitive traits, and context. This allows for memory-driven behavior, divergent scene interpretation, and organic world interaction — producing the illusion of inner life without relying on traditional AI or hardcoded triggers.

---

### ❖ Objective

To allow NPCs to perceive their environment not as omniscient systems, but as imperfect, emotional participants. Their perception is shaped by their character profile, experiences, memory thresholds, and internal state — producing symbolic scene interpretations that drive unique and consistent behavior.

---

### ❖ Design Principle

> "Every NPC sees the world differently — because every mind filters meaning differently."

Each NPC uses a **modified encoder** that outputs:

- A symbolic perceptual code (same format as player encoder)
- Emotionally biased focus (saliency warped by fear, curiosity, history)
- Contextual memory echoes (influencing what is noticed)
- Perception degradation (based on stress, fatigue, trauma)

NPCs don’t read world state — they interpret **their own perception of it.**

---

### ❖ Modified Encoding Structure

| Component             | Description                                       |
| --------------------- | ------------------------------------------------- |
| Edge filtering        | Reduced or sharpened depending on attention level |
| Object classification | Vague or enhanced by cognitive bias               |
| Saliency              | Warped toward fear/lust/goals                     |
| Memory hooks          | Echo tags from past scene encodings               |
| Complexity            | Simpler or richer depending on cognitive tier     |

---

### ❖ Example (NPC Perceptual Output)

```json
{
  "perceptualCode": "CMNNPLLQTTRRWWZ",
  "mood": "uneasy",
  "bias": "paranoia",
  "memoryMatch": "similar to sector 5 incident",
  "perceivedObjects": ["lurking", "light", "metal"],
  "spatialFocus": "rear quadrant"
}
```

This tells the behavior system:

- This NPC feels unease.
- Their paranoia colors everything metallic as "hostile potential."
- They believe they’re re-entering a past trauma site.

---

### ❖ Behavior Triggering Pipeline

1. **Perceptual Encoding** → modified symbolic output
2. **Memory Association** → compare with stored codes
3. **Interpretation Layer** → build cognitive frame
4. **Behavior Engine** → act from interpreted perception, not raw world data

---

### ❖ Benefits

- Unique behaviors per NPC even in identical scenes
- Emotionally persistent agents (they remember)
- Symbolic world interaction, not positional or event-based
- Fully compatible with human perceptual system

---

### ❖ Result

NPCs experience the world through **compressed perception**, like the player — but shaped by **their emotional filters and cognitive architecture**. They don’t just respond to data. They respond to meaning.

---

### 📄 Decoding Theory: Reconstructing Perception as Symbolic Experience

---

### ❖ Abstract

The decoding system transforms compact perceptual codes into rich symbolic experiences. These are not visual reconstructions but emotionally accurate impressions, meant to simulate how a scene might be remembered or interpreted by a human. The decoder operates as a symbolic expansion engine — unpacking meaning, mood, and structure from strings designed to compress perception.

---

### ❖ Objective

To decode a 16–32 character perceptual string into structured, emotionally and spatially coherent symbolic data. This reconstruction must remain:

- Faithful to **subjective perception**, not objective reality
- Open to ambiguity, variation, and cultural context
- Usable by NPCs, players, and external modules (narrative, rendering, logic)

---

### ❖ Design Constraints

- No assumption of pixel-perfect reality
- Reconstruction is **narrative**, not geometric
- Must support deterministic and variable decoding modes
- Operate in <200ms on standard CPUs

---

### ❖ Input Format

```json
"perceptualCode": "DFLKMOPQSTZZUUVWXYZKLDF"
```

This string encodes:

- Scene type
- Symbolic objects
- Color/mood weights
- Spatial layout
- Saliency + complexity

---

### ❖ Decoder Architecture

1. **String Segmentation**
   - Decode substrings into named dimensions
2. **Lookup + Bias Engine**
   - Convert character clusters into tokens using human-weighted symbol tables
3. **Symbolic Scene Model Construction**
   - Build emotional-spatial graph of the scene
4. **Output Layer**
   - Narrative: "A dim, cluttered corridor with a single hot light"
   - JSON Graph: object presence, weight, quadrant
   - Perception Graph: memory-focused rendering (for NPC/AI)

---

### ❖ Sample Output

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

---

### ❖ Expansion Modes

- **Stable**: deterministic decoding for reproducible memory
- **Dreamlike**: loose decoding with randomness + context injection
- **NPC-tuned**: bias decoding through character schema

---

### ❖ Use Cases

- Player playback of remembered scenes
- NPC reasoning through perceived past
- Narrative generators feeding on symbolic states
- Data visualization from perceptual logs

---

### ❖ Closing Note

The decoder is not an image translator. It is a **symbolic storyteller**, taking the raw code of a moment and reconstructing the shape of feeling, the weight of layout, and the shadow of memory.

