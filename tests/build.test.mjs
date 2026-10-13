import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { build } = require('../build.js');

test('build copies static files and includes every spec in the generated config', async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'aretha-build-'));

    try {
        await build(outputDirectory);

        const generatedConfig = await readFile(join(outputDirectory, 'specs-config.js'), 'utf8');
        const copiedSpec = await readFile(join(outputDirectory, 'specs', 'github-api.yaml'), 'utf8');

        assert.match(await readFile(join(outputDirectory, 'index.html'), 'utf8'), /<title>/);
        assert.ok(generatedConfig.includes('github-api.yaml'));
        assert.ok(generatedConfig.includes('swagger-petstore.yaml'));
        assert.ok(copiedSpec.includes('openapi:'));
    } finally {
        await rm(outputDirectory, { recursive: true, force: true });
    }
});
