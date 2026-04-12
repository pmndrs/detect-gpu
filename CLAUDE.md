# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
# Install dependencies
yarn

# Build the library (outputs to dist/)
yarn build

# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run a single test file
yarn test -- test/index.test.ts

# Run a specific test by name
yarn test -- -t "Intel UHD Graphics 620"

# Lint and auto-fix
yarn lint

# Update GPU benchmark data from gfxbench.com
yarn update-benchmarks
```

## Architecture

detect-gpu is a library that classifies GPUs into performance tiers (0-3) based on benchmark data from gfxbench.com. It works by:

1. **GPU Detection**: Gets the GPU renderer string via WebGL's `WEBGL_debug_renderer_info` extension
2. **Renderer Cleaning**: Normalizes renderer strings (removes ANGLE prefix, driver info, etc.) in `src/internal/cleanRenderer.ts`
3. **GPU Deobfuscation**: Handles Apple's privacy-masked GPU strings (e.g., "Apple GPU") by deducing the actual GPU from WebGL capabilities in `src/internal/deobfuscateRenderer.ts` and `src/internal/deobfuscateAppleGPU.ts`
4. **Benchmark Matching**: Uses Levenshtein distance to find the closest matching GPU in benchmark data, considering version extraction (`src/internal/getGPUVersion.ts`)
5. **Tier Assignment**: Assigns tier 0-3 based on FPS thresholds (default: 0, 15, 30, 60)

### Benchmark Data Structure

Benchmark JSON files are stored in `benchmarks/` with naming convention `{m|d}-{gpu-type}.json`:

- `m-` prefix for mobile, `d-` prefix for desktop
- Types: `adreno`, `apple`, `mali`, `mali-t`, `nvidia`, `powervr`, `samsung`, `intel`, `amd`, `radeon`, `geforce`
- Special case: `m-apple-ipad.json` for iPad-specific data

Each entry format: `[gpu, gpuVersion, tokenizedGpu, isBlocklisted, [[width, height, fps, device?], ...]]`

### Key Internal Modules

- `blocklistedGPUS.ts`: List of GPUs that should return tier 0 (software renderers, very old GPUs)
- `deviceInfo.ts`: Browser and device detection (isMobile, isIpad, isSafari12, isFirefox)
- `ssr.ts`: Server-side rendering detection

## Testing

Tests use jsdom environment and load benchmark data directly from `benchmarks/` directory. The test suite validates GPU tier classification against known GPU renderer strings in `test/data.ts`.

Debug mode: `DEBUG=true yarn test` prints detailed tier results.
