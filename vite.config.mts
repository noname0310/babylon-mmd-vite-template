import basicSsl from "@vitejs/plugin-basic-ssl";
import { resolve } from "path";
import { defineConfig, normalizePath } from "vite";
import checker from "vite-plugin-checker";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: normalizePath(resolve(__dirname, "src/index.html")),
            output: {
                entryFileNames: "index.js",
                chunkFileNames: "chunks/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
                // https://rollupjs.org/configuration-options/#output-manualchunks
                manualChunks: (id) => {
                    if (id.includes("Shaders/")) {
                        return "glslShaders";
                    } else if (id.includes("ShadersWGSL/")) {
                        return "wgslShaders";
                    }
                    return null;
                }
            }
        },
        modulePreload: false
    },
    resolve: {
        alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "@": normalizePath(resolve(__dirname, "src"))
        }
    },
    plugins: [
        basicSsl(),
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(resolve(__dirname, "res/*")),
                    dest: "res"
                }
            ]
        }),
        checker({
            typescript: true,
            eslint: {
                lintCommand: "eslint --ext .ts,.tsx ."
            }
        })
    ],
    optimizeDeps: {
        exclude: [
            // see https://github.com/vitejs/vite/issues/8427
            "@babylonjs/havok",
            "babylon-mmd"
        ]
    },
    server: {
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Cross-Origin-Opener-Policy": "same-origin",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Cross-Origin-Embedder-Policy": "require-corp"
        }
    }
});
