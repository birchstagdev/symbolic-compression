# 🧠 Encoder Module: Perceptual Symbol Generator

This folder contains the implementation for the **symbolic encoder**, which transforms visual input into compact symbolic codes designed to approximate human memory of a scene.

---

## 📂 Files

### `experimentla_perceptual_encoder.js` / `.ts` / `.py`
- Core logic for symbolic encoding.
- Takes in low-res or perceptually preprocessed visual data.
- Outputs a symbolic string (e.g., `QRTLLMNZWWXXP`) that captures:
  - Saliency
  - Spatial layout
  - Mood/color impression
  - Recognized symbolic elements

---

## ⚙️ Input Format

- Raw input: image frame, feature tensor, or JSON of visual attributes.
- Example:
  ```json
  {
    "edges": "high",
    "dominant_colors": ["red", "gray"],
    "objects": ["light", "metal", "movement"]
  }
  ```

---

## 📤 Output Format

- A 16–32 character symbolic code string.
- Optional attached metadata:
  ```json
  {
    "code": "QRTLLMNZWWXXP",
    "mood": "tense",
    "complexity": 0.7
  }
  ```

---

## 🛠️ Status

- ✅ Stable perceptual mapping logic
- ☐ Needs tuning on cultural variation
- ☐ Integrate decoder compatibility metadata

---

## 📌 Notes

- This encoder is **not about fidelity** — it's about **meaning**.

---

## 📄 License

MIT — see root LICENSE
