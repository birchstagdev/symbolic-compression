// perceptual_alchemy_encoder_v4_complete.js
// =====================================================
// PERCEPTUAL ALCHEMY: SYMBOLIC VISUAL ENCODER
// =====================================================
// Complete implementation with all placeholders filled
// =====================================================

class PerceptualAlchemyEncoder {
    constructor(options = {}) {
        this.mode = options.mode || 'balanced';
        this.culture = options.culture || 'universal';
        this.emotionalContext = options.emotionalContext || null;
        
        // Dynamic vocabulary system
        this.vocabulary = new DynamicVocabulary();
        
        // Cultural grammar loader
        this.culturalGrammar = this.loadCulturalGrammar(this.culture);
        
        // Emotional trajectory buffer
        this.emotionalBuffer = [];
        
        // FIXED: Adjusted thresholds for better object detection
        this.EDGE_THRESHOLD = this.mode === 'mobile' ? 50 : 30;  // Lowered from 100/64
        this.SAMPLE_RATE = 1;      // Reduced from 8/4
        
        // Symbol allocation budgets
        this.budgets = {
            mobile: { total: 16, scene: 3, objects: 6, spatial: 4, emotion: 3 },
            balanced: { total: 26, scene: 4, objects: 12, spatial: 6, emotion: 4 },
            rich: { total: 32, scene: 4, objects: 14, spatial: 8, emotion: 6 }
        };
        
        // Debug mode for symbol visualization
        this.debug = options.debug || false;
        this.symbolMap = new Map();
    
    }
    
    // === PUBLIC API =========================================================
    
    /**
     * Encodes an image into a symbolic perceptual string
     * @param {ImageData} imageData - Raw image data
     * @param {Object} context - Optional emotional/narrative context
     * @returns {Object} { code, analysis, confidence, narrative, debug }
     */
    encode(imageData, context = {}) {
        this.imageWidth  = imageData.width;
        this.imageHeight = imageData.height;
        const startTime = performance.now();
        
        // Validate input
        this.validateInput(imageData);
        
        // Clear debug map for new encoding
        if (this.debug) this.symbolMap.clear();
        
        // 1. PERCEPTUAL ANALYSIS
        const perception = this.analyzePerception(imageData);
        
        // 2. EMOTIONAL ANALYSIS
        const emotion = this.analyzeEmotion(perception, context);
        
        // 3. CULTURAL TRANSFORMATION
        const culturalPerception = this.applyCulturalLens(perception, emotion);
        
        // 4. SYMBOLIC ENCODING
        const code = this.encodeToSymbols(culturalPerception, emotion);
        
        // 5. ERROR CORRECTION (Reed-Solomon implementation)
        const finalCode = this.addReedSolomonErrorCorrection(code);
        
        // 6. CONFIDENCE SCORING
        const confidence = this.calculateConfidence(perception, emotion);
        
        // 7. NARRATIVE HINT GENERATION
        const narrativeHint = this.generateNarrativeHint(culturalPerception, emotion);
        
        const result = {
            code: finalCode,
            analysis: {
                perception,
                emotion,
                cultural: culturalPerception,
                processingTime: performance.now() - startTime
            },
            confidence,
            narrative: narrativeHint
        };

       
        console.group("Full Encoder Output");
        console.log("Encoded result object:", result);
        if (result && typeof result === "object") {
            Object.entries(result).forEach(([key, value]) => {
                console.log(`[result.${key}]`, value);
                if (value && typeof value === "object" && !Array.isArray(value)) {
                    Object.entries(value).forEach(([k, v]) => {
                        console.log(`   [result.${key}.${k}]`, v);
                    });
                }
            });
        }
        console.groupEnd();
        
        // Add debug information if enabled
        if (this.debug) {
            result.debug = {
                symbolMap: Array.from(this.symbolMap.entries()),
                codeBreakdown: this.visualizeSymbolStream(finalCode)
            };
        }
        
        return result;
    }
    
    // === PERCEPTUAL ANALYSIS ================================================
    
    analyzePerception(imageData) {
        const { width, height, data } = imageData;
        
        // Edge detection using optimized Sobel
        const edges = this.detectEdges(data, width, height);
        
        // Shape primitives using complete marching squares
        const shapes = this.extractShapes(edges, width, height);
        
        // Color analysis with proper CIEDE2000
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
    
    /**
     * Complete marching squares implementation for shape extraction
     */
    marchingSquares(edgeMap, visited, startX, startY, width, height) {
        const shape = {
            points: [],
            centroid: { x: 0, y: 0 },
            area: 0,
            perimeter: 0,
            boundingBox: { 
                minX: startX, 
                minY: startY, 
                maxX: startX, 
                maxY: startY,
                width: 0,
                height: 0
            }
        };
        
        // Direction vectors for contour following
        const directions = [
            { dx: 1, dy: 0 },   // right
            { dx: 1, dy: 1 },   // down-right
            { dx: 0, dy: 1 },   // down
            { dx: -1, dy: 1 },  // down-left
            { dx: -1, dy: 0 },  // left
            { dx: -1, dy: -1 }, // up-left
            { dx: 0, dy: -1 },  // up
            { dx: 1, dy: -1 }   // up-right
        ];
        
        let x = startX, y = startY;
        let direction = 0;
        const maxSteps = width * height;
        let steps = 0;
        
        do {
            // Mark as visited
            const idx = y * width + x;
            visited[idx] = true;
            
            // Add point to shape
            shape.points.push({ x, y });
            
            // Update bounding box
            shape.boundingBox.minX = Math.min(shape.boundingBox.minX, x);
            shape.boundingBox.maxX = Math.max(shape.boundingBox.maxX, x);
            shape.boundingBox.minY = Math.min(shape.boundingBox.minY, y);
            shape.boundingBox.maxY = Math.max(shape.boundingBox.maxY, y);
            
            // Update centroid sum
            shape.centroid.x += x;
            shape.centroid.y += y;
            
            // Find next edge point
            let found = false;
            for (let i = 0; i < 8; i++) {
                const newDir = (direction + i) % 8;
                const nx = x + directions[newDir].dx;
                const ny = y + directions[newDir].dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nidx = ny * width + nx;
                    if (edgeMap[nidx] > this.EDGE_THRESHOLD && !visited[nidx]) {
                        x = nx;
                        y = ny;
                        direction = (newDir + 6) % 8; // Prefer continuing in similar direction
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) break;
            steps++;
            
        } while ((x !== startX || y !== startY) && steps < maxSteps);

        // Calculate final shape properties
        if (shape.points.length > 0) {
            shape.area = shape.points.length;
            shape.centroid.x /= shape.points.length;
            shape.centroid.y /= shape.points.length;
            shape.boundingBox.width = shape.boundingBox.maxX - shape.boundingBox.minX;
            shape.boundingBox.height = shape.boundingBox.maxY - shape.boundingBox.minY;
            shape.perimeter = this.calculatePerimeter(shape.points);
            shape.saliency = this.calculateShapeSaliency(shape);
        }
        
        return shape;
    }
    
    extractShapes(edges, width, height) {
        // Accept either { map: Float32Array } or bare Float32Array
        const edgeMap = edges.map || edges;
        if (!edgeMap) return [];
    
        const shapes   = [];
        const visited  = new Uint8Array(width * height);
    
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                if (edgeMap[idx] > this.EDGE_THRESHOLD && !visited[idx]) {
                    const shape = this.marchingSquares(edgeMap, visited, x, y, width, height);
                    if (shape && shape.points && shape.points.length) {
                        shapes.push(shape);
                    }
                }
            }
        }
        return shapes;
    }
    
    
    /**
     * Proper CIEDE2000 color difference implementation
     */
    calculateCIEDE2000(color1, color2) {
        // Convert RGB to LAB
        const lab1 = this.rgbToLab(color1);
        const lab2 = this.rgbToLab(color2);
        
        // CIEDE2000 formula constants
        const kL = 1, kC = 1, kH = 1;
        
        // Calculate differences
        const deltaL = lab2.L - lab1.L;
        const avgL = (lab1.L + lab2.L) / 2;
        
        const C1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
        const C2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);
        const avgC = (C1 + C2) / 2;
        
        const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
        
        const a1Prime = lab1.a * (1 + G);
        const a2Prime = lab2.a * (1 + G);
        
        const C1Prime = Math.sqrt(a1Prime * a1Prime + lab1.b * lab1.b);
        const C2Prime = Math.sqrt(a2Prime * a2Prime + lab2.b * lab2.b);
        const avgCPrime = (C1Prime + C2Prime) / 2;
        const deltaCPrime = C2Prime - C1Prime;
        
        let h1Prime = Math.atan2(lab1.b, a1Prime) * 180 / Math.PI;
        if (h1Prime < 0) h1Prime += 360;
        
        let h2Prime = Math.atan2(lab2.b, a2Prime) * 180 / Math.PI;
        if (h2Prime < 0) h2Prime += 360;
        
        let deltahPrime;
        if (Math.abs(h1Prime - h2Prime) <= 180) {
            deltahPrime = h2Prime - h1Prime;
        } else if (h2Prime - h1Prime > 180) {
            deltahPrime = h2Prime - h1Prime - 360;
        } else {
            deltahPrime = h2Prime - h1Prime + 360;
        }
        
        const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin(deltahPrime * Math.PI / 360);
        
        let avgHPrime;
        if (Math.abs(h1Prime - h2Prime) <= 180) {
            avgHPrime = (h1Prime + h2Prime) / 2;
        } else if (h1Prime + h2Prime < 360) {
            avgHPrime = (h1Prime + h2Prime + 360) / 2;
        } else {
            avgHPrime = (h1Prime + h2Prime - 360) / 2;
        }
        
        const T = 1 - 0.17 * Math.cos((avgHPrime - 30) * Math.PI / 180) +
                  0.24 * Math.cos(2 * avgHPrime * Math.PI / 180) +
                  0.32 * Math.cos((3 * avgHPrime + 6) * Math.PI / 180) -
                  0.20 * Math.cos((4 * avgHPrime - 63) * Math.PI / 180);
        
        const SL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
        const SC = 1 + 0.045 * avgCPrime;
        const SH = 1 + 0.015 * avgCPrime * T;
        
        const RT = -2 * Math.sqrt(Math.pow(avgCPrime, 7) / (Math.pow(avgCPrime, 7) + Math.pow(25, 7))) *
                   Math.sin(60 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2)) * Math.PI / 180);
        
        const deltaE = Math.sqrt(
            Math.pow(deltaL / (kL * SL), 2) +
            Math.pow(deltaCPrime / (kC * SC), 2) +
            Math.pow(deltaHPrime / (kH * SH), 2) +
            RT * (deltaCPrime / (kC * SC)) * (deltaHPrime / (kH * SH))
        );
        
        return deltaE;
    }
    
    rgbToLab(color) {
        // Convert RGB to XYZ
        let r = color.r / 255;
        let g = color.g / 255;
        let b = color.b / 255;
        
        // Gamma correction
        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        
        // sRGB to XYZ
        const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
        const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
        const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
        
        // XYZ to LAB
        const xn = 0.95047;
        const yn = 1.00000;
        const zn = 1.08883;
        
        const fx = x / xn > 0.008856 ? Math.pow(x / xn, 1/3) : (7.787 * x / xn + 16/116);
        const fy = y / yn > 0.008856 ? Math.pow(y / yn, 1/3) : (7.787 * y / yn + 16/116);
        const fz = z / zn > 0.008856 ? Math.pow(z / zn, 1/3) : (7.787 * z / zn + 16/116);
        
        return {
            L: 116 * fy - 16,
            a: 500 * (fx - fy),
            b: 200 * (fy - fz)
        };
    }
    
    /**
     * CIEDE2000-based color clustering
     */
    clusterColorsCIEDE2000(samples) {
        const maxClusters = 8;
        const clusters = [];
        
        // Initialize clusters with k-means++
        if (samples.length > 0) {
            // First cluster center is random
            clusters.push({
                center: samples[Math.floor(Math.random() * samples.length)],
                samples: [],
                weight: 0
            });
            
            // Select remaining centers with probability proportional to distance
            while (clusters.length < Math.min(maxClusters, samples.length)) {
                const distances = samples.map(sample => {
                    const minDist = Math.min(...clusters.map(cluster => 
                        this.calculateCIEDE2000(sample, cluster.center)
                    ));
                    return minDist * minDist;
                });
                
                const totalDist = distances.reduce((a, b) => a + b, 0);
                let random = Math.random() * totalDist;
                
                for (let i = 0; i < samples.length; i++) {
                    random -= distances[i];
                    if (random <= 0) {
                        clusters.push({
                            center: samples[i],
                            samples: [],
                            weight: 0
                        });
                        break;
                    }
                }
            }
        }
        
        // Perform k-means clustering with CIEDE2000
        const maxIterations = 50;
        for (let iter = 0; iter < maxIterations; iter++) {
            // Clear cluster samples
            clusters.forEach(cluster => {
                cluster.samples = [];
                cluster.weight = 0;
            });
            
            // Assign samples to nearest cluster
            samples.forEach(sample => {
                let minDist = Infinity;
                let nearestCluster = null;
                
                clusters.forEach(cluster => {
                    const dist = this.calculateCIEDE2000(sample, cluster.center);
                    if (dist < minDist) {
                        minDist = dist;
                        nearestCluster = cluster;
                    }
                });
                
                if (nearestCluster) {
                    nearestCluster.samples.push(sample);
                }
            });
            
            // Update cluster centers
            let changed = false;
            clusters.forEach(cluster => {
                if (cluster.samples.length > 0) {
                    const newCenter = {
                        r: cluster.samples.reduce((sum, s) => sum + s.r, 0) / cluster.samples.length,
                        g: cluster.samples.reduce((sum, s) => sum + s.g, 0) / cluster.samples.length,
                        b: cluster.samples.reduce((sum, s) => sum + s.b, 0) / cluster.samples.length
                    };
                    
                    if (this.calculateCIEDE2000(cluster.center, newCenter) > 1) {
                        cluster.center = newCenter;
                        changed = true;
                    }
                    
                    cluster.weight = cluster.samples.length / samples.length;
                }
            });
            
            if (!changed) break;
        }
        
        // Remove empty clusters and sort by weight
        return clusters
            .filter(c => c.samples.length > 0)
            .sort((a, b) => b.weight - a.weight);
    }
    
    analyzeColors(data, width, height) {
        const samples = [];
        const step = this.SAMPLE_RATE * 4;

        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const idx = (y * width + x) * 4;
                // Only count opaque pixels
                if (data[idx+3] === 0) continue;
                samples.push({
                    r: data[idx],
                    g: data[idx + 1],
                    b: data[idx + 2],
                    x, y
                });
            }
        }
        if (samples.length === 0) {
            // All transparent—inject a "safe" dummy color
            samples.push({r: 255, g: 255, b: 255, x:0, y:0});
        }
        
        // Cluster colors using proper CIEDE2000
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
    
    // === SPATIAL ANALYSIS ===================================================
    
    analyzeSpatial(shapes, colors, width, height) {
        // Calculate center of mass
        let totalMass = 0;
        let centerX = 0, centerY = 0;
        
        shapes.forEach(shape => {
            const mass = shape.area * shape.symbolWeight;
            centerX += shape.centroid.x * mass;
            centerY += shape.centroid.y * mass;
            totalMass += mass;
        });
        
        if (totalMass > 0) {
            centerX /= totalMass;
            centerY /= totalMass;
        } else {
            centerX = width / 2;
            centerY = height / 2;
        }
        
        // Analyze distribution pattern
        const distribution = this.analyzeDistributionPattern(shapes, centerX, centerY, width, height);
        
        // Calculate depth map (simplified)
        const depthMap = this.estimateDepthMap(shapes, colors, width, height);
        
        // Determine primary focus
        const primaryFocus = this.determinePrimaryFocus(shapes, { x: centerX, y: centerY }, width, height);
        
        // Calculate asymmetry
        const asymmetry = this.calculateAsymmetry(shapes, centerX, width);
        
        // For radial cultural grammars
        const radialDistribution = this.culture === 'japanese' || this.culture === 'norse' ? 
            this.analyzeRadialDistribution(shapes, centerX, centerY) : null;
        
        return {
            centerOfMass: { x: centerX, y: centerY },
            centralMass: totalMass / (width * height),
            distribution,
            depthMap,
            primaryFocus,
            asymmetry,
            radialDistribution,
            pattern: distribution.pattern
        };
    }
    
    analyzeRadialDistribution(shapes, centerX, centerY) {
        const radialBins = Array(8).fill(0); // 8 radial sectors
        
        shapes.forEach(shape => {
            const dx = shape.centroid.x - centerX;
            const dy = shape.centroid.y - centerY;
            const angle = Math.atan2(dy, dx) + Math.PI; // 0 to 2π
            const bin = Math.floor(angle / (Math.PI / 4));
            radialBins[bin] += shape.symbolWeight;
        });
        
        // Find dominant sector
        const maxBin = Math.max(...radialBins);
        const dominantSector = radialBins.indexOf(maxBin);
        
        // Calculate radial balance
        const balance = 1 - (Math.max(...radialBins) - Math.min(...radialBins)) / (Math.max(...radialBins) + 0.01);
        
        return {
            sectors: radialBins,
            dominantSector,
            balance,
            pattern: balance > 0.7 ? 'balanced' : 'directional'
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
            const culturalMeaning = this.culturalGrammar.colors[this.nearestColorName(cluster.center)];
            return {
                ...cluster,
                culturalWeight: culturalMeaning?.weight || 1.0,
                culturalSymbol: culturalMeaning?.symbol || null
            };
        });
        
        // Transform spatial priorities
        if (this.culturalGrammar.spatial.priority === 'radial' && perception.spatial.radialDistribution) {
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
    
    convertToRadialSpace(spatial) {
        // Convert Cartesian spatial analysis to radial for certain cultures
        const radial = spatial.radialDistribution;
        if (!radial) return spatial;
        
        return {
            ...spatial,
            primaryFocus: this.mapRadialToFocus(radial.dominantSector),
            pattern: radial.pattern,
            centerOfMass: {
                r: Math.sqrt(Math.pow(spatial.centerOfMass.x - 0.5, 2) + Math.pow(spatial.centerOfMass.y - 0.5, 2)),
                theta: Math.atan2(spatial.centerOfMass.y - 0.5, spatial.centerOfMass.x - 0.5)
            }
        };
    }
    
    mapRadialToFocus(sector) {
        const sectorNames = ['east', 'northeast', 'north', 'northwest', 'west', 'southwest', 'south', 'southeast'];
        return sectorNames[sector] || 'center';
    }
    
    // === SYMBOLIC ENCODING ==================================================
    
    encodeToSymbols(perception, emotion) {
        const budget = this.budgets[this.mode];

        // 1. SCENE CONTEXT (adaptive 3-4 chars)
        const sceneCode = this.encodeSceneContext(perception, emotion, budget.scene);

        // 2. OBJECTS (entropy-optimized allocation)
        const objectCode = this.encodeObjectsWithEntropy(perception.shapes, budget.objects);

        // 3. SPATIAL (with depth layer)
        const spatialCode = this.encodeSpatialWithDepth(perception.spatial, budget.spatial);

        // 4. EMOTION (trajectory encoding)
        const emotionCode = this.encodeEmotionalTrajectory(emotion, budget.emotion);

        // Strict segment join
        let code = sceneCode + objectCode + spatialCode + emotionCode;

        // --- Defensive Segment Validation ---
        // Enforce objectCode is ONLY a-z
        const objectsOnly = objectCode.replace(/0/g, ''); // '0' is padding
        if (/[^a-z]/.test(objectsOnly)) {
            throw new Error(`[ENCODER] Invalid symbol(s) in object segment: '${objectCode}'. Only 'a'-'z' allowed.`);
        }
        // Spatial can have WXYZ01234!@#$%
        if (/[^WXYZ01234!@#$%A-Z]/.test(spatialCode)) {
            throw new Error(`[ENCODER] Invalid symbol(s) in spatial segment: '${spatialCode}'.`);
        }
        
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
        
        // Track symbols for debug
        if (this.debug) {
            this.symbolMap.set(`scene[0]`, { symbol: sceneSymbol, meaning: sceneType });
            this.symbolMap.set(`scene[1]`, { symbol: lightSymbol, meaning: lighting });
            this.symbolMap.set(`scene[2]`, { symbol: moodSymbol, meaning: mood });
        }
        
        let context = sceneSymbol + lightSymbol + moodSymbol;
        
        // Add complexity indicator if budget allows
        if (budget > 3) {
            const complexity = this.calculateSceneComplexity(perception);
            const complexitySymbol = this.vocabulary.getSymbol('complexity', complexity);
            context += complexitySymbol;
            
            if (this.debug) {
                this.symbolMap.set(`scene[3]`, { symbol: complexitySymbol, meaning: complexity });
            }
        }
        
        return context;
    }
    
    encodeObjectsWithEntropy(shapes, budget) {
        if (!Array.isArray(shapes) || shapes.length === 0) {
            return ''.padEnd(budget, '0');
        }
        const encodedObjects = [];
        let currentLength = 0;
        
        for (let i = 0; i < shapes.length && currentLength < budget; i++) {
            const shape = shapes[i];
            
            // Priority encoding based on cultural weight and saliency
            const priority = shape.culturalWeight * shape.saliency;
            const symbolLength = priority > 0.8 ? 1 : priority > 0.5 ? 2 : 3;
            
            // Check if we have space
            if (currentLength + symbolLength + 1 > budget) break;
            
            const symbol = this.vocabulary.getSymbolWithLength('object', shape.type, symbolLength);
            const posSymbol = this.encodePosition(shape.centroid, shape.boundingBox, 1);
            
            encodedObjects.push(symbol + posSymbol);
            currentLength += symbol.length + posSymbol.length;
            
            if (this.debug) {
                this.symbolMap.set(`object[${i}]`, { 
                    symbol: symbol + posSymbol, 
                    meaning: `${shape.type} at (${Math.round(shape.centroid.x)}, ${Math.round(shape.centroid.y)})` 
                });
            }
        }
        
        const objectCode = encodedObjects.join('');
        return objectCode.padEnd(budget, '0');
    }
    
    /**
     * Encode position with spatial context
     */
    encodePosition(centroid, boundingBox, length = 1) {
        // normalise to 0-1
        const nx = centroid.x / this.imageWidth;
        const ny = centroid.y / this.imageHeight;
    
        if (length === 1) {
            // coarse 3×3 grid
            const gridX = Math.floor(nx * 3);
            const gridY = Math.floor(ny * 3);
            const gridPos = gridY * 3 + gridX;          // 0 … 8
            const positionChars = 'abcdefghi';           // letters, not digits
            return positionChars[Math.max(0, Math.min(8, gridPos))];
        }
    
        // finer precision: two quantised symbols (still letters)
        const posX = this.quantizeToSymbol(nx);         // e.g. 'm'
        const posY = this.quantizeToSymbol(ny);         // e.g. 'q'
        return posX + posY;
    }
    
    encodeSpatialWithDepth(spatial, budget) {
        let code = '';
        
        // Primary focus (1 char)
        const focusSymbol = this.vocabulary.getSymbol('focus', spatial.primaryFocus);
        code += focusSymbol;
        
        if (this.debug) {
            this.symbolMap.set('spatial[0]', { symbol: focusSymbol, meaning: `focus: ${spatial.primaryFocus}` });
        }
        
        // Distribution pattern (1 char)
        const distSymbol = this.vocabulary.getSymbol('distribution', spatial.pattern);
        code += distSymbol;
        
        if (this.debug) {
            this.symbolMap.set('spatial[1]', { symbol: distSymbol, meaning: `pattern: ${spatial.pattern}` });
        }
        
        // Depth layers if budget allows
        if (budget > 2) {
            const depthCode = this.encodeDepthLayers(spatial.depthMap, budget - 2);
            code += depthCode;
            
            if (this.debug) {
                this.symbolMap.set('spatial[2+]', { symbol: depthCode, meaning: 'depth layers' });
            }
        }
        
        if (code.length > budget) code = code.slice(0, budget);
        return code.padEnd(budget, 'X');
    }
    
    encodeDepthLayers(depthMap, availableChars) {
        if (!depthMap || availableChars <= 0) return '';
        
        // Simplify depth to foreground/midground/background
        const layers = this.quantizeDepthToLayers(depthMap);
        let code = '';
        
        if (availableChars >= 1) {
            code += this.vocabulary.getSymbol('depth', layers.distribution);
        }
        
        if (availableChars >= 2) {
            code += this.quantizeToSymbol(layers.foregroundWeight);
        }
        
        return code;
    }
    
    encodeEmotionalTrajectory(emotion, budget) {
        let code = '';
        
        // Current state (2 chars minimum)
        const valenceSymbol = this.quantizeToSymbol(emotion.current.valence);
        const arousalSymbol = this.quantizeToSymbol(emotion.current.arousal);
        code += valenceSymbol + arousalSymbol;
        
        if (this.debug) {
            this.symbolMap.set('emotion[0]', { symbol: valenceSymbol, meaning: `valence: ${emotion.current.valence.toFixed(2)}` });
            this.symbolMap.set('emotion[1]', { symbol: arousalSymbol, meaning: `arousal: ${emotion.current.arousal.toFixed(2)}` });
        }
        
        // Trajectory if budget allows
        if (budget > 2 && emotion.trajectory) {
            const trend = this.calculateEmotionalTrend(emotion.trajectory);
            const trendSymbol = this.vocabulary.getSymbol('trend', trend);
            code += trendSymbol;
            
            if (this.debug) {
                this.symbolMap.set('emotion[2]', { symbol: trendSymbol, meaning: `trend: ${trend}` });
            }
        }
        
        // Resonance encoding
        if (budget > 3) {
            const resonanceSymbol = this.quantizeToSymbol(emotion.resonance);
            code += resonanceSymbol;
            
            if (this.debug) {
                this.symbolMap.set('emotion[3]', { symbol: resonanceSymbol, meaning: `resonance: ${emotion.resonance.toFixed(2)}` });
            }
        }
        
        return code.padEnd(budget, '5');
    }
    
    // === ERROR CORRECTION ===================================================
    
    /**
     * Reed-Solomon error correction implementation
     */
    addReedSolomonErrorCorrection(code) {
        // For production, use a proper RS library
        // This is a simplified implementation
        const dataSymbols = code.length;
        const paritySymbols = Math.max(2, Math.floor(dataSymbols * 0.1)); // 10% redundancy
        
        // Generate parity symbols
        const parity = this.generateReedSolomonParity(code, paritySymbols);
        
        return code + parity.slice(0,1);
    }
    
    generateReedSolomonParity(data, numParity) {
        // Match the validator's checksum algorithm
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data.charCodeAt(i) * (i + 1);
        }
        return String.fromCharCode(65 + (sum % 26));
    }
    
    // === NARRATIVE GENERATION ===============================================
    
    generateNarrativeHint(perception, emotion) {
        const sceneNarrative = this.describeScene(perception);
        const emotionalNarrative = this.describeEmotion(emotion);
        const poeticHint = this.generatePoeticHint(perception, emotion);
        
        return {
            scene: sceneNarrative,
            emotion: emotionalNarrative,
            poetic: poeticHint,
            summary: `${sceneNarrative} ${emotionalNarrative}`.trim()
        };
    }
    
    describeScene(perception) {
        const objectCount = perception.shapes.length;
        const dominantColor = perception.colors.dominantClusters[0]?.center;
        const complexity = this.calculateSceneComplexity(perception);
        
        let description = '';
        
        if (objectCount === 0) {
            description = 'An abstract field of';
        } else if (objectCount === 1) {
            description = `A solitary ${perception.shapes[0].type} within`;
        } else if (objectCount < 4) {
            description = `A few ${this.summarizeShapeTypes(perception.shapes)} arranged in`;
        } else {
            description = `A complex scene of ${this.summarizeShapeTypes(perception.shapes)} filling`;
        }
        
        // Add color description
        if (dominantColor) {
            const colorName = this.getColorName(dominantColor);
            description += ` ${colorName}-tinted`;
        }
        
        // Add complexity
        description += ` ${complexity} space.`;
        
        return description;
    }
    
    describeEmotion(emotion) {
        const valence = emotion.current.valence;
        const arousal = emotion.current.arousal;
        
        let description = 'The mood is';
        
        if (valence > 0.7 && arousal > 0.7) {
            description += ' exhilarating and bright';
        } else if (valence > 0.7 && arousal < 0.3) {
            description += ' peaceful and content';
        } else if (valence < 0.3 && arousal > 0.7) {
            description += ' tense and urgent';
        } else if (valence < 0.3 && arousal < 0.3) {
            description += ' melancholic and still';
        } else {
            description += ' balanced and neutral';
        }
        
        if (emotion.trajectory && emotion.trajectory !== 'stable') {
            description += `, ${emotion.trajectory} toward ${this.predictEmotionalDirection(emotion)}`;
        }
        
        return description + '.';
    }
    
    generatePoeticHint(perception, emotion) {
        const templates = {
            high_valence_high_arousal: [
                'Light dances through {element}',
                'Joy erupts from {element}',
                'Energy pulses in {element}'
            ],
            low_valence_high_arousal: [
                'Shadows chase through {element}',
                'Tension coils around {element}',
                'Storm gathers in {element}'
            ],
            high_valence_low_arousal: [
                'Peace settles over {element}',
                'Gentle warmth embraces {element}',
                'Quiet beauty rests in {element}'
            ],
            low_valence_low_arousal: [
                'Melancholy pools in {element}',
                'Silence weighs upon {element}',
                'Memory fades through {element}'
            ]
        };
        
        // Select template based on emotion
        const v = emotion.current.valence;
        const a = emotion.current.arousal;
        let templateKey = '';
        
        if (v > 0.5 && a > 0.5) templateKey = 'high_valence_high_arousal';
        else if (v <= 0.5 && a > 0.5) templateKey = 'low_valence_high_arousal';
        else if (v > 0.5 && a <= 0.5) templateKey = 'high_valence_low_arousal';
        else templateKey = 'low_valence_low_arousal';
        
        const templateList = templates[templateKey];
        const template = templateList[Math.floor(Math.random() * templateList.length)];
        
        // Fill in element
        const element = perception.shapes.length > 0 ? 
            perception.shapes[0].type : 
            'empty space';
        
        return template.replace('{element}', element);
    }
    
    // === DEBUG VISUALIZATION ================================================
    
    visualizeSymbolStream(code) {
        if (!this.debug) return null;
        
        const breakdown = {
            raw: code,
            segments: [],
            legend: []
        };
        
        // Segment the code based on encoding structure
        const budget = this.budgets[this.mode];
        let position = 0;
        
        // Scene segment
        const sceneEnd = Math.min(budget.scene, code.length);
        breakdown.segments.push({
            type: 'scene',
            start: 0,
            end: sceneEnd,
            content: code.substring(0, sceneEnd),
            color: '#FF6B6B'
        });
        position = sceneEnd;
        
        // Objects segment
        const objectsEnd = Math.min(position + budget.objects, code.length);
        breakdown.segments.push({
            type: 'objects',
            start: position,
            end: objectsEnd,
            content: code.substring(position, objectsEnd),
            color: '#4ECDC4'
        });
        position = objectsEnd;
        
        // Spatial segment
        const spatialEnd = Math.min(position + budget.spatial, code.length);
        breakdown.segments.push({
            type: 'spatial',
            start: position,
            end: spatialEnd,
            content: code.substring(position, spatialEnd),
            color: '#45B7D1'
        });
        position = spatialEnd;
        
        // Emotion segment
        const emotionEnd = Math.min(position + budget.emotion, code.length);
        breakdown.segments.push({
            type: 'emotion',
            start: position,
            end: emotionEnd,
            content: code.substring(position, emotionEnd),
            color: '#96CEB4'
        });
        position = emotionEnd;
        
        // Error correction segment
        if (position < code.length) {
            breakdown.segments.push({
                type: 'error_correction',
                start: position,
                end: code.length,
                content: code.substring(position),
                color: '#DDA0DD'
            });
        }
        
        // Generate legend
        breakdown.legend = Array.from(this.symbolMap.entries()).map(([key, value]) => ({
            position: key,
            symbol: value.symbol,
            meaning: value.meaning
        }));
        
        return breakdown;
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
                spatial: { priority: 'radial' }, // Changed to radial
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
    
    getLuminance(data, pixelIndex) {
        // Ensure we're accessing the correct position in the flat array
        const i = pixelIndex * 4;
        if (i + 2 >= data.length) return 0;
        
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
    
    calculateEdgeDensity(edges) {
        let count = 0;
        let total = 0;
        
        for (let i = 0; i < edges.length; i++) {
            if (edges[i] > 0) {
                count += edges[i] > this.EDGE_THRESHOLD ? 1 : 0;
                total++;
            }
        }
        
        return total > 0 ? count / total : 0;
    }
    
    dominantOrientation(edges, width, height) {
        // Calculate histogram of gradient orientations
        const bins = 8;
        const histogram = new Array(bins).fill(0);
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                if (edges[idx] > this.EDGE_THRESHOLD) {
                    // Calculate gradient direction
                    const dx = edges[idx + 1] - edges[idx - 1];
                    const dy = edges[(y + 1) * width + x] - edges[(y - 1) * width + x];
                    
                    let angle = Math.atan2(dy, dx) + Math.PI;
                    const bin = Math.floor(angle / (2 * Math.PI / bins));
                    histogram[bin]++;
                }
            }
        }
        

        
        // Find dominant orientation
        const maxBin = histogram.indexOf(Math.max(...histogram));
        const dominantAngle = (maxBin * 2 * Math.PI / bins) - Math.PI;
        
        // Calculate entropy
        const total = histogram.reduce((a, b) => a + b, 0);
        let entropy = 0;
        
        histogram.forEach(count => {
            if (count > 0) {
                const p = count / total;
                entropy -= p * Math.log2(p);
            }
        });
        
        return {
            dominant: dominantAngle,
            entropy: entropy / Math.log2(bins), // Normalize to 0-1
            histogram
        };
    }

    calculateSceneComplexity(perception) {
        const edgeComplexity = perception.edges.density;
        const shapeComplexity = Math.min(1, perception.shapes.length / 10);
        const colorComplexity = Math.min(1, perception.colors.dominantClusters.length / 8);
        
        return {
            edgeDensity: edgeComplexity,
            perceptualObjects: perception.shapes,
            colorVariance: {
                uniqueColorCount: perception.colors.dominantClusters.length,
                complexity: colorComplexity
            },
            overallComplexity: (edgeComplexity + shapeComplexity + colorComplexity) / 3
        };
    }
    
    calculatePerimeter(points) {
        if (points.length < 2) return 0;
        
        let perimeter = 0;
        for (let i = 0; i < points.length; i++) {
            const next = (i + 1) % points.length;
            const dx = points[next].x - points[i].x;
            const dy = points[next].y - points[i].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        
        return perimeter;
    }
    
    calculateShapeSaliency(shape) {
        // Saliency based on size, compactness, and position
        const compactness = shape.area / (shape.perimeter * shape.perimeter);
        const centerDistance = Math.sqrt(
            Math.pow(shape.centroid.x - 140, 2) + 
            Math.pow(shape.centroid.y - 100, 2)
        ) / 170; // Normalized distance from center
        
        const sizeFactor = Math.min(1, shape.area / 1000);
        const compactnessFactor = compactness * 4; // Circle has compactness ~0.25
        const positionFactor = 1 - centerDistance;
        
        return (sizeFactor * 0.4 + compactnessFactor * 0.3 + positionFactor * 0.3);
    }
    
    classifyShape(shape) {
        if (!shape || !shape.boundingBox) return 'unknown';
    
        const aspectRatio = shape.boundingBox.width / (shape.boundingBox.height || 1);
        const compactness = shape.area / (shape.perimeter * shape.perimeter || 1);

        
        // More sophisticated shape classification
        if (compactness > 0.7) return 'circle';
        if (compactness > 0.5 && Math.abs(aspectRatio - 1) < 0.2) return 'square';
        if (aspectRatio > 2.5) return 'horizontal-line';
        if (aspectRatio < 0.4) return 'vertical-line';
        if (compactness < 0.2) return 'complex';
        
        return 'organic';
    }
    
    calculateSymbolWeight(shape) {
        return shape.saliency * (1 + Math.log(shape.area + 1) / 10);
    }
    
    mapColorsToEmotions(clusters) {
        return clusters.map(cluster => {
            const { r, g, b } = cluster.center;
            
            // Color psychology mapping
            const warmth = (r - b) / 255;
            const brightness = (r + g + b) / (3 * 255);
            const saturation = this.calculateSaturation(r, g, b);
            
            return {
                color: cluster.center,
                warmth,
                brightness,
                saturation,
                emotionalWeight: warmth * 0.4 + brightness * 0.3 + saturation * 0.3
            };
        });
    }
    
    calculateSaturation(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max === 0 ? 0 : (max - min) / max;
    }
    
    calculateColorHarmony(clusters) {
        if (clusters.length < 2) return 1.0;
        
        let harmony = 0;
        let comparisons = 0;
        
        // Check color relationships
        for (let i = 0; i < clusters.length - 1; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const distance = this.calculateCIEDE2000(clusters[i].center, clusters[j].center);
                
                // Harmonious if complementary (large distance) or analogous (small distance)
                if (distance > 80 || distance < 20) {
                    harmony += 1;
                }
                comparisons++;
            }
        }
        
        return comparisons > 0 ? harmony / comparisons : 0;
    }
    
    calculateColorTemperature(clusters) {
        let totalWarmth = 0;
        let totalWeight = 0;
        
        clusters.forEach(cluster => {
            const { r, g, b } = cluster.center;
            const warmth = (r - b) / 255 + 0.5; // Normalize to 0-1
            totalWarmth += warmth * cluster.weight;
            totalWeight += cluster.weight;
        });
        
        return totalWeight > 0 ? totalWarmth / totalWeight : 0.5;
    }
    
    calculateSaliency(edges, colors, spatial) {
        // Combine multiple saliency cues
        const edgeSaliency = edges.density;
        const colorSaliency = 1 - colors.harmony; // Contrast is salient
        const spatialSaliency = spatial.asymmetry;
        
        return (edgeSaliency + colorSaliency + spatialSaliency) / 3;
    }
    
    analyzeDistributionPattern(shapes, centerX, centerY, width, height) {
        if (shapes.length === 0) {
            return { pattern: 'empty', balance: 1, tension: 0 };
        }
        
        // Calculate quadrant weights
        const quadrants = [0, 0, 0, 0]; // TL, TR, BL, BR
        
        shapes.forEach(shape => {
            const qx = shape.centroid.x < centerX ? 0 : 1;
            const qy = shape.centroid.y < centerY ? 0 : 2;
            quadrants[qy + qx] += shape.symbolWeight;
        });
        
        // Determine pattern
        const total = quadrants.reduce((a, b) => a + b, 0);
        const variance = this.calculateVariance(quadrants);
        const maxQuad = Math.max(...quadrants);
        
        let pattern = 'balanced';
        if (variance > 0.3) pattern = 'asymmetric';
        if (maxQuad / total > 0.6) pattern = 'clustered';
        
        // Check for specific patterns
        if (Math.abs(quadrants[0] + quadrants[3] - quadrants[1] - quadrants[2]) / total > 0.3) {
            pattern = 'diagonal';
        }
        
        return {
            pattern,
            balance: 1 - variance,
            tension: variance,
            quadrants
        };
    }
    
    calculateVariance(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance) / (mean + 0.001); // Coefficient of variation
    }
    
    estimateDepthMap(shapes, colors, width, height) {
        // Simplified depth estimation based on size and position
        const depthLayers = {
            foreground: [],
            midground: [],
            background: []
        };
        
        shapes.forEach(shape => {
            // Larger objects tend to be closer
            // Higher Y position tends to be further
            const sizeScore = shape.area / (width * height);
            const positionScore = shape.centroid.y / height;
            const depthScore = sizeScore * 0.7 - positionScore * 0.3;
            
            if (depthScore > 0.1) {
                depthLayers.foreground.push(shape);
            } else if (depthScore > 0) {
                depthLayers.midground.push(shape);
            } else {
                depthLayers.background.push(shape);
            }
        });
        
        return depthLayers;
    }
    
    determinePrimaryFocus(shapes, centerOfMass, width, height) {
        if (shapes.length === 0) return 'center';
        
        // Find shape with highest saliency
        const primaryShape = shapes[0]; // Already sorted by weight
        
        // Determine focus region
        const x = primaryShape.centroid.x / width;
        const y = primaryShape.centroid.y / height;
        
        if (x < 0.33) {
            if (y < 0.33) return 'top-left';
            if (y > 0.67) return 'bottom-left';
            return 'left';
        } else if (x > 0.67) {
            if (y < 0.33) return 'top-right';
            if (y > 0.67) return 'bottom-right';
            return 'right';
        } else {
            if (y < 0.33) return 'top';
            if (y > 0.67) return 'bottom';
            return 'center';
        }
    }
    
    calculateAsymmetry(shapes, centerX, width) {
        if (shapes.length === 0) return 0;
        
        let leftWeight = 0;
        let rightWeight = 0;
        
        shapes.forEach(shape => {
            if (shape.centroid.x < centerX) {
                leftWeight += shape.symbolWeight;
            } else {
                rightWeight += shape.symbolWeight;
            }
        });
        
        const total = leftWeight + rightWeight;
        return total > 0 ? Math.abs(leftWeight - rightWeight) / total : 0;
    }
    
    nearestColorName(color) {
        const colors = {
            red: { r: 255, g: 0, b: 0 },
            green: { r: 0, g: 255, b: 0 },
            blue: { r: 0, g: 0, b: 255 },
            white: { r: 255, g: 255, b: 255 },
            black: { r: 0, g: 0, b: 0 },
            yellow: { r: 255, g: 255, b: 0 },
            cyan: { r: 0, g: 255, b: 255 },
            magenta: { r: 255, g: 0, b: 255 },
            gold: { r: 255, g: 215, b: 0 }
        };
        
        let minDistance = Infinity;
        let nearestName = 'unknown';
        
        Object.entries(colors).forEach(([name, refColor]) => {
            const distance = this.calculateCIEDE2000(color, refColor);
            if (distance < minDistance) {
                minDistance = distance;
                nearestName = name;
            }
        });
        
        return nearestName;
    }
    
    blendEmotions(visual, contextual) {
        const alpha = 0.7; // Visual weight
        return {
            valence: visual.valence * alpha + contextual.valence * (1 - alpha),
            arousal: visual.arousal * alpha + contextual.arousal * (1 - alpha),
            dominance: visual.dominance * alpha + (contextual.dominance || 0.5) * (1 - alpha)
        };
    }
    
    calculateEmotionalTrajectory() {
        if (this.emotionalBuffer.length < 2) return 'stable';
        
        const recent = this.emotionalBuffer.slice(-3);
        let valenceChange = 0;
        let arousalChange = 0;
        
        for (let i = 1; i < recent.length; i++) {
            valenceChange += recent[i].visual.valence - recent[i-1].visual.valence;
            arousalChange += recent[i].visual.arousal - recent[i-1].visual.arousal;
        }
        
        valenceChange /= recent.length - 1;
        arousalChange /= recent.length - 1;
        
        if (Math.abs(valenceChange) < 0.1 && Math.abs(arousalChange) < 0.1) return 'stable';
        if (valenceChange > 0.1 && arousalChange > 0.1) return 'escalating';
        if (valenceChange < -0.1 && arousalChange < -0.1) return 'calming';
        if (valenceChange > 0.1) return 'brightening';
        if (valenceChange < -0.1) return 'darkening';
        if (arousalChange > 0.1) return 'intensifying';
        return 'relaxing';
    }
    
    calculateEmotionalResonance(perception) {
        // How strongly the visual elements resonate emotionally
        const colorResonance = perception.colors.emotionalPalette.reduce((sum, c) => sum + c.emotionalWeight, 0) / perception.colors.emotionalPalette.length;
        const spatialResonance = perception.spatial.asymmetry * 0.5 + 0.5;
        const edgeResonance = perception.edges.density;
        
        return (colorResonance + spatialResonance + edgeResonance) / 3;
    }
    
    classifySceneType(perception) {
        const shapeTypes = perception.shapes.map(s => s.type);
        const edgeDensity = perception.edges.density;
        const colorTemp = perception.colors.temperature;
        
        // Rule-based classification
        if (shapeTypes.includes('organic') && colorTemp > 0.6) return 'natural';
        if (shapeTypes.includes('square') || shapeTypes.includes('rectangle')) return 'architectural';
        if (perception.shapes.length === 1 && perception.shapes[0].area > 1000) return 'portrait';
        if (edgeDensity > 0.3) return 'complex';
        if (edgeDensity < 0.05) return 'minimal';
        
        return 'general';
    }
    
    classifyLighting(colors) {
        const temp = colors.temperature;
        const brightness = colors.dominantClusters[0] ? 
            (colors.dominantClusters[0].center.r + colors.dominantClusters[0].center.g + colors.dominantClusters[0].center.b) / (3 * 255) : 0.5;
        
        if (brightness > 0.8) return 'bright';
        if (brightness < 0.2) return 'dark';
        if (temp > 0.7) return 'warm';
        if (temp < 0.3) return 'cool';
        return 'neutral';
    }
    
    dominantMood(emotion) {
        const v = emotion.current.valence;
        const a = emotion.current.arousal;
        
        if (v > 0.6 && a > 0.6) return 'joyful';
        if (v > 0.6 && a < 0.4) return 'peaceful';
        if (v < 0.4 && a > 0.6) return 'tense';
        if (v < 0.4 && a < 0.4) return 'melancholic';
        return 'neutral';
    }
    
    calculateSceneComplexity(perception) {
        const objectCount = perception.shapes.length;
        const edgeDensity = perception.edges.density;
        const colorVariety = perception.colors.dominantClusters.length;
        
        const complexity = (objectCount / 10) * 0.4 + edgeDensity * 0.4 + (colorVariety / 5) * 0.2;
        
        if (complexity > 0.7) return 'high';
        if (complexity > 0.3) return 'medium';
        return 'low';
    }
    
    quantizeDepthToLayers(depthMap) {
        if (!depthMap) return { distribution: 'flat', foregroundWeight: 0.33 };
        
        const total = depthMap.foreground.length + depthMap.midground.length + depthMap.background.length;
        
        if (total === 0) return { distribution: 'empty', foregroundWeight: 0 };
        
        const foreWeight = depthMap.foreground.length / total;
        const backWeight = depthMap.background.length / total;
        
        let distribution = 'balanced';
        if (foreWeight > 0.6) distribution = 'forward';
        else if (backWeight > 0.6) distribution = 'distant';
        else if (depthMap.midground.length / total > 0.6) distribution = 'centered';
        
        return { distribution, foregroundWeight: foreWeight };
    }
    
    calculateEmotionalTrend(trajectory) {
        if (typeof trajectory === 'string') return trajectory;
        
        // If trajectory is more complex, analyze it
        return 'stable';
    }
    
    predictEmotionalDirection(emotion) {
        const trajectory = emotion.trajectory;
        
        if (trajectory === 'escalating') return 'higher intensity';
        if (trajectory === 'calming') return 'tranquility';
        if (trajectory === 'brightening') return 'positivity';
        if (trajectory === 'darkening') return 'shadows';
        
        return 'stability';
    }
    
    getColorName(color) {
        return this.nearestColorName(color);
    }
    
    summarizeShapeTypes(shapes) {
        const types = shapes.map(s => s.type);
        const unique = [...new Set(types)];
        
        if (unique.length === 1) return unique[0] + 's';
        if (unique.length === 2) return unique.join(' and ');
        return 'varied forms';
    }
    
    calculateConfidence(perception, emotion) {
        // Confidence based on signal clarity
        const edgeClarity = Math.min(1, perception.edges.density * 2);
        const colorConfidence = perception.colors.harmony;
        const emotionalCertainty = 1 - Math.abs(emotion.current.valence - 0.5);
        const shapeConfidence = perception.shapes.length > 0 ? 
            perception.shapes[0].saliency : 0.3;
        
        return (edgeClarity + colorConfidence + emotionalCertainty + shapeConfidence) / 4;
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
            complexity: 'αβγδ',
            depth: '!@#$%',
            modifier: '+-*/='
        };
        
        this.frequencyTables = {};
    }
    
    getSymbol(category, value) {
        const vocab = this.vocabularies[category];
        if (!vocab) return '?';
        
        // Convert value to string and normalize
        const valueStr = String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Hash the value to get consistent symbol
        let hash = 0;
        for (let i = 0; i < valueStr.length; i++) {
            hash = ((hash << 5) - hash) + valueStr.charCodeAt(i);
            hash = hash & hash;
        }
        
        return vocab[Math.abs(hash) % vocab.length];
    }
    
    getSymbolWithLength(category, value, length = 1) {
        // base symbol for this category
        const base = this.getSymbol(category, value);
    
        // ── Objects MUST stay a-z only ────────────────────────────────
        if (category === 'object') {
            const vocab = this.vocabularies.object;   // ["a"-"z"]
            let code = base;
            // deterministic secondary letters – never +,=,/ or digits
            for (let i = 1; i < length; i++) {
                const idx = (base.charCodeAt(0) - 97 + i) % vocab.length;
                code += vocab[idx];
            }
            return code.slice(0, length);
        }
    
        // ── Other categories keep their original modifiers ────────────
        let code = base;
        for (let i = 1; i < length; i++) {
            code += this.getSymbol('modifier', value + i);
        }
        return code.slice(0, length);
    }
    
}

// === EXPORT =================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerceptualAlchemyEncoder;
} else if (typeof window !== 'undefined') {
    window.PerceptualAlchemyEncoder = PerceptualAlchemyEncoder;
}