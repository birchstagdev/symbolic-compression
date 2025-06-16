// symbolic_encoder_v2.js
// -------------------------------------------------------------
// COMPLETE SYMBOLIC PERCEPTUAL ENCODER
// -------------------------------------------------------------
//  This module performs perceptual analysis on raw RGBA image
//  data (HTML Canvas ImageData or equivalent), produces a symbolic
//  code between 16‑32 characters that preserves the dominant
//  structure, colour, saliency and spatial composition of the
//  image.  All placeholder methods from the previous prototype
//  have been replaced with minimal but functional algorithms so
//  the encoder runs end‑to‑end without external dependencies.
// -------------------------------------------------------------

class SymbolicPerceptualEncoder {
    constructor() {
        this.visualVocabulary = {
            sceneTypes : 'ABCDEFGHIJ'.split(''),
            objects    : 'KLMNOPQRST'.split(''),
            spatial    : 'UVWXYZ'.split(''),
            extended   : '012345'.split('')
        };
        // Sobel kernels
        this.sobelX = [-1,0,1,-2,0,2,-1,0,1];
        this.sobelY = [-1,-2,-1,0,0,0,1,2,1];
    }

    // === PUBLIC API =========================================================
    /**
     * Encodes an ImageData object into a 16‑32 character perceptual string.
     * @param {ImageData} imageData
     * @param {Object}    [options]  { mode : 'simple'|'standard'|'extended' }
     * @returns {Object}  { code, analysis }
     */
    encode(imageData, options = {}) {
        this.#validateImage(imageData);

        // 1. ANALYSIS PIPELINE
        const edge      = this.#analyseEdges(imageData);
        const colour    = this.#analyseColours(imageData);
        const shapes    = this.#detectShapes(edge.map, imageData.width, imageData.height);
        const spatial   = this.#analyseSpatial(edge.map, imageData.width, imageData.height);
        const complexity= this.#assessComplexity(edge, colour, shapes);

        // 2. DETERMINE SYMBOL BUDGET
        const level   = options.mode || complexity.level;           // user override allowed
        const budget  = level === 'simple'   ? 16 :
                        level === 'extended' ? 32 : 26;

        // 3. SYMBOLIC ENCODING
        let code = '';
        code += this.#encodeSceneContext(edge, colour, shapes);                 // 4 chars
        const objectBudget = Math.max(0, Math.floor((budget - 8) * 0.6));
        code += this.#encodeObjects(shapes, objectBudget);                      // variable
        const remain = budget - code.length;
        code += this.#encodeSpatialAndColour(spatial, colour, remain);          // fill remainder

        // 4. PAD
        while (code.length < budget) code += 'A';
        code = code.substring(0, budget);

        return { code, analysis : { edge, colour, shapes, spatial, complexity } };
    }

    // === ANALYSIS STAGE =====================================================
    #analyseEdges(imageData) {
        const { width, height, data } = imageData;
        const map  = new Uint8Array(width * height);   // 0‑255 edge magnitude
        let totalEdge = 0;
        // Sobel gradient magnitude
        for (let y = 1; y < height-1; y++) {
            for (let x = 1; x < width-1; x++) {
                let gx = 0, gy = 0;
                for (let k = 0; k < 9; k++) {
                    const px = x + (k % 3) - 1;
                    const py = y + Math.floor(k/3) - 1;
                    const idx = (py * width + px) * 4;
                    // fast luma approximation
                    const lum = 0.2126*data[idx] + 0.7152*data[idx+1] + 0.0722*data[idx+2];
                    gx += lum * this.sobelX[k];
                    gy += lum * this.sobelY[k];
                }
                const mag = Math.min(255, Math.sqrt(gx*gx + gy*gy));
                map[y*width + x] = mag;
                totalEdge += mag;
            }
        }
        const edgePixelCount = [...map].filter(v=>v>64).length;
        const density = edgePixelCount / (width * height);

        // Orientation histogram (8 bins)
        const bins = new Array(8).fill(0);
        for (let y = 1; y < height-1; y+=2) {     // sample every second row for speed
            for (let x = 1; x < width-1; x+=2) {
                const idx = y*width + x;
                if (map[idx] <= 64) continue;
                // tiny gradient re‑compute for angle (cheap)
                const dx = map[idx+1] - map[idx-1];
                const dy = map[idx+width] - map[idx-width];
                let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                if (angle < 0) angle += 180;              // 0‑180
                const bin = Math.floor(angle / 22.5) % 8;
                bins[bin]++;
            }
        }
        const dominantBin = bins.indexOf(Math.max(...bins));

        return { density, dominantBin, map };
    }

    #analyseColours(imageData) {
        const { data } = imageData;
        // Reduce RGB to 5‑bit buckets per channel to approximate LAB uniqueness
        const colourSet = new Set();
        for (let i = 0; i < data.length; i += 16) {   // sample ~25% pixels
            const r = data[i]   >> 3;
            const g = data[i+1] >> 3;
            const b = data[i+2] >> 3;
            colourSet.add((r<<10)|(g<<5)|b);
        }
        const unique = colourSet.size;
        // crude warmth estimation based on r‑b balance
        let rSum=0, gSum=0, bSum=0, count=0;
        for (let i=0;i<data.length;i+=32){
            rSum += data[i]; gSum += data[i+1]; bSum += data[i+2]; count++;
        }
        const warmth = (rSum - bSum) / (count*255*2) + 0.5; // 0‑1
        return { uniqueColorCount: unique, warmth };
    }

    #detectShapes(edgeMap, width, height) {
        // Very naive connected‑component labelling on down‑sampled grid
        const visited = new Uint8Array(width * height);
        const shapes = [];
        const threshold = 100;
        const stack = [];
        for (let y=0;y<height;y+=4){
            for (let x=0;x<width;x+=4){
                const idx = y*width + x;
                if (edgeMap[idx] < threshold || visited[idx]) continue;
                // start floodfill
                let minX=x,maxX=x,minY=y,maxY=y,pixCount=0;
                stack.length=0; stack.push(idx);
                visited[idx]=1;
                while(stack.length){
                    const id = stack.pop();
                    const px = id % width;
                    const py = Math.floor(id / width);
                    minX=Math.min(minX,px); maxX=Math.max(maxX,px);
                    minY=Math.min(minY,py); maxY=Math.max(maxY,py);
                    pixCount++;
                    // 4‑neigh
                    const neigh = [id-1, id+1, id-width, id+width];
                    neigh.forEach(n=>{
                        if(n>0 && n<edgeMap.length && !visited[n] && edgeMap[n]>=threshold){
                            visited[n]=1; stack.push(n);
                        }
                    });
                }
                const area = (maxX-minX+1)*(maxY-minY+1);
                shapes.push({type:'generic',area,pixels:pixCount});
            }
        }
        shapes.sort((a,b)=>b.area-a.area);
        return { shapes };
    }

    #analyseSpatial(edgeMap,width,height){
        // quadrant distribution based on edge magnitude
        const q = [0,0,0,0];
        for(let y=0;y<height;y+=2){
            for(let x=0;x<width;x+=2){
                const idx = y*width+x;
                const mag = edgeMap[idx];
                if(mag<64) continue;
                const quad = (y<height/2?0:2) + (x<width/2?0:1);
                q[quad]+=1;
            }
        }
        const total = q.reduce((a,b)=>a+b,0) || 1;
        const focusIdx = q.indexOf(Math.max(...q));
        return { quadrantDistribution:q, focusQuadrantIndex:focusIdx, totalEdgePoints:total };
    }

    #assessComplexity(edge,colours,shapes){
        const edgeScore = edge.density;
        const colourScore = Math.min(1, colours.uniqueColorCount / 1024);
        const shapeScore = Math.min(1, shapes.shapes.length / 100);
        const score = (edgeScore + colourScore + shapeScore)/3;
        const level = score < 0.3 ? 'simple' : score > 0.7 ? 'extended':'standard';
        return { score, level };
    }

    // === SYMBOL ENCODING STAGE =============================================
    #encodeSceneContext(edge,colours,shapes){
        const vv = this.visualVocabulary.sceneTypes;
        const letter1 = vv[Math.min(edge.dominantBin, vv.length-1)];
        const letter2 = vv[Math.min(Math.floor(colours.uniqueColorCount/128)%vv.length, vv.length-1)];
        const letter3 = vv[Math.min(shapes.shapes.length % vv.length, vv.length-1)];
        const complexityMap = { simple:'Q', standard:'R', extended:'S' };
        const letter4 = complexityMap[ this.#assessComplexity(edge,colours,shapes).level ] || 'R';
        return letter1+letter2+letter3+letter4;
    }

    #encodeObjects(shapes,budget){
        const vv = this.visualVocabulary.objects;
        let code = '';
        shapes.shapes.slice(0,budget).forEach((s,i)=>{
            const letter = vv[i % vv.length];
            code += letter;
        });
        while(code.length<budget) code+='A';
        return code.substring(0,budget);
    }

    #encodeSpatialAndColour(spatial, colours, budget){
        const vs = this.visualVocabulary.spatial;
        let code = '';
        // first char : focus quadrant
        code += vs[ spatial.focusQuadrantIndex % vs.length ];
        // second char : distribution uniformity
        const variance = spatial.quadrantDistribution.reduce((v,c)=>v+Math.abs(c - spatial.totalEdgePoints/4),0)/spatial.totalEdgePoints;
        code += vs[ Math.min(vs.length-1, Math.floor( variance * vs.length )) ];
        // third char : warmth
        code += vs[ Math.min(vs.length-1, Math.floor(colours.warmth * vs.length )) ];
        // rest : colour richness bucket
        const richness = Math.min(5, Math.floor(colours.uniqueColorCount / 512));
        code += this.visualVocabulary.extended[richness];
        while(code.length<budget) code+='U';
        return code.substring(0,budget);
    }

    // === UTILITIES ==========================================================
    #validateImage(img){
        if(!img || !img.data || !img.width || !img.height)
            throw new Error('Invalid ImageData supplied');
        if(img.width < 8 || img.height < 8)
            throw new Error('Image too small (min 8x8)');
    }
}

//EXPORT
if(typeof module !== 'undefined' && module.exports){
    module.exports = SymbolicPerceptualEncoder;
}else if(typeof window!=='undefined'){
    window.SymbolicPerceptualEncoder = SymbolicPerceptualEncoder;
}
