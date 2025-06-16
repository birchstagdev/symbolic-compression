// perceptual_alchemy_encoder_v3.js
// =====================================================
// PERCEPTUAL ALCHEMY: SYMBOLIC VISUAL ENCODER
// =====================================================
// This encoder transforms visual scenes into symbolic strings
// that preserve not pixels, but the emotional and perceptual
// essence of what was experienced. It adapts to cultural
// contexts, tracks emotional trajectories, and creates a
// compressed language of feeling and memory.
// =====================================================

class PerceptualAlchemyEncoder {
    constructor(options = {}) {
        this.mode = options.mode || 'balanced'; // mobile | balanced | rich
        this.culture = options.culture || 'universal';
        this.emotionalContext = options.emotionalContext || null;
        
        // Dynamic vocabulary system
        this.vocabulary = new DynamicVocabulary();
        
        // Cultural grammar loader
        this.culturalGrammar = this.loadCulturalGrammar(this.culture);
        
        // Emotional trajectory buffer
        this.emotionalBuffer = [];
        
        // Perceptual constants
        this.EDGE_THRESHOLD = this.mode === 'mobile' ? 100 : 64;
        this.SAMPLE_RATE = this.mode === 'mobile' ? 8 : 4;
        
        // Symbol allocation budgets
        this.budgets = {
            mobile: { total: 16, scene: 3, objects: 6, spatial: 4, emotion: 3 },
            balanced: { total: 26, scene: 4, objects: 12, spatial: 6, emotion: 4 },
            rich: { total: 32, scene: 4, objects: 14, spatial: 8, emotion: 6 }
        };
    }
    
    // === PUBLIC API =========================================================
    
    /**
     * Encodes an image into a symbolic perceptual string
     * @param {ImageData} imageData - Raw image data
     * @param {Object} context - Optional emotional/narrative context
     * @returns {Object} { code, analysis, confidence }
     */
    encode(imageData, context = {}) {
        const startTime = performance.now();
        
        // Validate input
        this.validateInput(imageData);
        
        // 1. PERCEPTUAL ANALYSIS
        const perception = this.analyzePerception(imageData);
        
        // 2. EMOTIONAL ANALYSIS
        const emotion = this.analyzeEmotion(perception, context);
        
        // 3. CULTURAL TRANSFORMATION
        const culturalPerception = this.applyCulturalLens(perception, emotion);
        
        // 4. SYMBOLIC ENCODING
        const code = this.encodeToSymbols(culturalPerception, emotion);
        
        // 5. ERROR CORRECTION
        const finalCode = this.addErrorCorrection(code);
        
        // 6. CONFIDENCE SCORING
        const confidence = this.calculateConfidence(perception, emotion);
        
        return {
            code: finalCode,
            analysis: {
                perception,
                emotion,
                cultural: culturalPerception,
                processingTime: performance.now() - startTime
            },
            confidence
        };
    }
    
    // === PERCEPTUAL ANALYSIS ================================================
    
    analyzePerception(imageData) {
        const { width, height, data } = imageData;
        
        // Edge detection using optimized Sobel
        const edges = this.detectEdges(data, width, height);
        
        // Shape primitives using marching squares
        const shapes = this.extractShapes(edges, width, height);
        
        // Color analysis with CIEDE2000
        const colors = this.analyzeColors(data, width, height);
        
        // Spatial distribution with depth hints
        const spatial = this.analyzeSpatial(shapes, colors, width, height);
        
        // Visual saliency mapping
        const saliency = this.calculateSaliency(edges, colors, spatial);
        
        return { edges, shapes, colors, spatial, saliency };
    }
    
    detectEdges(data, width, height) {
        const edges = new Float32Array(width * height);
        const step = this.SAMPLE_RATE;
        
        // Optimized Sobel with adaptive sampling
        for (let y = 1; y < height - 1; y += step) {
            for (let x = 1; x < width - 1; x += step) {
                const idx = y * width + x;
                
                // 3x3 Sobel kernel
                const tl = this.getLuminance(data, (y-1)*width + (x-1));
                const tm = this.getLuminance(data, (y-1)*width + x);
                const tr = this.getLuminance(data, (y-1)*width + (x+1));
                const ml = this.getLuminance(data, y*width + (x-1));
                const mm = this.getLuminance(data, y*width + x);
                const mr = this.getLuminance(data, y*width + (x+1));
                const bl = this.getLuminance(data, (y+1)*width + (x-1));
                const bm = this.getLuminance(data, (y+1)*width + x);
                const br = this.getLuminance(data, (y+1)*width + (x+1));
                
                // Gradient calculation
                const gx = -tl + tr - 2*ml + 2*mr - bl + br;
                const gy = -tl - 2*tm - tr + bl + 2*bm + br;
                
                edges[idx] = Math.sqrt(gx * gx + gy * gy);
            }
        }
        
        return {
            map: edges,
            density: this.calculateEdgeDensity(edges),
            orientation: this.dominantOrientation(edges, width, height)
        };
    }
    
    extractShapes(edges, width, height) {
        // Marching squares for O(n) shape detection
        const shapes = [];
        const visited = new Uint8Array(width * height);
        
        for (let y = 0; y < height; y += this.SAMPLE_RATE * 2) {
            for (let x = 0; x < width; x += this.SAMPLE_RATE * 2) {
                const idx = y * width + x;
                
                if (edges.map[idx] > this.EDGE_THRESHOLD && !visited[idx]) {
                    const shape = this.marchingSquares(edges.map, visited, x, y, width, height);
                    
                    if (shape.area > 20) {
                        shape.type = this.classifyShape(shape);
                        shape.symbolWeight = this.calculateSymbolWeight(shape);
                        shapes.push(shape);
                    }
                }
            }
        }
        
        // Sort by perceptual importance
        shapes.sort((a, b) => b.symbolWeight - a.symbolWeight);
        
        return shapes;
    }
    
    analyzeColors(data, width, height) {
        const samples = [];
        const step = this.SAMPLE_RATE * 4;
        
        // Adaptive color sampling
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const idx = (y * width + x) * 4;
                samples.push({
                    r: data[idx],
                    g: data[idx + 1],
                    b: data[idx + 2],
                    x, y
                });
            }
        }
        
        // Cluster colors using CIEDE2000
        const clusters = this.clusterColorsCIEDE2000(samples);
        
        // Emotional color mapping
        const emotionalPalette = this.mapColorsToEmotions(clusters);
        
        return {
            dominantClusters: clusters,
            emotionalPalette,
            harmony: this.calculateColorHarmony(clusters),
            temperature: this.calculateColorTemperature(clusters)
        };
    }
    
    // === EMOTIONAL ANALYSIS =================================================
    
    analyzeEmotion(perception, context) {
        // Combine visual features with context
        const visualEmotion = this.extractVisualEmotion(perception);
        const contextualEmotion = context.emotion || { valence: 0.5, arousal: 0.5 };
        
        // Temporal dynamics
        this.emotionalBuffer.push({
            timestamp: Date.now(),
            visual: visualEmotion,
            contextual: contextualEmotion
        });
        
        // Keep buffer size manageable
        if (this.emotionalBuffer.length > 10) {
            this.emotionalBuffer.shift();
        }
        
        // Calculate trajectory
        const trajectory = this.calculateEmotionalTrajectory();
        
        return {
            current: this.blendEmotions(visualEmotion, contextualEmotion),
            trajectory,
            resonance: this.calculateEmotionalResonance(perception)
        };
    }
    
    extractVisualEmotion(perception) {
        // Map visual features to emotional dimensions
        const edgeChaos = perception.edges.density * perception.edges.orientation.entropy;
        const colorWarmth = perception.colors.temperature;
        const spatialTension = perception.spatial.asymmetry;
        
        return {
            valence: this.sigmoid(colorWarmth - 0.5 + perception.colors.harmony * 0.3),
            arousal: this.sigmoid(edgeChaos + spatialTension - 0.5),
            dominance: this.sigmoid(perception.spatial.centralMass - 0.5)
        };
    }
    
    // === CULTURAL TRANSFORMATION ============================================
    
    applyCulturalLens(perception, emotion) {
        const transformed = JSON.parse(JSON.stringify(perception)); // Deep clone
        
        // Apply cultural color semantics
        transformed.colors.dominantClusters = transformed.colors.dominantClusters.map(cluster => {
            const culturalMeaning = this.culturalGrammar.colors[this.nearestColorName(cluster)];
            return {
                ...cluster,
                culturalWeight: culturalMeaning?.weight || 1.0,
                culturalSymbol: culturalMeaning?.symbol || null
            };
        });
        
        // Transform spatial priorities
        if (this.culturalGrammar.spatial.priority === 'radial') {
            transformed.spatial = this.convertToRadialSpace(transformed.spatial);
        }
        
        // Adjust shape significance
        transformed.shapes = transformed.shapes.map(shape => {
            const culturalSignificance = this.culturalGrammar.shapes[shape.type];
            return {
                ...shape,
                culturalWeight: shape.symbolWeight * (culturalSignificance || 1.0)
            };
        });
        
        return transformed;
    }
    
    // === SYMBOLIC ENCODING ==================================================
    
    encodeToSymbols(perception, emotion) {
        const budget = this.budgets[this.mode];
        let code = '';
        
        // 1. SCENE CONTEXT (adaptive 3-4 chars)
        code += this.encodeSceneContext(perception, emotion, budget.scene);
        
        // 2. OBJECTS (entropy-optimized allocation)
        const objectCode = this.encodeObjectsWithEntropy(perception.shapes, budget.objects);
        code += objectCode;
        
        // 3. SPATIAL (with depth layer)
        code += this.encodeSpatialWithDepth(perception.spatial, budget.spatial);
        
        // 4. EMOTION (trajectory encoding)
        code += this.encodeEmotionalTrajectory(emotion, budget.emotion);
        
        return code;
    }
    
    encodeSceneContext(perception, emotion, budget) {
        const sceneType = this.classifySceneType(perception);
        const lighting = this.classifyLighting(perception.colors);
        const mood = this.dominantMood(emotion);
        
        // Dynamic symbol assignment based on frequency
        const sceneSymbol = this.vocabulary.getSymbol('scene', sceneType);
        const lightSymbol = this.vocabulary.getSymbol('light', lighting);
        const moodSymbol = this.vocabulary.getSymbol('mood', mood);
        
        let context = sceneSymbol + lightSymbol + moodSymbol;
        
        // Add complexity indicator if budget allows
        if (budget > 3) {
            const complexity = this.calculateSceneComplexity(perception);
            context += this.vocabulary.getSymbol('complexity', complexity);
        }
        
        return context;
    }
    
    encodeObjectsWithEntropy(shapes, budget) {
        // Huffman-style encoding for common objects
        const encodedObjects = [];
        
        for (const shape of shapes) {
            if (encodedObjects.join('').length >= budget) break;
            
            // Priority encoding based on cultural weight and saliency
            const priority = shape.culturalWeight * shape.saliency;
            const symbolLength = priority > 0.8 ? 1 : priority > 0.5 ? 2 : 3;
            
            const symbol = this.vocabulary.getSymbolWithLength('object', shape.type, symbolLength);
            
            // Add position encoding
            const posSymbol = this.encodePosition(shape.centroid, 1);
            
            encodedObjects.push(symbol + posSymbol);
        }
        
        return encodedObjects.join('').padEnd(budget, '0');
    }
    
    encodeSpatialWithDepth(spatial, budget) {
        let code = '';
        
        // Primary focus (1 char)
        code += this.vocabulary.getSymbol('focus', spatial.primaryFocus);
        
        // Distribution pattern (1 char)
        code += this.vocabulary.getSymbol('distribution', spatial.pattern);
        
        // Depth layers if budget allows
        if (budget > 2) {
            code += this.encodeDepthLayers(spatial.depthMap, budget - 2);
        }
        
        return code.padEnd(budget, 'X');
    }
    
    encodeEmotionalTrajectory(emotion, budget) {
        const trajectory = emotion.trajectory;
        let code = '';
        
        // Current state (2 chars minimum)
        const valenceSymbol = this.quantizeToSymbol(emotion.current.valence);
        const arousalSymbol = this.quantizeToSymbol(emotion.current.arousal);
        code += valenceSymbol + arousalSymbol;
        
        // Trajectory if budget allows
        if (budget > 2 && trajectory.length > 0) {
            const trend = this.calculateEmotionalTrend(trajectory);
            code += this.vocabulary.getSymbol('trend', trend);
        }
        
        // Resonance encoding
        if (budget > 3) {
            code += this.quantizeToSymbol(emotion.resonance);
        }
        
        return code.padEnd(budget, '5');
    }
    
    // === ERROR CORRECTION ===================================================
    
    addErrorCorrection(code) {
        // Simple checksum for now, could implement Reed-Solomon
        const checksum = this.calculateChecksum(code);
        return code + checksum;
    }
    
    calculateChecksum(code) {
        let sum = 0;
        for (let i = 0; i < code.length; i++) {
            sum += code.charCodeAt(i) * (i + 1);
        }
        return String.fromCharCode(65 + (sum % 26));
    }
    
    // === UTILITY METHODS ====================================================
    
    loadCulturalGrammar(culture) {
        // Default universal grammar
        const grammars = {
            universal: {
                colors: {
                    red: { weight: 1.0, symbol: 'passion' },
                    blue: { weight: 1.0, symbol: 'calm' },
                    green: { weight: 1.0, symbol: 'nature' },
                    white: { weight: 1.0, symbol: 'purity' },
                    black: { weight: 1.0, symbol: 'mystery' }
                },
                spatial: { priority: 'cartesian' },
                shapes: {
                    circle: 1.0,
                    rectangle: 0.8,
                    triangle: 0.9,
                    organic: 1.1
                }
            },
            japanese: {
                colors: {
                    red: { weight: 1.2, symbol: 'life' },
                    white: { weight: 1.3, symbol: 'death' },
                    black: { weight: 0.8, symbol: 'formality' }
                },
                spatial: { priority: 'asymmetric' },
                shapes: {
                    circle: 1.2,
                    organic: 1.5
                }
            },
            norse: {
                colors: {
                    red: { weight: 1.3, symbol: 'battle' },
                    blue: { weight: 0.9, symbol: 'ice' },
                    gold: { weight: 1.4, symbol: 'glory' }
                },
                spatial: { priority: 'radial' },
                shapes: {
                    triangle: 1.3,
                    angular: 1.2
                }
            }
        };
        
        return grammars[culture] || grammars.universal;
    }
    
    getLuminance(data, idx) {
        const i = idx * 4;
        return 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    }
    
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    validateInput(imageData) {
        if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
            throw new Error('Invalid ImageData provided');
        }
        if (imageData.width < 16 || imageData.height < 16) {
            throw new Error('Image too small (minimum 16x16)');
        }
    }
    
    // Placeholder for complex methods (would be fully implemented in production)
    marchingSquares(edges, visited, x, y, width, height) {
        // Simplified marching squares
        const shape = {
            points: [],
            centroid: { x, y },
            area: 0,
            perimeter: 0,
            boundingBox: { minX: x, minY: y, maxX: x, maxY: y }
        };
        
        // Would implement full marching squares algorithm
        // For now, return simplified shape
        shape.area = 50; // Placeholder
        shape.saliency = 0.5 + Math.random() * 0.5;
        
        return shape;
    }
    
    clusterColorsCIEDE2000(samples) {
        // Simplified color clustering
        // In production, would use proper CIEDE2000 distance metric
        const clusters = [];
        const maxClusters = 5;
        
        // K-means style clustering placeholder
        for (let i = 0; i < Math.min(maxClusters, samples.length); i++) {
            clusters.push({
                center: samples[i],
                weight: 1.0 / maxClusters,
                samples: [samples[i]]
            });
        }
        
        return clusters;
    }
    
    calculateConfidence(perception, emotion) {
        // Confidence based on signal clarity
        const edgeClarity = Math.min(1, perception.edges.density * 2);
        const colorConfidence = perception.colors.harmony;
        const emotionalCertainty = 1 - Math.abs(emotion.current.valence - 0.5);
        
        return (edgeClarity + colorConfidence + emotionalCertainty) / 3;
    }
    
    classifyShape(shape) {
        // Simplified shape classification
        const aspectRatio = shape.boundingBox.width / shape.boundingBox.height;
        
        if (Math.abs(aspectRatio - 1) < 0.2) return 'square';
        if (aspectRatio > 2) return 'horizontal';
        if (aspectRatio < 0.5) return 'vertical';
        
        return 'organic';
    }
    
    calculateSymbolWeight(shape) {
        return shape.area / 1000 + shape.saliency;
    }
    
    quantizeToSymbol(value) {
        // Map 0-1 to A-Z
        const idx = Math.floor(value * 25);
        return String.fromCharCode(65 + Math.max(0, Math.min(25, idx)));
    }
}

// === DYNAMIC VOCABULARY SYSTEM ==============================================

class DynamicVocabulary {
    constructor() {
        this.vocabularies = {
            scene: 'ABCDEFGHIJ',
            light: 'KLMNOP',
            mood: 'QRSTUV',
            object: 'abcdefghijklmnopqrstuvwxyz',
            focus: 'WXYZ',
            distribution: '01234',
            trend: '56789',
            complexity: 'αβγδ'
        };
        
        this.frequencyTables = {};
    }
    
    getSymbol(category, value) {
        const vocab = this.vocabularies[category];
        if (!vocab) return '?';
        
        // Hash the value to get consistent symbol
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = ((hash << 5) - hash) + value.charCodeAt(i);
            hash = hash & hash;
        }
        
        return vocab[Math.abs(hash) % vocab.length];
    }
    
    getSymbolWithLength(category, value, length) {
        // Adaptive length encoding
        const base = this.getSymbol(category, value);
        
        if (length === 1) return base;
        
        // Add modifier symbols for longer codes
        let code = base;
        for (let i = 1; i < length; i++) {
            code += this.getSymbol('modifier', value + i);
        }
        
        return code;
    }
}

// === EXPORT =================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerceptualAlchemyEncoder;
} else if (typeof window !== 'undefined') {
    window.PerceptualAlchemyEncoder = PerceptualAlchemyEncoder;
}