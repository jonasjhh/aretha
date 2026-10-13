const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

async function build(outputDirectory = 'dist') {
    console.log('🔧 Building API specs viewer...');

    // Clean and create dist directory
    await fs.remove(outputDirectory);
    await fs.ensureDir(outputDirectory);
    await fs.ensureDir(path.join(outputDirectory, 'specs'));

    // Copy static files
    await fs.copy('src/index.html', path.join(outputDirectory, 'index.html'));
    await fs.copy('src/style.css', path.join(outputDirectory, 'style.css'));
    await fs.copy('src/script.js', path.join(outputDirectory, 'script.js'));

    // Copy all spec files
    const specFiles = glob.sync('specs/**/*.{yaml,yml,json}');
    console.log(`📄 Found ${specFiles.length} spec files:`);

    const specList = [];

    for (const specFile of specFiles) {
        const filename = path.basename(specFile);
        const relativePath = path.relative('specs', specFile);

        // Copy the spec file
        await fs.copy(specFile, path.join(outputDirectory, 'specs', relativePath));

        // Generate display name
        const displayName = filename
            .replace(/\.(yaml|yml|json)$/i, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());

        specList.push({
            filename: relativePath,
            displayName: displayName,
            path: `./specs/${relativePath}`,
        });

        console.log(`  ✓ ${filename} -> ${displayName}`);
    }

    // Generate specs configuration
    const configContent = `// Auto-generated specs configuration
window.SPECS_CONFIG = ${JSON.stringify(specList, null, 2)};`;

    await fs.writeFile(path.join(outputDirectory, 'specs-config.js'), configContent);

    console.log(`✅ Build complete! Generated ${specList.length} spec entries.`);
    console.log(`📂 Output directory: ./${outputDirectory}`);
}

if (require.main === module) {
    build().catch(console.error);
}

module.exports = { build };
