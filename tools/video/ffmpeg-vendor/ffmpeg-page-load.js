/**
 * 与页面配套：解析 ffmpeg-core.js / wasm 的加载地址（优先同源 vendor 成对文件）。
 * 版本须与 ./ffmpeg.min.js（@ffmpeg/ffmpeg）一致。缺失或损坏时在 vendor 目录执行：fetch-ffmpeg-core.ps1
 */
(function () {
    "use strict";

    const FFMPEG_CORE_PKG_VERSION = "0.12.10";
    const UMD_PATH = "dist/umd";

    const CDN_UMD_BASES = [
        `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_CORE_PKG_VERSION}/${UMD_PATH}`,
        `https://fastly.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_CORE_PKG_VERSION}/${UMD_PATH}`,
        `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_PKG_VERSION}/${UMD_PATH}`
    ];

    const vendorDirHref = () => {
        const cur = document.currentScript && document.currentScript.src;

        if (cur) {
            return new URL(".", cur).href;
        }

        return new URL("ffmpeg-vendor/", new URL(".", window.location.href)).href;
    };

    const vendorAssetUrl = (fileName) => new URL(fileName, vendorDirHref()).href;

    const isWasmMagic = (u8) =>
        u8.length >= 4 && u8[0] === 0x00 && u8[1] === 0x61 && u8[2] === 0x73 && u8[3] === 0x6d;

    /**
     * 用流只读前 n 字节，避免 Range 被中间层改写导致魔数误判。
     */
    const peekUrlPrefix = async (url, n) => {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-store",
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}：${url}`);
        }

        if (!response.body || typeof response.body.getReader !== "function") {
            const all = new Uint8Array(await response.arrayBuffer());

            return all.subarray(0, Math.min(n, all.length));
        }

        const reader = response.body.getReader();
        const out = new Uint8Array(n);
        let filled = 0;

        while (filled < n) {
            const { done, value } = await reader.read();

            if (done || !value || !value.length) {
                break;
            }

            const take = Math.min(value.length, n - filled);
            out.set(value.subarray(0, take), filled);
            filled += take;
        }

        try {
            await reader.cancel();
        } catch {
            // ignore
        }

        return out.subarray(0, filled);
    };

    const probeScriptReachable = async (url) => {
        let response = await fetch(url, {
            method: "HEAD",
            mode: "cors",
            cache: "no-store",
            credentials: "omit"
        }).catch(() => null);

        if (response && response.ok) {
            return;
        }

        response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-store",
            credentials: "omit",
            headers: { Range: "bytes=0-0" }
        }).catch(() => null);

        if (response && (response.ok || response.status === 206)) {
            return;
        }

        throw new Error(`无法访问 ffmpeg-core.js：${url}`);
    };

    const verifyWasmMagic = async (wasmUrl) => {
        const prefix = await peekUrlPrefix(wasmUrl, 8);

        if (!isWasmMagic(prefix)) {
            throw new Error(
                `wasm 魔数校验失败（期望 WebAssembly 文件头）。若为拦截页/脚本替换，请关闭 Ajax Modifier 等扩展或使用下方「本地 vendor」放置成对文件。URL：${wasmUrl}`
            );
        }
    };

    const tryPair = async (coreURL, wasmURL, label) => {
        await probeScriptReachable(coreURL);
        await verifyWasmMagic(wasmURL);

        return { coreURL, wasmURL, label };
    };

    /**
     * @returns {Promise<{ coreURL: string, wasmURL: string, label: string }>}
     */
    const resolveFfmpegCoreUrls = async () => {
        const localJs = vendorAssetUrl("ffmpeg-core.js");
        const localWasm = vendorAssetUrl("ffmpeg-core.wasm");

        try {
            return await tryPair(localJs, localWasm, "同源 ffmpeg-vendor（本地成对）");
        } catch {
            // 本地通常未放 wasm（体积大），继续试 CDN
        }

        const errors = [];

        for (let i = 0; i < CDN_UMD_BASES.length; i += 1) {
            const base = CDN_UMD_BASES[i];
            const coreURL = `${base}/ffmpeg-core.js`;
            const wasmURL = `${base}/ffmpeg-core.wasm`;
            const label = `CDN #${i + 1}（${base.replace(/^https?:\/\//, "")}）`;

            try {
                return await tryPair(coreURL, wasmURL, label);
            } catch (e) {
                errors.push(String(e && e.message ? e.message : e));
            }
        }

        throw new Error(
            `所有镜像均无法通过校验。\n${errors.map((t, j) => `${j + 1}. ${t}`).join("\n")}\n请在 tools/video/ffmpeg-vendor/ 下运行 fetch-ffmpeg-core.ps1（或从 npm @ffmpeg/core@${FFMPEG_CORE_PKG_VERSION}/dist/umd 复制成对文件）后刷新。`
        );
    };

    const formatFfmpegLoadFailure = (err) => {
        let msg = String(err && err.message ? err.message : err);

        if (/signature mismatch|function signature mismatch/i.test(msg)) {
            msg +=
                " 多为 core.js 与 wasm 版本不一致。请在 ffmpeg-vendor 目录运行 fetch-ffmpeg-core.ps1 下载与 @ffmpeg/ffmpeg 匹配的 @ffmpeg/core，或关闭 Ajax Modifier 等扩展后 Ctrl+F5。";
        }

        return msg;
    };

    window.FFmpegPageLoad = {
        FFMPEG_CORE_PKG_VERSION,
        resolveFfmpegCoreUrls,
        formatFfmpegLoadFailure
    };
})();
