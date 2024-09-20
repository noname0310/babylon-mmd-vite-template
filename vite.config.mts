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
                assetFileNames: "assets/[name]-[hash].[ext]"
                // async import chunk grouping seems not working on rollup
                // https://rollupjs.org/configuration-options/#output-manualchunks
                // manualChunks: (id, { getModuleInfo }) => {
                //     if (id.includes("Shaders/") || id.includes("ShadersWGSL/")) {
                //         const dependentEntryPoints = [];

                //         const idsToHandle = new Set<string>(getModuleInfo(id)?.dynamicImporters ?? []);

                //         for (const moduleId of idsToHandle) {
                //             const moduleInfo = getModuleInfo(moduleId);
                //             if (!moduleInfo) continue;
                //             const { isEntry, dynamicImporters, importers } = moduleInfo;

                //             if (isEntry || dynamicImporters.length > 0)
                //                 dependentEntryPoints.push(moduleId);

                //             for (const importerId of importers) idsToHandle.add(importerId);
                //         }

                //         if (dependentEntryPoints.length === 1) {
                //             return dependentEntryPoints[0].split("/").slice(-1)[0].split(".")[0];
                //         }
                //         if (dependentEntryPoints.length > 1) {
                //             if (id.includes("ShadersWGSL/")) {
                //                 return "wgslShaders";
                //             } else {
                //                 return "glslShaders";
                //             }
                //         }
                //     }
                //     return null;
                // }
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
