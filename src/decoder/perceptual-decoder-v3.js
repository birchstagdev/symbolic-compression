// perceptual_alchemy_decoder_v3.js
// =====================================================
// PERCEPTUAL ALCHEMY: SYMBOLIC MEMORY DECODER
// =====================================================
// This decoder transforms symbolic perceptual strings back
// into lived experience—not as pixels, but as emotional
// topology, spatial memory, and narrative possibility.
// It reconstructs how moments felt, creating dreamlike
// or stable interpretations based on context and memory.
// =====================================================

class PerceptualAlchemyDecoder {   
        /* ---------- QUANTISATION HELPERS ---------- */

    /** Reverse of encoder.quantizeToSymbol(A-Z → 0-1) */
    decodeQuantizedValue(ch) {
        const idx = ch.toUpperCase().charCodeAt(0) - 65;
        return Math.max(0, Math.min(25, idx)) / 25;
    }

    /** Blend two scalar values with weight w (0-1) */
    lerp(a, b, w = 0.5) { return a * (1 - w) + b * w; }

    constructor(options = {}) {
        this.mode = options.mode || 'stable'; // stable | dreamlike | npc
        this.culture = options.culture || 'universal';
        this.memoryBuffer = options.memoryBuffer || [];
        this.personalBias = options.bias || {};
        
        // Load cultural interpretation matrix
        this.culturalLens = this.loadCulturalLens(this.culture);
        
            // ---- in constructor (after loadCulturalLens):
        if (this.culture.includes('+')) {
            const [c1, c2] = this.culture.split('+');
            const L1 = this.loadCulturalLens(c1), L2 = this.loadCulturalLens(c2);
            this.culturalLens = this.blendLenses(L1, L2, 0.5);
        }
        // Symbol interpretation system
        this.symbolInterpreter = new SymbolInterpreter(this.culturalLens);
        
        // Memory echo system
        this.memoryResonance = new MemoryResonance(this.memoryBuffer);
        
        // Narrative generator
        this.narrativeEngine = new NarrativeEngine(this.culture);
        
        // Decoding confidence threshold
        this.confidenceThreshold = 0.6;
        
        // Dream logic parameters
        this.dreamParams = {
            stability: this.mode === 'stable' ? 0.9 : 0.5,
            associativity: this.mode === 'dreamlike' ? 0.8 : 0.3,
            emotionalBleed: this.mode === 'npc' ? 0.7 : 0.4
        };
    }

    

        /* ---------- FOCAL-POINT CALCULATION ---------- */
    calculateFocalPoints(exp) {
        // Weight objects by importance & emotional weight
        const pts = exp.objects.map(o => ({
            x: o.position.x, y: o.position.y,
            w: (o.importance || 0.5) * (o.emotionalWeight || 1)
        }));

        if (pts.length === 0) return [{ x: 0.5, y: 0.5, strength: 0 }];

        // Centre-of-mass focal point
        const totalW = pts.reduce((s, p) => s + p.w, 0);
        const cx     = pts.reduce((s, p) => s + p.x * p.w, 0) / totalW;
        const cy     = pts.reduce((s, p) => s + p.y * p.w, 0) / totalW;

        // Return primary + 2 secondary
        pts.sort((a, b) => b.w - a.w);
        return [
            { x: cx, y: cy, strength: 1 },
            ...pts.slice(0, 2).map(p => ({ x: p.x, y: p.y, strength: p.w / totalW }))
        ];
    }

    /* ---------- MOOD-PALETTE EXTRACTOR ---------- */
    /**
     * Map Russell-style valence / arousal to a perceptual colour theme
     * @param {Object} emotional  – decoder.emotional or { valence, arousal }
     * @returns {Object}          – { h, s, b, css, adjective }
     */
    extractMoodPalette(emotional) {
        // Accept either decoder.emotional.current or a flat object
        const V = emotional.valence  ?? emotional.current?.valence  ?? 0.5; // 0-1
        const A = emotional.arousal  ?? emotional.current?.arousal  ?? 0.5; // 0-1

        /* ---- 1.   Hue  (°)  -------------------------------------------------
        Low-arousal negative → cold blue.
        High-arousal positive → hot red/orange.
        Everything in between arcs smoothly through the colour wheel. */
        const hue = (360 * (
            0.75                     // anchor “sad/calm” at 270° ≈ blue-purple
            + V * 0.25               // positive shift → clockwise to red
            - A * 0.25               // arousal shifts hue toward hotter end
        )) % 360;                    // keep in 0-360

        /* ---- 2. Saturation & Brightness ------------------------------------ */
        const sat = 40 + A * 40;      // calmer scenes → pastel, intense → vivid
        const bri = 40 + V * 40;      // negative → dim, positive → bright

        /* ---- 3. Simple semantic adjective (optional) ----------------------- */
        const adjective =
            V > 0.66 ? (A > 0.66 ? 'vibrant'  : 'serene')
            : V < 0.33 ? (A > 0.66 ? 'anxious'  : 'somber')
            :              (A > 0.66 ? 'restless' : 'neutral');

        return {
            h : Math.round(hue),        // 0-360
            s : Math.round(sat),        // 0-100
            b : Math.round(bri),        // 0-100
            css : `hsl(${hue}deg ${sat}% ${bri}%)`,
            adjective                    // handy for text descriptions
        };
    }
    // === PUBLIC API =========================================================
    
    /**
     * Decodes a perceptual string into multi-layered experience
     * @param {string} code - 16-32 character perceptual code
     * @param {Object} context - Additional context (time, location, etc.)
     * @returns {Object} Reconstructed perceptual experience
     */
    decode(code, context = {}) {
        const startTime = performance.now();
        
        // 1. VALIDATION & ERROR CORRECTION
        const validated = this.validateAndCorrect(code);
        if (!validated.valid) {
            return this.handleInvalidCode(validated);
        }
        
        // 2. SYMBOL SEGMENTATION
        const segments = this.segmentCode(validated.code);
        
        // 3. CORE RECONSTRUCTION
        const scene = this.reconstructScene(segments.scene);
        const objects = this.reconstructObjects(segments.objects);
        const spatial = this.reconstructSpatial(segments.spatial);
        const emotion = this.reconstructEmotion(segments.emotion);
        
        // 4. MEMORY INTEGRATION
        const memories = this.memoryResonance.findEchoes(validated.code, emotion);
        
        // 5. CULTURAL INTERPRETATION
        const interpreted = this.applyInterpretation(scene, objects, spatial, emotion);
        
        // 6. NARRATIVE GENERATION
        const narrative = this.narrativeEngine.generate(interpreted, memories);
        
        // 7. DREAM LOGIC APPLICATION
        const experience = this.applyDreamLogic(interpreted, memories);
        
        // 8. CONFIDENCE CALCULATION
        const confidence = this.calculateReconstructionConfidence(segments);
        
        // 9. ENTROPY DIAGNOSTICS  (place this before the return)
        const entropy = this.estimateSymbolEntropy(validated.code);   // or codeStr

        // 10. OPTIONAL PALETTE CALCS  (only if you actually need them)
        const mood  = this.extractMoodPalette(experience);
        const paint = this.extractColorPalette(experience);

        // -- RETURN ---------------------------------------------------
        return {
            experience: {                          // full perceptual state
                scene     : experience.scene,
                objects   : experience.objects,
                spatial   : experience.spatial,
                emotional : experience.emotional,
                temporal  : experience.temporal
            },

            narrative,                              // { primary, variations, poetic }

            memory: {
                echoes     : memories,
                resonance  : this.calculateMemoryResonance(memories),
                decay      : this.estimateMemoryDecay(context.timestamp)
            },

            rendering: {
                hints  : this.generateRenderingHints(experience),
                focus  : this.calculateFocalPoints(experience),
                palettes : { mood, paint }          // <- optional
            },

            metrics: {                              // NEW, no clash
                entropyBitsPerSymbol : entropy.bitsPerSymbol,
                totalBits            : entropy.totalBits,
                length               : validated.code.length
            },

            metadata: {
                confidence,
                isReliable      : confidence >= this.confidenceThreshold,
                mode            : this.mode,
                culture         : this.culture,
                processingTime  : performance.now() - startTime
            }
        };

        
    }
    
    // === VALIDATION & ERROR CORRECTION ======================================
    
    validateAndCorrect(code) {
        // Remove any whitespace
        code = code.trim();
        
        // Check basic format
        if (!/^[A-Za-z0-9αβγδ]{16,33}$/.test(code)) {
            return { valid: false, error: 'Invalid character set' };
        }
        
        // Extract and verify checksum
        const checksum = code[code.length - 1];
        const payload = code.slice(0, -1);
        
        if (this.verifyChecksum(payload, checksum)) {
            return { valid: true, code: payload };
        }
        
        // Attempt error correction
        const corrected = this.attemptErrorCorrection(payload);
        if (corrected) {
            return { valid: true, code: corrected, corrected: true };
        }
        
        return { valid: false, error: 'Checksum validation failed' };
    }
    
    verifyChecksum(payload, checksum) {
        let sum = 0;
        for (let i = 0; i < payload.length; i++) {
            sum += payload.charCodeAt(i) * (i + 1);
        }
        return String.fromCharCode(65 + (sum % 26)) === checksum;
    }
    
    attemptErrorCorrection(code) {
        // Simple error correction - in production would use Reed-Solomon
        // For now, try common character substitutions
        const commonErrors = {
            '0': 'O', 'O': '0',
            '1': 'I', 'I': '1',
            '5': 'S', 'S': '5'
        };
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if (commonErrors[char]) {
                const corrected = code.slice(0, i) + commonErrors[char] + code.slice(i + 1);
                if (this.verifyChecksum(corrected, this.calculateChecksum(corrected))) {
                    return corrected;
                }
            }
        }
        
        return null;
    }
    
    // === SYMBOL SEGMENTATION ================================================
    
    segmentCode(code) {
        const length = code.length;
        
        // Adaptive segmentation based on code length
        if (length <= 16) {
            // Mobile mode
            return {
                scene: code.slice(0, 3),
                objects: code.slice(3, 9),
                spatial: code.slice(9, 13),
                emotion: code.slice(13, 16)
            };
        } else if (length <= 26) {
            // Balanced mode
            return {
                scene: code.slice(0, 4),
                objects: code.slice(4, 16),
                spatial: code.slice(16, 22),
                emotion: code.slice(22, 26)
            };
        } else {
            // Rich mode
            return {
                scene: code.slice(0, 4),
                objects: code.slice(4, 18),
                spatial: code.slice(18, 26),
                emotion: code.slice(26, 32)
            };
        }
    }
    
    // === CORE RECONSTRUCTION ================================================
    
    reconstructScene(sceneCode) {
        const sceneType = this.symbolInterpreter.decodeSceneType(sceneCode[0]);
        const lighting = this.symbolInterpreter.decodeLighting(sceneCode[1]);
        const mood = sceneCode[2] ? this.symbolInterpreter.decodeMood(sceneCode[2]) : 'neutral';
        const complexity = sceneCode[3] ? this.symbolInterpreter.decodeComplexity(sceneCode[3]) : 'medium';
        
        // Apply cultural interpretation
        const culturalScene = this.culturalLens.interpretScene(sceneType);
        
        return {
            type: culturalScene.type,
            subtype: culturalScene.subtype,
            lighting: {
                quality: lighting.quality,
                direction: lighting.direction,
                intensity: lighting.intensity,
                color: lighting.colorTemp
            },
            mood: {
                primary: mood,
                undertones: this.generateMoodUndertones(mood, lighting)
            },
            complexity,
            atmosphere: this.synthesizeAtmosphere(culturalScene, lighting, mood)
        };
    }
    
    reconstructObjects(objectCode) {
        const objects = [];
        const objectSize = this.mode === 'mobile' ? 2 : 3;
        
        for (let i = 0; i < objectCode.length; i += objectSize) {
            const objSegment = objectCode.slice(i, i + objectSize);
            if (objSegment === '00' || objSegment === '000') continue;
            
            const decoded = this.decodeObject(objSegment);
            if (decoded) {
                // Apply memory associations
                decoded.memories = this.memoryResonance.findObjectMemories(decoded.type);
                
                // Apply emotional coloring
                decoded.emotionalWeight = this.calculateEmotionalWeight(decoded);
                
                objects.push(decoded);
            }
        }
        
        // Sort by perceptual importance
        objects.sort((a, b) => b.importance - a.importance);
        
        return objects;
    }

        /* ---------- POSITION DECODER ---------- */
    decodePosition(symbols) {
        const grid = '123456789';                         // encoder table :contentReference[oaicite:1]{index=1}

        // ── 1-char, coarse (3×3) ──────────────────────
        if (symbols.length === 1 && grid.includes(symbols[0])) {
            const i  = grid.indexOf(symbols[0]);
            const gx = i % 3, gy = Math.floor(i / 3);

            // centre of the cell ( ≈ encoder’s +0.5 offset )
            return { x: (gx + 0.5) / 3, y: (gy + 0.5) / 3 };
        }

        // ── 2-char, high-precision (A-Z × A-Z) ─────────
        if (symbols.length === 2) {
            return {
                x: this.decodeQuantizedValue(symbols[0]),
                y: this.decodeQuantizedValue(symbols[1])
            };
        }

        // Fallback – centre of frame
        return { x: 0.5, y: 0.5 };
    }

        /* ---------- DEPTH-LAYER DECODER ---------- */
    decodeDepthLayers(code = '') {
        if (!code) {
            return { distribution: 'flat', foregroundWeight: 0.33 };
        }

        const distMap = {           // encoder used DynamicVocabulary depth “!@#$%” :contentReference[oaicite:2]{index=2}
            '!': 'forward',   '@': 'distant',
            '#': 'balanced',  '$': 'centered',
            '%': 'flat'
        };

        const distribution      = distMap[code[0]] || 'balanced';
        const foregroundWeight  = code[1] ? this.decodeQuantizedValue(code[1]) : 0.33;

        // Derive simple foreground/mid/background split for narrative & maths
        return {
            distribution,
            foregroundWeight,
            layers: {
                foreground : foregroundWeight,
                midground  : this.lerp(0.2, 0.4, 1 - Math.abs(0.5 - foregroundWeight) * 2),
                background : 1 - foregroundWeight
            }
        };
    }

    
    decodeObject(segment) {
        const type = this.symbolInterpreter.decodeObjectType(segment[0]);
        if (!type) return null;
        
        const position = segment[1] ? this.decodePosition(segment[1]) : { x: 0.5, y: 0.5 };
        const size = segment[2] ? this.symbolInterpreter.decodeSize(segment[2]) : 'medium';
        
        // Calculate perceptual importance
        const importance = this.calculateObjectImportance(type, position, size);
        
        // Generate archetypal associations
        const archetypes = this.narrativeEngine.getArchetypes(type);
        
        return {
            type: type.primary,
            variants: type.variants,
            position,
            size,
            importance,
            archetypes,
            culturalSignificance: this.culturalLens.getObjectSignificance(type.primary)
        };
    }
    
    reconstructSpatial(spatialCode) {
        const focus = this.symbolInterpreter.decodeFocus(spatialCode[0]);
        const distribution = this.symbolInterpreter.decodeDistribution(spatialCode[1]);
        const depthLayers = this.decodeDepthLayers(spatialCode.slice(2));
        
        // Generate spatial narrative
        const spatialNarrative = this.generateSpatialNarrative(focus, distribution, depthLayers);
        
        return {
            focus: {
                primary: focus.zone,
                strength: focus.intensity,
                type: focus.type
            },
            distribution: {
                pattern: distribution.pattern,
                balance: distribution.balance,
                tension: distribution.tension
            },
            depth: {
                layers: depthLayers,
                perspective: this.calculatePerspective(depthLayers),
                atmosphere: this.calculateAtmosphericPerspective(depthLayers)
            },
            narrative: spatialNarrative,
            flow: this.calculateVisualFlow(focus, distribution)
        };
    }
    
    reconstructEmotion(emotionCode) {
        if (!emotionCode || emotionCode.length < 2) {
            return this.defaultEmotion();
        }
        
        const valence = this.decodeEmotionalValue(emotionCode[0]);
        const arousal = this.decodeEmotionalValue(emotionCode[1]);
        const trajectory = emotionCode[2] ? this.symbolInterpreter.decodeTrajectory(emotionCode[2]) : 'stable';
        const resonance = emotionCode[3] ? this.decodeEmotionalValue(emotionCode[3]) : 0.5;
        
        // Calculate emotional color
        const emotionalColor = this.mapEmotionToColor(valence, arousal);
        
        // Generate emotional narrative
        const emotionalNarrative = this.narrativeEngine.describeEmotion(valence, arousal, trajectory);
        
        return {
            current: {
                valence,
                arousal,
                dominance: (valence + arousal) / 2, // Simplified
                label: this.labelEmotion(valence, arousal)
            },
            trajectory: {
                direction: trajectory,
                momentum: this.calculateEmotionalMomentum(trajectory),
                prediction: this.predictEmotionalFuture(valence, arousal, trajectory)
            },
            resonance: {
                strength: resonance,
                harmonics: this.calculateEmotionalHarmonics(resonance),
                memories: this.memoryResonance.findEmotionalMemories(valence, arousal)
            },
            color: emotionalColor,
            texture: this.generateEmotionalTexture(valence, arousal, resonance),
            narrative: emotionalNarrative
        };
    }
    
    // === MEMORY INTEGRATION =================================================
    
    applyMemoryEchoes(current, memories) {
        if (memories.length === 0) return current;
        
        // Blend current perception with memory echoes
        const blended = JSON.parse(JSON.stringify(current));
        
        // Memory bleeding effect
        memories.forEach(memory => {
            const strength = memory.resonance * this.dreamParams.emotionalBleed;
            
            // Blend objects
            if (memory.objects) {
                memory.objects.forEach(memObj => {
                    const exists = blended.objects.find(obj => obj.type === memObj.type);
                    if (!exists && Math.random() < strength) {
                        blended.objects.push({
                            ...memObj,
                            fromMemory: true,
                            opacity: strength
                        });
                    }
                });
            }
            
            // Blend emotions
            if (memory.emotion) {
                blended.emotional.current.valence = 
                    blended.emotional.current.valence * (1 - strength) + 
                    memory.emotion.valence * strength;
            }
        });
        
        return blended;
    }
    
        /* ---------- TEMPORAL-FRAGMENT GENERATOR ---------- */
    generateTemporalFragments(memories, stability = 0.7) {
        if (!memories || memories.length === 0) return [];

        return memories.slice(0, 5).map(mem => {
            const jitter   = (1 - stability) * 0.15;
            const duration = this.lerp(3, 12, mem.resonance) * (1 + (Math.random() - 0.5) * jitter);

            return {
                snapshotCode : mem.memory.code,
                recalledAt   : Date.now(),
                durationSec  : duration,
                faded        : mem.age > 60 * 60 * 24 // older than a day
            };
        });
    }

        /* ---------- ENTROPY ESTIMATOR ---------- */
    estimateSymbolEntropy(codeStr) {
        const catBits = ch =>
            /[A-Z]/.test(ch)      ? 5 :
            /[a-z]/.test(ch)      ? 5 :
            /[0-9]/.test(ch)      ? 4 :
            /[!@#$%]/.test(ch)    ? 3 :
            /[α-δ]/.test(ch)      ? 4 : 6;  // unicode / fallback

        const totalBits = [...codeStr].reduce((s, c) => s + catBits(c), 0);
        return {
            bitsPerSymbol : totalBits / codeStr.length,
            totalBits
        };
    }
    // === DREAM LOGIC ========================================================
    
    applyDreamLogic(interpreted, memories) {
        const stability = this.dreamParams.stability;
        
        // In stable mode, minimal modification
        if (this.mode === 'stable') {
            return {
                ...interpreted,
                temporal: { mode: 'stable', coherence: 1.0 }
            };
        }
        
        // Apply dream transformations
        const dreamscape = JSON.parse(JSON.stringify(interpreted));
        
        // Object morphing
        dreamscape.objects = dreamscape.objects.map(obj => {
            if (Math.random() > stability) {
                // Object transforms based on emotional resonance
                const morphTarget = this.findEmotionallyResonantForm(obj, interpreted.emotional);
                return {
                    ...obj,
                    morphing: true,
                    morphTarget,
                    morphStrength: 1 - stability
                };
            }
            return obj;
        });
        
        // Spatial warping
        if (Math.random() > stability) {
            dreamscape.spatial.warping = {
                type: this.selectWarpingType(interpreted.emotional),
                strength: (1 - stability) * this.dreamParams.associativity,
                epicenter: dreamscape.spatial.focus.primary
            };
        }
        
        // Temporal fragmentation
        dreamscape.temporal = {
            mode: this.mode,
            coherence: stability,
            fragments: this.generateTemporalFragments(memories, stability),
            loops: Math.random() > stability ? this.detectMemoryLoops(memories) : []
        };
        
        // Emotional bleeding between objects
        if (this.dreamParams.emotionalBleed > 0.5) {
            dreamscape.objects = this.applyEmotionalContagion(dreamscape.objects, dreamscape.emotional);
        }
        
        return dreamscape;
    }

        /* ---------- COLOR-PALETTE EXTRACTOR ---------- */
    extractColorPalette(exp) {
        // Cultural semantics first
        const meanings = this.culturalLens.colorMeanings || {};
        const base     = Object.keys(meanings);

        // Emotionally shift palette toward valence/arousal
        const v = exp.emotional.current.valence;
        const a = exp.emotional.current.arousal;

        // Simple rule-based tint
        const moodTint = v > 0.6 ? (a > 0.6 ? 'warm' : 'pastel')
                    : v < 0.4 ? (a > 0.6 ? 'neon' : 'cool')
                    : 'neutral';

        return {
            keyColors : base.slice(0, 3),
            accent    : moodTint,
            semantics : base.reduce((out, c) => { out[c] = meanings[c]; return out; }, {})
        };
    }

    
    // === NARRATIVE GENERATION ===============================================
    
    generateNarrative(experience, memories) {
        return this.narrativeEngine.generate(experience, memories);
    }
    
    // === RENDERING HINTS ====================================================
    
    generateRenderingHints(experience) {
        return {
            lighting: {
                key: experience.scene.lighting,
                fill: this.calculateFillLight(experience.scene.lighting),
                rim: experience.emotional.current.arousal > 0.7 ? 'strong' : 'subtle'
            },
            color: {
                palette: this.extractColorPalette(experience),
                temperature: experience.scene.atmosphere.temperature,
                saturation: experience.emotional.resonance.strength
            },
            composition: {
                rule: this.determineCompositionRule(experience.spatial),
                dynamicRange: experience.scene.complexity === 'high' ? 'wide' : 'narrow',
                focusGradient: this.calculateFocusGradient(experience.spatial.focus)
            },
            effects: {
                blur: experience.temporal.coherence < 0.7 ? 'dreamlike' : 'minimal',
                grain: experience.memory.decay > 0.5 ? 'nostalgic' : 'clean',
                vignette: experience.emotional.current.valence < 0.3 ? 'heavy' : 'light'
            },
            animation: {
                suggested: this.suggestAnimations(experience),
                timing: this.calculateAnimationTiming(experience.emotional)
            }
        };
    }
    
    // === UTILITY METHODS ====================================================
    
    loadCulturalLens(culture) {
        // Cultural interpretation matrices
        const lenses = {
            universal: {
                interpretScene: (type) => ({ type, subtype: 'general' }),
                getObjectSignificance: (obj) => 1.0,
                colorMeanings: {
                    warm: 'comfort',
                    cool: 'distance',
                    saturated: 'intensity',
                    muted: 'memory'
                }
            },
            japanese: {
                interpretScene: (type) => {
                    const mappings = {
                        indoor: { type: 'interior', subtype: 'wa' },
                        outdoor: { type: 'nature', subtype: 'mono-no-aware' }
                    };
                    return mappings[type] || { type, subtype: 'general' };
                },
                getObjectSignificance: (obj) => {
                    const significance = {
                        'tree': 1.5,
                        'water': 1.3,
                        'stone': 1.2
                    };
                    return significance[obj] || 1.0;
                },
                colorMeanings: {
                    white: 'death',
                    red: 'life',
                    indigo: 'tradition'
                }
            },
            norse: {
                interpretScene: (type) => {
                    const mappings = {
                        outdoor: { type: 'landscape', subtype: 'mythic' },
                        architectural: { type: 'hall', subtype: 'sacred' }
                    };
                    return mappings[type] || { type, subtype: 'general' };
                },
                getObjectSignificance: (obj) => {
                    const significance = {
                        'tree': 2.0, // Yggdrasil
                        'wolf': 1.8,
                        'raven': 1.7
                    };
                    return significance[obj] || 1.0;
                },
                colorMeanings: {
                    gold: 'glory',
                    red: 'battle',
                    blue: 'wisdom'
                }
            }
            
        };
        
        return lenses[culture] || lenses.universal;
    }

    blendLenses(primary, secondary, weight = 0.5) {
        const lerpObj = (a, b) => {
            const out = { ...a };
            Object.entries(b).forEach(([k, v]) => {
                out[k] = a[k] ? this.lerp(a[k], v, weight) : v;
            });
            return out;
        };
    
        return {
            interpretScene      : (t) => lerpObj(primary.interpretScene(t), secondary.interpretScene(t)),
            getObjectSignificance : (o) => this.lerp(
                primary.getObjectSignificance(o),
                secondary.getObjectSignificance(o),
                weight
            ),
            colorMeanings : { ...primary.colorMeanings, ...secondary.colorMeanings }
        };
    }
    
   
    
    
    handleInvalidCode(validated) {
        return {
            error: validated.error,
            fallback: {
                experience: this.generateFallbackExperience(),
                narrative: {
                    primary: "A memory too faded to fully recall...",
                    variations: ["Fragments of something once seen..."],
                    poetic: "Like trying to hold water in cupped hands"
                }
            },
            metadata: {
                confidence: 0,
                mode: this.mode,
                culture: this.culture
            }
        };
    }
    
    defaultEmotion() {
        return {
            current: {
                valence: 0.5,
                arousal: 0.5,
                dominance: 0.5,
                label: 'neutral'
            },
            trajectory: {
                direction: 'stable',
                momentum: 0,
                prediction: 'continued-neutral'
            },
            resonance: {
                strength: 0.3,
                harmonics: [],
                memories: []
            }
        };
    }
    
    calculateChecksum(code) {
        let sum = 0;
        for (let i = 0; i < code.length; i++) {
            sum += code.charCodeAt(i) * (i + 1);
        }
        return String.fromCharCode(65 + (sum % 26));
    }
    
    decodeEmotionalValue(char) {
        // Map A-Z to 0-1
        const value = (char.charCodeAt(0) - 65) / 25;
        return Math.max(0, Math.min(1, value));
    }
    
    labelEmotion(valence, arousal) {
        // Russell's circumplex model
        if (valence > 0.6 && arousal > 0.6) return 'excited';
        if (valence > 0.6 && arousal < 0.4) return 'content';
        if (valence < 0.4 && arousal > 0.6) return 'anxious';
        if (valence < 0.4 && arousal < 0.4) return 'melancholic';
        return 'neutral';
    }
}

// === SYMBOL INTERPRETER =====================================================

class SymbolInterpreter {
    constructor(culturalLens) {
        this.culturalLens = culturalLens;
        this.initializeMappings();
    }
    
    initializeMappings() {
        this.sceneMappings = {
            'A': 'outdoor', 'B': 'indoor', 'C': 'portrait',
            'D': 'architectural', 'E': 'natural', 'F': 'urban',
            'G': 'artistic', 'H': 'document', 'I': 'pattern', 'J': 'complex'
        };
        
        this.lightingMappings = {
            'K': { quality: 'natural', direction: 'overhead', intensity: 0.7, colorTemp: 'neutral' },
            'L': { quality: 'warm', direction: 'side', intensity: 0.6, colorTemp: 'golden' },
            'M': { quality: 'cool', direction: 'diffuse', intensity: 0.5, colorTemp: 'blue' },
            'N': { quality: 'dramatic', direction: 'backlit', intensity: 0.8, colorTemp: 'contrast' },
            'O': { quality: 'soft', direction: 'ambient', intensity: 0.4, colorTemp: 'neutral' },
            'P': { quality: 'harsh', direction: 'direct', intensity: 0.9, colorTemp: 'white' }
        };
        
        this.moodMappings = {
            'Q': 'peaceful', 'R': 'tense', 'S': 'melancholic',
            'T': 'joyful', 'U': 'mysterious', 'V': 'foreboding'
        };
        
        this.objectMappings = this.buildObjectMappings();
    }
    
    buildObjectMappings() {
        // Comprehensive object vocabulary
        const categories = {
            // People & creatures
            'a': { primary: 'person', variants: ['figure', 'silhouette', 'presence'] },
            'b': { primary: 'child', variants: ['youth', 'innocent'] },
            'c': { primary: 'elder', variants: ['wise-one', 'ancestor'] },
            'd': { primary: 'animal', variants: ['creature', 'beast'] },
            'e': { primary: 'bird', variants: ['flying-thing', 'messenger'] },
            
            // Nature
            'f': { primary: 'tree', variants: ['growth', 'shelter'] },
            'g': { primary: 'flower', variants: ['bloom', 'beauty'] },
            'h': { primary: 'water', variants: ['flow', 'reflection'] },
            'i': { primary: 'stone', variants: ['permanence', 'obstacle'] },
            'j': { primary: 'mountain', variants: ['ascent', 'challenge'] },
            
            // Structures
            'k': { primary: 'door', variants: ['passage', 'threshold'] },
            'l': { primary: 'window', variants: ['view', 'barrier'] },
            'm': { primary: 'bridge', variants: ['connection', 'crossing'] },
            'n': { primary: 'wall', variants: ['boundary', 'protection'] },
            'o': { primary: 'tower', variants: ['height', 'isolation'] },
            
            // Objects
            'p': { primary: 'light', variants: ['illumination', 'hope'] },
            'q': { primary: 'shadow', variants: ['darkness', 'unknown'] },
            'r': { primary: 'mirror', variants: ['reflection', 'self'] },
            's': { primary: 'key', variants: ['solution', 'access'] },
            't': { primary: 'book', variants: ['knowledge', 'story'] },
            
            // Abstract
            'u': { primary: 'spiral', variants: ['journey', 'cycle'] },
            'v': { primary: 'void', variants: ['emptiness', 'potential'] },
            'w': { primary: 'pattern', variants: ['order', 'repetition'] },
            'x': { primary: 'chaos', variants: ['disorder', 'change'] },
            'y': { primary: 'harmony', variants: ['balance', 'peace'] },
            'z': { primary: 'mystery', variants: ['unknown', 'question'] }
        };
        
        return categories;
    }
    
    decodeSceneType(char) {
        return this.sceneMappings[char] || 'unknown';
    }
    
    decodeLighting(char) {
        return this.lightingMappings[char] || this.lightingMappings['O'];
    }
    
    decodeMood(char) {
        return this.moodMappings[char] || 'neutral';
    }
    
    decodeObjectType(char) {
        return this.objectMappings[char.toLowerCase()] || null;
    }
    
    decodeFocus(char) {
        const focusMap = {
            'W': { zone: 'center', intensity: 0.9, type: 'concentrated' },
            'X': { zone: 'upper-third', intensity: 0.7, type: 'elevated' },
            'Y': { zone: 'lower-third', intensity: 0.7, type: 'grounded' },
            'Z': { zone: 'edges', intensity: 0.6, type: 'dispersed' }
        };
        return focusMap[char] || focusMap['W'];
    }
    
    decodeDistribution(char) {
        const distMap = {
            '0': { pattern: 'balanced', balance: 0.9, tension: 0.1 },
            '1': { pattern: 'asymmetric', balance: 0.4, tension: 0.6 },
            '2': { pattern: 'radial', balance: 0.7, tension: 0.3 },
            '3': { pattern: 'diagonal', balance: 0.5, tension: 0.5 },
            '4': { pattern: 'clustered', balance: 0.3, tension: 0.7 }
        };
        return distMap[char] || distMap['0'];
    }
}

// === MEMORY RESONANCE SYSTEM ================================================

class MemoryResonance {
    constructor(memoryBuffer) {
        this.memories = memoryBuffer;
        this.resonanceThreshold = 0.3;
    }
    
    findEchoes(currentCode, currentEmotion) {
        const echoes = [];
        
        this.memories.forEach(memory => {
            const similarity = this.calculateSimilarity(currentCode, memory.code);
            const emotionalResonance = this.calculateEmotionalResonance(currentEmotion, memory.emotion);
            
            if (similarity > this.resonanceThreshold || emotionalResonance > 0.6) {
                echoes.push({
                    memory,
                    similarity,
                    resonance: emotionalResonance,
                    age: this.calculateMemoryAge(memory.timestamp),
                    strength: this.calculateMemoryStrength(similarity, emotionalResonance, memory.timestamp)
                });
            }
        });
        
        return echoes.sort((a, b) => b.strength - a.strength).slice(0, 5);
    }
    
    calculateSimilarity(code1, code2) {
        if (!code1 || !code2) return 0;
        
        let matches = 0;
        const len = Math.min(code1.length, code2.length);
        
        // Weighted similarity - early characters more important
        for (let i = 0; i < len; i++) {
            if (code1[i] === code2[i]) {
                matches += (len - i) / len; // Weight by position
            }
        }
        
        return matches / len;
    }
    
    calculateEmotionalResonance(current, memory) {
        if (!current || !memory) return 0;
        
        const valenceDiff = Math.abs(current.current.valence - memory.valence);
        const arousalDiff = Math.abs(current.current.arousal - memory.arousal);
        
        return 1 - (valenceDiff + arousalDiff) / 2;
    }
    
    calculateMemoryAge(timestamp) {
        const now = Date.now();
        const age = now - timestamp;
        const days = age / (1000 * 60 * 60 * 24);
        return days;
    }
    
    calculateMemoryStrength(similarity, resonance, timestamp) {
        const age = this.calculateMemoryAge(timestamp);
        const decay = Math.exp(-age / 30); // 30-day half-life
        
        return (similarity * 0.4 + resonance * 0.6) * decay;
    }
}

// === NARRATIVE ENGINE =======================================================

class NarrativeEngine {
    constructor(culture) {
        this.culture = culture;
        this.archetypes = this.loadArchetypes();
        this.narrativePatterns = this.loadNarrativePatterns();
    }
    
    generate(experience, memories) {
        const elements = this.extractNarrativeElements(experience);
        const context = this.buildNarrativeContext(elements, memories);
        
        return {
            primary: this.generatePrimaryNarrative(context),
            variations: this.generateVariations(context),
            poetic: this.generatePoeticNarrative(context),
            archetypal: this.identifyArchetypalPattern(context)
        };
    }
    
    generatePrimaryNarrative(context) {
        const { scene, objects, emotion, spatial } = context;
        
        let narrative = `${this.describeScene(scene)} `;
        
        if (objects.length > 0) {
            narrative += `${this.describeObjects(objects)} `;
        }
        
        narrative += `${this.describeSpatialRelations(spatial)} `;
        narrative += `${this.describeEmotionalTone(emotion)}`;
        
        return narrative;
    }
    
    generatePoeticNarrative(context) {
        const imagery = this.selectPoetryImagery(context);
        const rhythm = this.determineRhythm(context.emotion);
        
        return this.composePoetic(imagery, rhythm);
    }
    
    describeScene(scene) {
        const templates = {
            outdoor: [
                "The world opens wide",
                "Under an endless sky",
                "Where horizons call"
            ],
            indoor: [
                "Within sheltering walls",
                "In the quiet interior",
                "Enclosed in familiar space"
            ],
            natural: [
                "Among the living earth",
                "Where nature breathes",
                "In the wild's embrace"
            ]
        };
        
        const sceneTemplates = templates[scene.type] || ["In a space undefined"];
        const template = sceneTemplates[Math.floor(Math.random() * sceneTemplates.length)];
        
        const lightingDesc = this.describeLighting(scene.lighting);
        
        return `${template}, ${lightingDesc}`;
    }
    
    describeLighting(lighting) {
        const descriptions = {
            natural: "bathed in honest light",
            warm: "glowing with golden warmth",
            cool: "washed in ethereal blue",
            dramatic: "carved by shadows and brilliance",
            soft: "caressed by gentle illumination",
            harsh: "exposed in unforgiving clarity"
        };
        
        return descriptions[lighting.quality] || "lit by mysterious sources";
    }
    
    loadArchetypes() {
        return {
            journey: ['spiral', 'path', 'door', 'bridge'],
            transformation: ['butterfly', 'fire', 'water', 'mirror'],
            conflict: ['shadow', 'wall', 'storm', 'divide'],
            sanctuary: ['tree', 'circle', 'light', 'embrace'],
            mystery: ['fog', 'veil', 'depth', 'question']
        };
    }
    
    loadNarrativePatterns() {
        return {
            rising: "Growing from {origin} toward {destination}",
            falling: "Descending from {height} into {depth}",
            circular: "Returning always to {center}",
            expanding: "Radiating outward from {source}",
            contracting: "Drawing inward to {focus}"
        };
    }
}

// === EXPORT =================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerceptualAlchemyDecoder;
} else if (typeof window !== 'undefined') {
    window.PerceptualAlchemyDecoder = PerceptualAlchemyDecoder;
}