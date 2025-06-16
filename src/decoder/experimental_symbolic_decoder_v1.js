// symbolic_decoder_v2.js
// -------------------------------------------------------------
// COMPLETE SYMBOLIC PERCEPTUAL DECODER
// -------------------------------------------------------------
//  Decodes a 16‑32 character perceptual code produced by
//  SymbolicPerceptualEncoder back into a structured scene model
//  with narrative, spatial and emotional interpretations.
//  All previous stub methods now contain functional logic.
// -------------------------------------------------------------

class SymbolicPerceptualDecoder {
    constructor(options = {}) {
        this.decodingMode = options.mode   || 'stable';      // stable | dreamlike | npc
        this.culture      = options.culture|| 'universal';
        this.bias         = options.bias   || {};
        this.memories     = options.memory || [];
        this.vocab = {
            scene : 'ABCDEFGHIJ',
            objects : 'KLMNOPQRST',
            spatial : 'UVWXYZ',
            moodDigits : '012345'
        };
        this.moodList = ['neutral','bright','tense','foreboding','peaceful','melancholic','joyful','hostile','mysterious','whimsical'];
    }

    // === PUBLIC =============================================================
    /**
     * Decodes perceptual string into rich scene description.
     * @param {String} code 16‑32 chars, A‑Z0‑9
     * @param {Object} [meta]
     * @return {Object}
     */
    decode(code, meta = {}){
        this.#validate(code);
        const seg = this.#segment(code);
        const model = {
            environment   : this.#decodeEnvironment(seg.scene),
            objects       : this.#decodeObjects(seg.objects),
            spatial       : this.#decodeSpatial(seg.spatial),
            atmosphere    : this.#decodeAtmosphere(seg.details, meta),
        };
        model.emotionalTone = this.#calcEmotionalTone(model.atmosphere, seg.details);
        model.memoryEchoes  = this.#memoryEchoes(code);
        const uncertainty   = 1 - (code.replace(/A/g,'').length / code.length);
        model.uncertainty   = uncertainty;

        return {
            sceneModel : model,
            reconstruction : {
                narrative      : this.#narrative(model),
                sceneGraph     : this.#sceneGraph(model),
                renderingHints : this.#renderHints(model)
            },
            confidence  : 1-uncertainty
        };
    }

    // === SEGMENTATION =======================================================
    #segment(code){
        return {
            scene   : code.slice(0,4),
            objects : code.slice(4, Math.min(16,code.length)),
            spatial : code.slice(16, Math.min(22,code.length)),
            details : code.slice(22)
        };
    }

    // === LOW LEVEL DECODERS =================================================
    #decodeEnvironment(sceneCode){
        const map = {
            'A':'outdoor', 'B':'indoor','C':'portrait','D':'architectural','E':'natural',
            'F':'urban','G':'artistic','H':'document','I':'pattern','J':'complex'
        };
        const type = map[sceneCode[0]] || 'unknown';
        return { type, lighting : this.#lightingFromLetter(sceneCode[1]) };
    }

    #decodeObjects(objCode){
        const objMap = {
            'K':'person','L':'vehicle','M':'building','N':'vegetation','O':'furniture',
            'P':'technology','Q':'animal','R':'consumable','S':'textile','T':'tool'
        };
        const objs=[];
        for(let i=0;i<objCode.length;i++){
            const ch = objCode[i];
            if(ch==='A') continue;
            const type = objMap[ch] || 'unknown';
            const size = ['tiny','small','medium','large','huge'][i%5];
            const conf = 0.6 + ( (ch.charCodeAt(0)%10)/50); // deterministic
            const pos  = ['foreground','mid‑ground','background'][i%3];
            objs.push({type,size,confidence:conf,position:pos});
        }
        return objs;
    }

    #decodeSpatial(spatCode){
        const spatialLetters=this.vocab.spatial;
        const distLetter=spatCode[0]||'U';
        const focLetter =spatCode[1]||'U';
        const warmLetter=spatCode[2]||'U';
        const richness = spatCode[3]||'0';
        return {
            distribution : ['balanced','left‑heavy','right‑heavy','top‑heavy','bottom‑heavy','complex'][ spatialLetters.indexOf(distLetter)%6 ],
            focus        : ['center','left','right','upper','lower'][ spatialLetters.indexOf(focLetter)%5 ],
            warmthHint   : (spatialLetters.indexOf(warmLetter)%6)/5,
            richnessHint : parseInt(richness,36)%6
        };
    }

    #decodeAtmosphere(detailCode,meta){
        if(!detailCode) detailCode='0';
        const mood   = this.moodList[ parseInt(detailCode[0],36)%this.moodList.length ];
        const warm   = meta.dominantColors? this.#calcWarm(meta.dominantColors):0.5;
        return { mood, warmth:warm };
    }

    #calcEmotionalTone(atmos,detail){
        const valence = atmos.warmth;
        const arousal = (detail.length/10);
        return { valence:Math.min(1,valence), arousal:Math.min(1,arousal) };
    }

    // === SUPPORT ============================================================
    #validate(code){
        if(!/^[A-Z0-9]{16,32}$/.test(code)) throw new Error('Invalid code format');
    }

    #lightingFromLetter(ch){
        const idx = (ch||'A').charCodeAt(0)-65;
        return ['natural','warm','focused','harsh','diffuse','mixed','dramatic','flat','even','variable'][idx%10];
    }

    #calcWarm(colors){
        let r=0,b=0;
        colors.forEach(c=>{r+=c.r;b+=c.b;});
        return (r - b)/(colors.length*255*2)+0.5;
    }

    #memoryEchoes(code){
        return this.memories.filter(m=>m.code && m.code.slice(0,4)===code.slice(0,4)).slice(0,3);
    }

    #narrative(m){
        const objDesc = m.objects.length? ' You notice '+m.objects.map(o=>o.type).join(', ')+'.':'';
        return `A ${m.environment.type} scene under ${m.environment.lighting} light.${objDesc} The mood feels ${m.atmosphere.mood}.`;
    }

    #sceneGraph(m){
        return {
            environment : m.environment,
            objects : m.objects.map(o=>({type:o.type,position:o.position,size:o.size})),
            focus : m.spatial.focus
        };
    }

    #renderHints(m){
        return { warmth:m.atmosphere.warmth, lighting:m.environment.lighting };
    }
}

// EXPORT
if(typeof module!=='undefined' && module.exports){
    module.exports = SymbolicPerceptualDecoder;
}else if(typeof window!=='undefined'){
    window.SymbolicPerceptualDecoder = SymbolicPerceptualDecoder;
}
