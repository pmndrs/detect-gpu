import { defineBuildConfig } from 'unbuild';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
    esbuild: {
      target: 'es2020',
      minify: true,
    },
  },
  hooks: {
    'build:done': () => {
      // Copy benchmarks directory to dist
      const srcDir = 'benchmarks';
      const destDir = 'dist/benchmarks';

      if (!existsSync(srcDir)) {
        console.log('⚠ Benchmarks directory not found, skipping copy');
        return;
      }

      mkdirSync(destDir, { recursive: true });

      const files = readdirSync(srcDir);
      for (const file of files) {
        copyFileSync(join(srcDir, file), join(destDir, file));
      }

      console.log('✓ Copied benchmarks to dist/benchmarks');
    },
  },
});
