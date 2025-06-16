class SymbolValidator {
    constructor() {
        this.patterns = {
            scene: /^[A-Z]{3,4}$/,
            objects: /^[a-z0-9]{0,14}$/,
            spatial: /^[WXYZ01234!@#$%A-Z]{4,8}$/,
            emotion: /^[A-Z0-9]{3,6}$/,
            checksum: /^[A-Z]$/
        };
    }
    
    validate(code) {
        if (!code || code.length < 16 || code.length > 33) return false;
        
        // Basic character set validation
        if (!/^[A-Za-z0-9!@#$%αβγδ]+$/.test(code)) return false;
        
        // Verify checksum
        const checksum = code[code.length - 1];
        const payload = code.slice(0, -1);
        const expectedChecksum = this.calculateChecksum(payload);
        
        return checksum === expectedChecksum;
    }
    
    calculateChecksum(payload) {
        let sum = 0;
        for (let i = 0; i < payload.length; i++) {
            sum += payload.charCodeAt(i) * (i + 1);
        }
        return String.fromCharCode(65 + (sum % 26));
    }
}

class PerceptualSystem {
    constructor(options = {}) {
        this.encoder = new PerceptualAlchemyEncoder({
            mode: options.encoderMode || 'balanced',
            culture: options.culture || 'universal',
            debug: options.debug || false
        });
        
        this.decoder = new PerceptualAlchemyDecoder({
            mode: options.decoderMode || 'stable',
            culture: options.culture || 'universal'
        });
        
        this.validator = new SymbolValidator();
        this.memoryBuffer = [];
        this.maxMemorySize = options.maxMemorySize || 100;
    }
    
    encode(imageData, context = {}) {
        try {
            const result = this.encoder.encode(imageData, context);
            
            if (!this.validator.validate(result.code)) {
                throw new Error(`Invalid encoding produced: ${result.code}`);
            }
            
            // Add to memory buffer
            this.addToMemory({
                code: result.code,
                timestamp: Date.now(),
                context,
                emotion: result.analysis.emotion.current
            });
            
            return result;
        } catch (error) {
            console.error('Encoding failed:', error);
            throw error;
        }
    }
    
    decode(code, context = {}) {
        try {
            if (!this.validator.validate(code)) {
                console.warn(`Invalid code format: ${code}`);
                return this.decoder.generateFallbackExperience(code);
            }
            
            // Pass memory buffer to decoder for resonance
            this.decoder.memoryBuffer = this.memoryBuffer;
            
            return this.decoder.decode(code, context);
        } catch (error) {
            console.error('Decoding failed:', error);
            return this.decoder.generateFallbackExperience(code);
        }
    }
    
    addToMemory(entry) {
        this.memoryBuffer.push(entry);
        
        // Maintain buffer size
        if (this.memoryBuffer.length > this.maxMemorySize) {
            this.memoryBuffer.shift();
        }
    }
    
    process(imageData, context = {}) {
        const encoded = this.encode(imageData, context);
        const decoded = this.decode(encoded.code, context);
        
        return {
            encoded,
            decoded,
            isReliable: decoded.metadata.confidence >= 0.6
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PerceptualSystem, SymbolValidator };
} else if (typeof window !== 'undefined') {
    window.PerceptualSystem = PerceptualSystem;
    window.SymbolValidator = SymbolValidator;
}