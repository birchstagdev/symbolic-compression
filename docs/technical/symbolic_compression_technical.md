# 🧠 Perceptual Compression Pipeline: Engineering Specification

---

## 🧮 1. Scene Complexity Estimation

To dynamically allocate encoding depth:

Let  
- `E_d` = Edge density score  
- `O_c` = Object count  
- `C_v` = Color variance  
- `W ∈ ℝ` = Weighted complexity score

Then:

    W = α₁·E_d + α₂·O_c + α₃·C_v

Where `α₁, α₂, α₃` are context-dependent scalars.

Encoding length `L ∈ {12, 16, 26, 32}` is selected by thresholding `W`.

---

## 🔄 2. Adaptive Symbol Allocation (Encoder Core)

Each character in the perceptual code represents a **symbolic feature vector**, drawn from:

    Σ = {A-Z}
    Σ′ = Σ ∪ {#, *, ?, 0-9}

Each position `pᵢ` in the code:

    pᵢ = f(Vᵢ, Sᵢ, Mᵢ)

Where:  
- `Vᵢ`: Visual saliency at region `i`  
- `Sᵢ`: Spatial quadrant tag  
- `Mᵢ`: Mood/affective weighting  
- `f`: Symbol mapping function

---

## ⏱ 3. Temporal Contextualization (Video Mode)

To improve encoding consistency across frames:

### Frame Delta Representation

For frame `F_t`, compute:

    Δ_t = F_t - F_{t-1}

Encode:
- `K_t`: Keyframe → full symbolic encoding  
- `D_t`: Delta frame → compact 8–12 character update  
- `M_t`: Motion vector →  
    [CameraCode | Object1 | Object2 | Object3]

Camera codes `C ∈ {00–09}`  
Object tracking uses relative velocity vectors discretized into 2-character bins.

---

## 🔍 4. Cultural & Personal Vocabulary Adaptation

Each user has a dictionary `D_u`:

    D_u = D_base ∪ D_personal ∪ D_cultural

Encoder selects tokens from `D_u` by emotional salience and familiarity.

Learning function:

    D_u′ = 𝓛(D_u, I_accepted, I_rejected)

---

## 📐 5. Multi-Scale Hierarchical Encoding

Three perceptual layers:
1. Global `G` – 26 chars  
2. Intermediate `I` – 13 chars  
3. Fine `F` – 13 chars  

Combined encoding:

    C = G ⊕ I ⊕ F

---

## 📊 6. Decoder Symbol Expansion

Given symbolic code `S ∈ Σ^L`:

    Scene_Model = 𝓓(S) = {O, M, Q, T}

Where:  
- `O`: Objects  
- `M`: Mood  
- `Q`: Focus quadrant  
- `T`: Temporal echoes

Decoder uses:
- Symbol-to-concept maps  
- Mood-spatial graph builder  
- Optional randomness for NPC/“dreamlike” mode

---

## ⚠️ 7. Disambiguation System

Multiple interpretations `Sᵢ`:

    score(Sᵢ) = sim(Sᵢ, C_s)

Use context stack `C_s` and scoring function to resolve conflicts.

---

## 🔁 8. Versioned Encoding Format

Format:

    Code = V_v ⊕ S_d

Where:
- `V_v`: Version tag (2 chars)  
- `S_d`: Scene symbol stream

Version registry ensures backward compatibility.

---

## 📉 9. Compression Metrics

Estimates:

- ~2.6KB per minute  
- ~90MB/min raw video (720p)  
- Ratio:

    CR ≈ 90MB / 2.6KB ≈ 34,615:1

Semantic density > visual fidelity

---

## ✅ Summary

This pipeline enables:

- Ultra-low-bandwidth memory replay  
- NPC perception with emotional weight  
- Symbolic scene logging  
- Shared understanding of visually perceived environments

Meaning first. Pixels later.
