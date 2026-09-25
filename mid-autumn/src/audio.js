function buildAudio(sr) { const n = Math.ceil(DUR * sr); return [new Float32Array(n), new Float32Array(n)]; }
