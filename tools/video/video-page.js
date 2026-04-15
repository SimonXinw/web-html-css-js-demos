/* 生成-压缩视频.html 页面逻辑（依赖：bootstrap、ffmpeg-vendor、FFmpegPageLoad） */
"use strict";

        const parseExtraArgs = (raw) => {
            const s = String(raw || "").trim();
            if (!s) {
                return [];
            }

            const out = [];
            let cur = "";
            let quote = "";

            for (let i = 0; i < s.length; i += 1) {
                const ch = s[i];

                if (quote) {
                    if (ch === quote) {
                        quote = "";
                        continue;
                    }

                    cur += ch;
                    continue;
                }

                if (ch === "\"" || ch === "'") {
                    quote = ch;
                    continue;
                }

                if (/\s/.test(ch)) {
                    if (cur) {
                        out.push(cur);
                        cur = "";
                    }

                    continue;
                }

                cur += ch;
            }

            if (cur) {
                out.push(cur);
            }

            return out;
        };

        const getExtensionLower = (filename) => {
            const idx = filename.lastIndexOf(".");
            if (idx <= 0) {
                return "bin";
            }

            return filename.slice(idx + 1).toLowerCase();
        };

        const buildDownloadName = (originalName, outExtLower) => {
            const dot = originalName.lastIndexOf(".");
            const base = dot > 0 ? originalName.slice(0, dot) : originalName;
            const inExt = dot > 0 ? originalName.slice(dot + 1).toLowerCase() : "";

            if (inExt && inExt === outExtLower) {
                return `${base}_compressed.${outExtLower}`;
            }

            return `${base}.${outExtLower}`;
        };

        const escapeHtml = (s) => String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");

        const formatFileSize = (bytes) => {
            if (!Number.isFinite(bytes) || bytes <= 0) {
                return "0 B";
            }

            const units = ["B", "KB", "MB", "GB"];
            let v = bytes;
            let u = 0;

            while (v >= 1024 && u < units.length - 1) {
                v /= 1024;
                u += 1;
            }

            return `${v.toFixed(u === 0 ? 0 : 2)} ${units[u]}`;
        };

        const isProbablyVideoFile = (file) => {
            if (file.type && file.type.startsWith("video/")) {
                return true;
            }

            const ext = getExtensionLower(file.name);
            return ["mp4", "webm", "mkv", "mov", "avi", "m4v", "mpeg", "mpg", "wmv", "flv", "ogv"].includes(ext);
        };

        const gcdInt = (a, b) => {
            let x = Math.abs(a);
            let y = Math.abs(b);

            while (y) {
                const t = y;
                y = x % y;
                x = t;
            }

            return x || 1;
        };

        /** 由像素宽高推算最简整数比，如 1920×1080 → 16∶9 */
        const simplifyAspectRatioLabel = (w, h) => {
            if (!w || !h) {
                return "";
            }

            const g = gcdInt(w, h);
            const rw = Math.round(w / g);
            const rh = Math.round(h / g);

            return `${rw}∶${rh}`;
        };

        const RESOLUTION_MODE_DEFAULT_LABELS = {
            original: "保持原始像素（与源同宽高）（页面初始默认）",
            cap1080: "限制在 1080p 以内（常用）",
            cap720: "限制在 720p 以内（常用）",
            cap480: "限制在 480p 以内（常用）"
        };

        const RATE_CONTROL_VBR_OPTION_DEFAULT_TEXT =
            "平均视频码率 Mbps（页面初始默认；选源文件后自动填入与源一致的估算 Mbps）";

        class VideoProcessor {
            constructor() {
                this.currentFile = null;
                this.lastSourceMeta = null;
                this.ffmpeg = null;
                this.ffmpegLoadError = null;
                this.lastObjectUrls = [];
                this.generateOutputBlobUrl = null;
                this.generateOutputFilename = "";

                this.initializeEventListeners();
                this.bindGeneratePreviewModal();
                this.bindCompressTemplateButtons();
                this.bindRateControlHandlers();
                this.initFfmpeg();
                this.refreshCompressProSnapshot();
            }

            revokeLastUrls() {
                for (const u of this.lastObjectUrls) {
                    try {
                        URL.revokeObjectURL(u);
                    } catch {
                        // ignore
                    }
                }

                this.lastObjectUrls = [];
            }

            trackObjectUrl(url) {
                this.lastObjectUrls.push(url);
            }

            setFfmpegUiLoading(message, pct) {
                const bar = document.getElementById("ffmpegLoadProgressBar");
                const detail = document.getElementById("ffmpegLoadDetail");
                const badge = document.getElementById("ffmpegStateBadge");
                const text = document.getElementById("ffmpegStateText");
                const retry = document.getElementById("retryFfmpegBtn");

                bar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
                detail.textContent = message || "";
                badge.className = "badge rounded-pill bg-warning text-dark";
                badge.innerHTML = `<i class="fas fa-download me-1"></i>FFmpeg：加载中`;
                text.textContent = "正在初始化本机 ffmpeg-vendor 引擎…";
                retry.style.display = "none";
            }

            setFfmpegUiReady() {
                const bar = document.getElementById("ffmpegLoadProgressBar");
                const detail = document.getElementById("ffmpegLoadDetail");
                const badge = document.getElementById("ffmpegStateBadge");
                const text = document.getElementById("ffmpegStateText");
                const retry = document.getElementById("retryFfmpegBtn");

                bar.style.width = "100%";
                detail.textContent = "FFmpeg.wasm 已就绪，可以开始转码。";
                badge.className = "badge rounded-pill bg-success";
                badge.innerHTML = `<i class="fas fa-check me-1"></i>FFmpeg：就绪`;
                text.textContent = "引擎加载完成（单线程 core，适合大多数浏览器）。";
                retry.style.display = "none";
                document.getElementById("compressBtn").disabled = false;
            }

            setFfmpegUiFailed(err) {
                const bar = document.getElementById("ffmpegLoadProgressBar");
                const detail = document.getElementById("ffmpegLoadDetail");
                const badge = document.getElementById("ffmpegStateBadge");
                const text = document.getElementById("ffmpegStateText");
                const retry = document.getElementById("retryFfmpegBtn");

                bar.style.width = "0%";
                detail.textContent = window.FFmpegPageLoad
                    ? window.FFmpegPageLoad.formatFfmpegLoadFailure(err)
                    : String(err && err.message ? err.message : err);
                badge.className = "badge rounded-pill bg-danger";
                badge.innerHTML = `<i class="fas fa-triangle-exclamation me-1"></i>FFmpeg：失败`;
                text.textContent = "压缩模块不可用：可运行 tools/video/ffmpeg-vendor/fetch-ffmpeg-core.ps1 下载成对 core；并关闭会改写请求的扩展（如 Ajax Modifier）后重试。";
                retry.style.display = "inline-block";
                document.getElementById("compressBtn").disabled = true;
            }

            async initFfmpeg() {
                const retryBtn = document.getElementById("retryFfmpegBtn");
                retryBtn.onclick = () => {
                    this.initFfmpeg();
                };

                try {
                    if (this.ffmpeg && typeof this.ffmpeg.terminate === "function") {
                        try {
                            this.ffmpeg.terminate();
                        } catch {
                            // ignore
                        }
                    }

                    this.ffmpeg = null;

                    document.getElementById("compressBtn").disabled = true;

                    if (!window.FFmpegWASM || !window.FFmpegUtil) {
                        throw new Error("FFmpeg 脚本未加载成功（缺少 FFmpegWASM / FFmpegUtil 全局对象）");
                    }

                    const { FFmpeg } = window.FFmpegWASM;

                    this.ffmpegLoadError = null;
                    this.setFfmpegUiLoading("准备初始化 FFmpeg…", 2);

                    const ffmpeg = new FFmpeg();
                    this.ffmpeg = ffmpeg;

                    if (!window.FFmpegPageLoad || typeof window.FFmpegPageLoad.resolveFfmpegCoreUrls !== "function") {
                        throw new Error("缺少 ./ffmpeg-vendor/ffmpeg-page-load.js（请确认与 HTML 同目录引用）");
                    }

                    this.setFfmpegUiLoading("解析 ffmpeg-core 加载地址（本地优先，否则多 CDN 镜像）…", 6);

                    const { coreURL, wasmURL, label } = await window.FFmpegPageLoad.resolveFfmpegCoreUrls();
                    const coreSourceLabel = label;

                    document.getElementById("ffmpegLoadDetail").textContent = `来源：${coreSourceLabel}`;

                    this.setFfmpegUiLoading("正在加载 ffmpeg-core（大 wasm 首次较慢）…", 25);

                    let lastCoreLog = "";

                    ffmpeg.on("log", ({ message }) => {
                        lastCoreLog = message;
                        const detail = document.getElementById("ffmpegLoadDetail");
                        const badge = document.getElementById("ffmpegStateBadge");

                        if (detail && badge && badge.textContent.includes("加载中")) {
                            detail.textContent = message;
                        }

                        const line = document.getElementById("compressLogLine");

                        if (line && document.getElementById("compressProgress").style.display !== "none") {
                            line.textContent = message;
                        }
                    });

                    ffmpeg.on("progress", ({ progress }) => {
                        const bar = document.getElementById("compressProgressBar");

                        if (!bar) {
                            return;
                        }

                        const wrap = document.getElementById("compressProgress");

                        if (!wrap || wrap.style.display === "none") {
                            return;
                        }

                        const pct = Math.max(0, Math.min(100, (progress || 0) * 100));
                        bar.style.width = `${pct}%`;
                    });

                    await ffmpeg.load({ coreURL, wasmURL });

                    const loadDetail = document.getElementById("ffmpegLoadDetail");
                    loadDetail.textContent = lastCoreLog ? lastCoreLog : `来源：${coreSourceLabel}`;

                    this.setFfmpegUiReady();
                } catch (error) {
                    this.ffmpeg = null;
                    this.ffmpegLoadError = error;
                    console.error(error);
                    this.setFfmpegUiFailed(error);
                }
            }

            applyCompressTemplate(template) {
                const setVal = (id, value) => {
                    const el = document.getElementById(id);
                    if (!el) {
                        return;
                    }

                    el.value = String(value);
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                };

                if (template === "quality") {
                    setVal("rateControl", "crf");
                    setVal("resolutionMode", "original");
                    setVal("fpsMode", "source");
                    setVal("audioMode", "aac");
                    setVal("audioBitrateK", "192");

                    const outFmt = document.getElementById("outputFormat")?.value || "mp4";

                    if (outFmt === "webm") {
                        /** H.264 CRF 18 与 VP8/VP9 的「同等观感」不对应；压低 CRF + 最慢 libvpx 档位减轻糊感 */
                        setVal("crfValue", "14");
                        setVal("webmCpuUsed", "2");
                    } else {
                        setVal("crfValue", "18");
                        setVal("x264Preset", "slow");
                    }
                } else if (template === "balanced") {
                    setVal("rateControl", "crf");
                    setVal("crfValue", "23");
                    setVal("resolutionMode", "cap1080");
                    setVal("fpsMode", "source");
                    setVal("audioMode", "aac");
                    setVal("audioBitrateK", "128");

                    const outFmtB = document.getElementById("outputFormat")?.value || "mp4";

                    if (outFmtB === "webm") {
                        setVal("webmCpuUsed", "5");
                    } else {
                        setVal("x264Preset", "medium");
                    }
                } else if (template === "size") {
                    setVal("rateControl", "crf");
                    setVal("crfValue", "28");
                    setVal("resolutionMode", "cap720");
                    setVal("fpsMode", "24");
                    setVal("audioMode", "aac");
                    setVal("audioBitrateK", "96");

                    const outFmtS = document.getElementById("outputFormat")?.value || "mp4";

                    if (outFmtS === "webm") {
                        setVal("webmCpuUsed", "8");
                    } else {
                        setVal("x264Preset", "veryfast");
                    }
                }

                this.syncRateControlUi();
            }

            bindCompressTemplateButtons() {
                const q = document.getElementById("tplQualityBtn");
                const b = document.getElementById("tplBalancedBtn");
                const s = document.getElementById("tplSizeBtn");

                if (q) {
                    q.addEventListener("click", () => this.applyCompressTemplate("quality"));
                }

                if (b) {
                    b.addEventListener("click", () => this.applyCompressTemplate("balanced"));
                }

                if (s) {
                    s.addEventListener("click", () => this.applyCompressTemplate("size"));
                }
            }

            bindRateControlHandlers() {
                const rc = document.getElementById("rateControl");
                rc.addEventListener("change", () => this.syncRateControlUi());
                this.syncRateControlUi();
            }

            syncRateControlUi() {
                const mode = document.getElementById("rateControl").value;
                const showCrf = mode === "crf";
                document.getElementById("crfFieldWrap").style.display = showCrf ? "" : "none";
                document.getElementById("bitrateFieldWrap").style.display = showCrf ? "none" : "";
                this.refreshCompressProSnapshot();
            }

            initializeEventListeners() {
                document.getElementById("generateForm").addEventListener("submit", (e) => {
                    e.preventDefault();
                    this.generateVideo();
                });

                document.getElementById("compressForm").addEventListener("submit", (e) => {
                    e.preventDefault();
                    this.compressVideo();
                });

                const fileUploadArea = document.getElementById("fileUploadArea");
                const fileInput = document.getElementById("videoFile");

                fileUploadArea.addEventListener("click", () => fileInput.click());
                fileUploadArea.addEventListener("dragover", this.handleDragOver.bind(this));
                fileUploadArea.addEventListener("dragleave", this.handleDragLeave.bind(this));
                fileUploadArea.addEventListener("drop", this.handleDrop.bind(this));
                fileInput.addEventListener("change", this.handleFileSelect.bind(this));

                const previewBtn = document.getElementById("generatePreviewOpenBtn");

                if (previewBtn) {
                    previewBtn.addEventListener("click", () => {
                        this.openGeneratePreviewModal();
                    });
                }

                const outFmt = document.getElementById("outputFormat");

                if (outFmt) {
                    outFmt.addEventListener("change", () => this.syncWebmOptionsUi());
                    this.syncWebmOptionsUi();
                }

                const baselineBtn = document.getElementById("applySourceBaselineBtn");

                if (baselineBtn) {
                    baselineBtn.addEventListener("click", () => this.applySourceAsCompressBaseline());
                }

                const compressForm = document.getElementById("compressForm");

                if (compressForm) {
                    compressForm.addEventListener("change", () => this.refreshCompressProSnapshot());
                    compressForm.addEventListener("input", () => this.refreshCompressProSnapshot());
                }
            }

            bindGeneratePreviewModal() {
                const modalEl = document.getElementById("generatePreviewModal");
                const videoEl = document.getElementById("generatePreviewVideo");

                if (!modalEl || !videoEl) {
                    return;
                }

                modalEl.addEventListener("hidden.bs.modal", () => {
                    videoEl.pause();
                    videoEl.removeAttribute("src");
                    videoEl.load();
                });
            }

            openGeneratePreviewModal() {
                const url = this.generateOutputBlobUrl;

                if (!url) {
                    return;
                }

                const videoEl = document.getElementById("generatePreviewVideo");
                const titleEl = document.getElementById("generatePreviewModalLabel");
                const modalEl = document.getElementById("generatePreviewModal");

                if (!videoEl || !modalEl || !window.bootstrap) {
                    return;
                }

                if (titleEl) {
                    titleEl.textContent = this.generateOutputFilename
                        ? `预览：${this.generateOutputFilename}`
                        : "预览测试视频";
                }

                videoEl.src = url;
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();

                queueMicrotask(() => {
                    videoEl.play().catch(() => {});
                });
            }

            handleDragOver(e) {
                e.preventDefault();
                e.currentTarget.classList.add("dragover");
            }

            handleDragLeave(e) {
                e.preventDefault();
                e.currentTarget.classList.remove("dragover");
            }

            handleDrop(e) {
                e.preventDefault();
                e.currentTarget.classList.remove("dragover");
                const files = e.dataTransfer.files;

                if (files.length > 0) {
                    this.handleFile(files[0]);
                }
            }

            handleFileSelect(e) {
                const file = e.target.files[0];

                if (file) {
                    this.handleFile(file);
                }
            }

            async probeVideoMeta(file) {
                return new Promise((resolve) => {
                    const video = document.createElement("video");
                    const url = URL.createObjectURL(file);
                    video.preload = "metadata";
                    video.muted = true;
                    video.src = url;

                    const done = (payload) => {
                        URL.revokeObjectURL(url);
                        resolve(payload);
                    };

                    video.onloadedmetadata = () => {
                        const duration = Number.isFinite(video.duration) ? video.duration : 0;
                        const estimatedBitrateKbps = duration > 0
                            ? Math.floor((file.size * 8) / duration / 1000)
                            : 0;
                        const estimatedTotalMbps = duration > 0 ? (file.size * 8) / duration / 1e6 : 0;

                        done({
                            duration,
                            width: video.videoWidth || 0,
                            height: video.videoHeight || 0,
                            estimatedBitrateKbps,
                            estimatedTotalMbps
                        });
                    };

                    video.onerror = () => {
                        done({
                            duration: 0,
                            width: 0,
                            height: 0,
                            estimatedBitrateKbps: 0,
                            estimatedTotalMbps: 0
                        });
                    };
                });
            }

            renderMetaGrid(meta) {
                const grid = document.getElementById("fileMetaGrid");
                const durationText = meta.duration > 0 ? `${meta.duration.toFixed(2)} s` : "未知";
                const resText = meta.width > 0 && meta.height > 0 ? `${meta.width}×${meta.height}` : "未知";
                const brText = meta.estimatedBitrateKbps > 0 ? `${meta.estimatedBitrateKbps} kbps（估算）` : "未知";
                const suggEl = document.getElementById("sourceSuggestedLine");

                if (suggEl) {
                    suggEl.innerHTML = "更细的<strong>分辨率 / 码率 / 时长</strong>等与质量、体积相关的项见上方<strong>参数一览</strong>；点<strong>按源信息填入表单</strong>时，目标视频码率会填成与左栏「估算平均总码率（Mbps）」<strong>相同的实测值</strong>（仅作起点，压体积时常需改低）。";
                    suggEl.style.display = "block";
                }

                grid.innerHTML = `
                    <div class="meta-pill meta-pill--size">
                        <div class="meta-pill__icon" aria-hidden="true"><i class="fas fa-database"></i></div>
                        <div class="meta-pill__body">
                            <div class="label">文件大小</div>
                            <div class="value" id="metaSize">${formatFileSize(this.currentFile ? this.currentFile.size : 0)}</div>
                        </div>
                    </div>
                    <div class="meta-pill meta-pill--duration">
                        <div class="meta-pill__icon" aria-hidden="true"><i class="fas fa-clock"></i></div>
                        <div class="meta-pill__body">
                            <div class="label">时长</div>
                            <div class="value">${durationText}</div>
                        </div>
                    </div>
                    <div class="meta-pill meta-pill--resolution">
                        <div class="meta-pill__icon" aria-hidden="true"><i class="fas fa-expand"></i></div>
                        <div class="meta-pill__body">
                            <div class="label">分辨率</div>
                            <div class="value">${resText}</div>
                        </div>
                    </div>
                    <div class="meta-pill meta-pill--bitrate">
                        <div class="meta-pill__icon" aria-hidden="true"><i class="fas fa-gauge-high"></i></div>
                        <div class="meta-pill__body">
                            <div class="label">估算码率</div>
                            <div class="value">${brText}</div>
                        </div>
                    </div>
                `;
            }

            async handleFile(file) {
                if (!isProbablyVideoFile(file)) {
                    this.showError("请选择视频文件（或常见视频扩展名）");
                    return;
                }

                this.currentFile = file;

                const uploadArea = document.getElementById("fileUploadArea");
                uploadArea.classList.add("has-file");

                const selectedNameEl = document.getElementById("uploadSelectedName");
                if (selectedNameEl) {
                    selectedNameEl.textContent = file.name;
                }

                document.getElementById("fileDetails").textContent = file.name;
                document.getElementById("fileInfo").style.display = "block";

                const meta = await this.probeVideoMeta(file);
                this.lastSourceMeta = meta;
                this.renderMetaGrid(meta);
                this.updateResolutionModeLabelsFromSource(meta);
                this.fillVideoBitrateMbpsFromSourceEstimate(meta);
                this.refreshCompressProSnapshot();
            }

            /**
             * 用当前文件与 meta 估算「整文件平均总码率」并换算为 Mbps，写入 #videoBitrateMbps（与参数一览同源，非写死）。
             */
            fillVideoBitrateMbpsFromSourceEstimate(meta) {
                const mbpsEl = document.getElementById("videoBitrateMbps");
                const rateSel = document.getElementById("rateControl");
                const vbrOpt = rateSel ? rateSel.querySelector("option[value=\"vbr\"]") : null;

                if (!mbpsEl) {
                    return;
                }

                let mbps = 0;

                if (meta && Number.isFinite(meta.estimatedTotalMbps) && meta.estimatedTotalMbps > 0) {
                    mbps = meta.estimatedTotalMbps;
                } else if (meta && meta.estimatedBitrateKbps > 0) {
                    mbps = meta.estimatedBitrateKbps / 1000;
                } else if (this.currentFile && meta && meta.duration > 0) {
                    mbps = (this.currentFile.size * 8) / meta.duration / 1e6;
                }

                if (!mbps || !Number.isFinite(mbps)) {
                    mbpsEl.value = "6";
                    mbpsEl.title = "无有效时长或码率估算，使用页面默认 6 Mbps";

                    if (vbrOpt) {
                        vbrOpt.textContent = RATE_CONTROL_VBR_OPTION_DEFAULT_TEXT;
                    }

                    return;
                }

                const clamped = Math.min(80, Math.max(0.2, mbps));
                const rounded = Math.round(clamped * 1e6) / 1e6;
                mbpsEl.value = String(rounded);
                mbpsEl.title =
                    "已由当前源文件按「字节×8÷时长」估算整文件平均总码率并换算为 Mbps（与左侧参数一览一致）";

                if (vbrOpt) {
                    vbrOpt.textContent = `平均视频码率 Mbps（当前源估算总约 ${rounded} Mbps，已填入下方）`;
                }
            }

            updateResolutionModeLabelsFromSource(meta) {
                const sel = document.getElementById("resolutionMode");

                if (!sel) {
                    return;
                }

                const w = meta && meta.width ? meta.width : 0;
                const h = meta && meta.height ? meta.height : 0;

                const applyText = (value, text) => {
                    const opt = sel.querySelector(`option[value="${value}"]`);

                    if (opt) {
                        opt.textContent = text;
                    }
                };

                if (!w || !h) {
                    applyText("original", RESOLUTION_MODE_DEFAULT_LABELS.original);
                    applyText("cap1080", RESOLUTION_MODE_DEFAULT_LABELS.cap1080);
                    applyText("cap720", RESOLUTION_MODE_DEFAULT_LABELS.cap720);
                    applyText("cap480", RESOLUTION_MODE_DEFAULT_LABELS.cap480);

                    return;
                }

                const ratio = simplifyAspectRatioLabel(w, h);
                const px = `${w}×${h}`;
                const ratioSeg = ratio ? `，宽高比约 ${ratio}` : "";

                applyText("original", `保持原始像素（源 ${px}${ratioSeg}）`);
                applyText("cap1080", `限制在 1080p 以内（等比缩小；源 ${px}${ratioSeg}）`);
                applyText("cap720", `限制在 720p 以内（等比缩小；源 ${px}${ratioSeg}）`);
                applyText("cap480", `限制在 480p 以内（等比缩小；源 ${px}${ratioSeg}）`);
            }

            getSelectedOptionText(selectId) {
                const el = document.getElementById(selectId);

                if (!el || el.selectedIndex < 0) {
                    return "—";
                }

                return el.options[el.selectedIndex].text.trim();
            }

            snapRow(k, v) {
                return `<div class="pro-snap-row"><span class="pro-snap-k">${escapeHtml(k)}</span><span class="pro-snap-v">${escapeHtml(v)}</span></div>`;
            }

            refreshCompressProSnapshot() {
                const srcEl = document.getElementById("snapSourceDl");
                const formEl = document.getElementById("snapFormDl");

                if (!srcEl || !formEl) {
                    return;
                }

                const meta = this.lastSourceMeta;
                const file = this.currentFile;

                if (!file || !meta) {
                    srcEl.innerHTML = this.snapRow("状态", "未选择文件");
                } else {
                    const w = meta.width;
                    const h = meta.height;
                    const res = w > 0 && h > 0 ? `${w}×${h} px` : "未知（部分容器浏览器读不出像素）";
                    const dur = meta.duration > 0 ? `${meta.duration.toFixed(3)} s` : "未知";
                    const sz = formatFileSize(file.size);
                    const mpix = w > 0 && h > 0 ? `${((w * h) / 1e6).toFixed(2)} MP（宽×高 / 1e6）` : "—";
                    const kbps = meta.estimatedBitrateKbps;
                    const mbpsT = Number.isFinite(meta.estimatedTotalMbps) ? meta.estimatedTotalMbps : (kbps > 0 ? kbps / 1000 : 0);
                    const brLine = kbps > 0
                        ? `${kbps} kbps；合 ${mbpsT.toFixed(3)} Mbps（整文件平均总码率，公式：文件字节×8÷时长）`
                        : "未知（时长无效则无法算）";

                    srcEl.innerHTML = [
                        this.snapRow("像素分辨率", res),
                        this.snapRow("时长", dur),
                        this.snapRow("文件大小", sz),
                        this.snapRow("像素量（约）", mpix),
                        this.snapRow("估算平均总码率", brLine)
                    ].join("");
                }

                const outFmt = document.getElementById("outputFormat")?.value || "mp4";
                const rc = document.getElementById("rateControl")?.value || "vbr";
                const crf = document.getElementById("crfValue")?.value ?? "—";
                const vMbps = document.getElementById("videoBitrateMbps")?.value ?? "—";
                const extra = (document.getElementById("extraFfmpegArgs")?.value || "").trim();

                let formHtml = [
                    this.snapRow("输出容器 / 编码", this.getSelectedOptionText("outputFormat")),
                    this.snapRow("分辨率策略", this.getSelectedOptionText("resolutionMode")),
                    this.snapRow("输出帧率", this.getSelectedOptionText("fpsMode")),
                    this.snapRow("音频", this.getSelectedOptionText("audioMode")),
                    this.snapRow("音频码率（表单值）", `${document.getElementById("audioBitrateK")?.value || "—"} kbps（${this.getSelectedOptionText("audioBitrateK")}）`),
                    this.snapRow("码率控制", this.getSelectedOptionText("rateControl"))
                ];

                if (rc === "crf") {
                    formHtml.push(this.snapRow("CRF（当前数字）", String(crf)));
                } else {
                    formHtml.push(this.snapRow("目标平均视频码率（Mbps）", String(vMbps)));
                }

                if (outFmt === "mp4") {
                    formHtml.push(this.snapRow("x264 预设", this.getSelectedOptionText("x264Preset")));
                }

                if (outFmt === "webm") {
                    formHtml.push(this.snapRow("WebM 视频编码", this.getSelectedOptionText("webmVideoCodec")));
                    formHtml.push(this.snapRow("WebM 速度档位", this.getSelectedOptionText("webmCpuUsed")));
                }

                formHtml.push(this.snapRow("追加 FFmpeg 参数", extra ? extra : "（空）"));

                formEl.innerHTML = formHtml.join("");
            }

            syncWebmOptionsUi() {
                const fmt = document.getElementById("outputFormat");
                const wrap = document.getElementById("webmExtraWrap");
                const x264Wrap = document.getElementById("x264PresetWrap");

                if (wrap && fmt) {
                    wrap.style.display = fmt.value === "webm" ? "" : "none";
                }

                if (x264Wrap && fmt) {
                    x264Wrap.style.display = fmt.value === "mp4" ? "" : "none";
                }

                this.refreshCompressProSnapshot();
            }

            applySourceAsCompressBaseline() {
                const meta = this.lastSourceMeta;

                if (!meta) {
                    this.showToast("请先选择视频文件", "error");
                    return;
                }

                const setVal = (id, value) => {
                    const el = document.getElementById(id);

                    if (!el) {
                        return;
                    }

                    el.value = String(value);
                    el.dispatchEvent(new Event("input", { bubbles: true }));
                    el.dispatchEvent(new Event("change", { bubbles: true }));
                };

                setVal("resolutionMode", "original");
                setVal("fpsMode", "source");

                const est = meta.estimatedBitrateKbps;
                const totalMbpsRaw = Number.isFinite(meta.estimatedTotalMbps) && meta.estimatedTotalMbps > 0
                    ? meta.estimatedTotalMbps
                    : (est > 0 ? est / 1000 : 0);
                const totalMbps = totalMbpsRaw > 0
                    ? Math.round(Math.min(80, Math.max(0.2, totalMbpsRaw)) * 1000) / 1000
                    : 0;

                if (totalMbps > 0) {
                    setVal("rateControl", "vbr");
                    setVal("videoBitrateMbps", String(totalMbps));
                    this.syncRateControlUi();
                    this.refreshCompressProSnapshot();
                    this.showToast(`已填入：分辨率/帧率对齐源；目标平均视频码率 = ${totalMbps} Mbps（与「参数一览」左栏总码率 Mbps 同一实测值；压体积时常改低于此值）`, "success");
                } else {
                    this.syncRateControlUi();
                    this.refreshCompressProSnapshot();
                    this.showToast("已填入：分辨率/帧率对齐源；无法由大小/时长算出码率，请手动设 CRF 或目标视频码率", "success");
                }
            }

            pickRecorderMime(preferredFormat) {
                const wantMp4 = preferredFormat === "mp4";
                const candidates = wantMp4
                    ? [
                        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
                        "video/mp4;codecs=avc1.4D401E,mp4a.40.2",
                        "video/mp4",
                        "video/webm;codecs=vp9,opus",
                        "video/webm"
                    ]
                    : [
                        "video/webm;codecs=vp9,opus",
                        "video/webm;codecs=vp8,opus",
                        "video/webm",
                        "video/mp4"
                    ];

                for (const c of candidates) {
                    if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) {
                        return c;
                    }
                }

                return "";
            }

            async generateVideo() {
                const duration = parseInt(document.getElementById("duration").value, 10);
                const format = document.getElementById("format").value;
                const resolution = document.getElementById("resolution").value;
                const fps = parseInt(document.getElementById("genFps").value, 10) || 30;

                if (!Number.isFinite(duration) || duration < 1 || duration > 300) {
                    this.showError("视频时长必须在 1–300 秒之间");
                    return;
                }

                this.showGenerateProgress();

                try {
                    const videoBlob = await this.createMockVideo(duration, format, resolution, fps, (p) => {
                        const bar = document.getElementById("generateProgressBar");
                        const status = document.getElementById("generateStatus");
                        bar.style.width = `${(p * 100).toFixed(2)}%`;
                        status.innerHTML = `<i class="loading-spinner me-2"></i>正在生成视频… ${(p * 100).toFixed(0)}%`;
                    });

                    this.revokeLastUrls();
                    const url = URL.createObjectURL(videoBlob);
                    this.trackObjectUrl(url);

                    const actualExt = format === "mp4" && videoBlob.type.includes("webm") ? "webm" : format;
                    const filename = `测试视频_${duration}s_${resolution.replace("x", "x")}_${fps}fps.${actualExt}`;

                    this.showGenerateResult(url, filename);
                } catch (error) {
                    this.showError("视频生成失败：" + (error && error.message ? error.message : String(error)));
                } finally {
                    document.getElementById("generateBtn").disabled = false;
                    document.getElementById("generateProgress").style.display = "none";
                }
            }

            async createMockVideo(duration, format, resolution, fps, onProgress) {
                const canvas = document.createElement("canvas");
                const [width, height] = resolution.split("x").map((n) => parseInt(n, 10));
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                const mimeType = this.pickRecorderMime(format);

                if (!mimeType) {
                    throw new Error("当前浏览器不支持可用的 MediaRecorder 编码组合");
                }

                const stream = canvas.captureStream(fps);
                const mediaRecorder = new MediaRecorder(stream, { mimeType });
                const chunks = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                const totalFrames = Math.max(1, Math.floor(duration * fps));

                return new Promise((resolve, reject) => {
                    mediaRecorder.onerror = (ev) => reject(new Error(ev && ev.error ? ev.error.message : "MediaRecorder 错误"));

                    mediaRecorder.onstop = () => {
                        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
                        resolve(blob);
                    };

                    mediaRecorder.start(250);

                    let frame = 0;

                    const tick = () => {
                        const t = frame / fps;
                        ctx.fillStyle = `hsl(${(frame * 3) % 360}, 72%, 52%)`;
                        ctx.fillRect(0, 0, width, height);
                        ctx.fillStyle = "rgba(255,255,255,0.92)";
                        ctx.font = `${Math.max(22, Math.floor(Math.min(width, height) * 0.06))}px Plus Jakarta Sans, Noto Sans SC, Arial`;
                        ctx.textAlign = "center";
                        ctx.fillText(`测试视频 ${t.toFixed(1)}s / ${duration}s`, width / 2, height / 2);

                        frame += 1;

                        if (typeof onProgress === "function") {
                            onProgress(frame / totalFrames);
                        }

                        if (frame >= totalFrames) {
                            mediaRecorder.stop();
                            return;
                        }

                        requestAnimationFrame(tick);
                    };

                    requestAnimationFrame(tick);
                });
            }

            buildVideoFilter(resolutionMode, fpsMode) {
                const parts = [];

                    if (resolutionMode === "cap1080") {
                    parts.push("scale=w='min(iw\\,1920)':h='min(ih\\,1080)':force_original_aspect_ratio=decrease");
                } else if (resolutionMode === "cap720") {
                    parts.push("scale=w='min(iw\\,1280)':h='min(ih\\,720)':force_original_aspect_ratio=decrease");
                } else if (resolutionMode === "cap480") {
                    parts.push("scale=w='min(iw\\,854)':h='min(ih\\,480)':force_original_aspect_ratio=decrease");
                }

                if (fpsMode !== "source") {
                    const f = parseInt(fpsMode, 10);
                    parts.push(`fps=${f}`);
                }

                if (parts.length === 0) {
                    return [];
                }

                return ["-vf", parts.join(",")];
            }

            buildAudioArgs(audioMode, audioBitrateK, outputFormat) {
                if (audioMode === "none") {
                    return ["-an"];
                }

                if (audioMode === "copy") {
                    return ["-c:a", "copy"];
                }

                const br = `${parseInt(audioBitrateK, 10) || 128}k`;

                if (outputFormat === "webm") {
                    return ["-c:a", "libopus", "-b:a", br];
                }

                return ["-c:a", "aac", "-b:a", br];
            }

            buildVideoEncodeArgs(outputFormat, rateControl, crfValue, videoBitrateMbps, x264Preset) {
                if (outputFormat === "webm") {
                    const codecEl = document.getElementById("webmVideoCodec");
                    const cpuEl = document.getElementById("webmCpuUsed");
                    const useVp9 = codecEl && codecEl.value === "vp9";
                    const cpuParsed = parseInt(cpuEl && cpuEl.value ? cpuEl.value : "2", 10);
                    const cpuUsed = Number.isFinite(cpuParsed) ? cpuParsed : 2;

                    if (useVp9) {
                        const crfVp9 = Math.max(0, Math.min(63, parseInt(crfValue, 10) || 32));
                        const cpuVp9 = String(Math.max(0, Math.min(9, cpuUsed)));
                        const vp9LowMem = [
                            "-row-mt",
                            "0",
                            "-tile-columns",
                            "0",
                            "-tile-rows",
                            "0",
                            "-auto-alt-ref",
                            "0",
                            "-lag-in-frames",
                            "0",
                            "-cpu-used",
                            cpuVp9,
                            "-threads",
                            "1"
                        ];

                        if (rateControl === "crf") {
                            return ["-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", ...vp9LowMem, "-crf", String(crfVp9), "-b:v", "0"];
                        }

                        const mbps9 = Number(videoBitrateMbps);
                        const safe9 = Number.isFinite(mbps9) ? Math.min(80, Math.max(0.2, mbps9)) : 2;
                        const kbps9 = Math.floor(safe9 * 1000);

                        return [
                            "-c:v",
                            "libvpx-vp9",
                            "-pix_fmt",
                            "yuv420p",
                            ...vp9LowMem,
                            "-b:v",
                            `${kbps9}k`,
                            "-maxrate",
                            `${Math.floor(kbps9 * 1.35)}k`,
                            "-bufsize",
                            `${Math.floor(kbps9 * 2)}k`
                        ];
                    }

                    const crfVp8 = Math.max(4, Math.min(63, parseInt(crfValue, 10) || 32));
                    const cpuVp8 = String(Math.max(0, Math.min(16, cpuUsed)));
                    const vp8Args = [
                        "-pix_fmt",
                        "yuv420p",
                        "-deadline",
                        "good",
                        "-cpu-used",
                        cpuVp8,
                        "-threads",
                        "1"
                    ];

                    if (rateControl === "crf") {
                        return ["-c:v", "libvpx", ...vp8Args, "-crf", String(crfVp8), "-b:v", "0"];
                    }

                    const mbps = Number(videoBitrateMbps);
                    const safeMbps = Number.isFinite(mbps) ? Math.min(80, Math.max(0.2, mbps)) : 2;
                    const kbps = Math.floor(safeMbps * 1000);

                    return ["-c:v", "libvpx", ...vp8Args, "-b:v", `${kbps}k`, "-maxrate", `${Math.floor(kbps * 1.35)}k`, "-bufsize", `${Math.floor(kbps * 2)}k`];
                }

                const preset = x264Preset || "medium";

                if (rateControl === "crf") {
                    const crf = Math.max(0, Math.min(51, parseInt(crfValue, 10) || 23));
                    return [
                        "-c:v",
                        "libx264",
                        "-preset",
                        preset,
                        "-crf",
                        String(crf),
                        "-profile:v",
                        "high",
                        "-pix_fmt",
                        "yuv420p",
                        "-x264-params",
                        "threads=1"
                    ];
                }

                const mbps = Number(videoBitrateMbps);
                const safeMbps = Number.isFinite(mbps) ? Math.min(80, Math.max(0.2, mbps)) : 6;
                const kbps = Math.floor(safeMbps * 1000);

                return [
                    "-c:v",
                    "libx264",
                    "-preset",
                    preset,
                    "-b:v",
                    `${kbps}k`,
                    "-maxrate",
                    `${Math.floor(kbps * 1.35)}k`,
                    "-bufsize",
                    `${Math.floor(kbps * 2)}k`,
                    "-profile:v",
                    "high",
                    "-pix_fmt",
                    "yuv420p",
                    "-x264-params",
                    "threads=1"
                ];
            }

            async compressVideo() {
                if (!this.currentFile) {
                    this.showError("请先选择视频文件");
                    return;
                }

                if (!this.ffmpeg || !this.ffmpeg.loaded) {
                    this.showError("FFmpeg 尚未加载完成，请等待顶部进度条结束或点击重试");
                    return;
                }

                const outputFormat = document.getElementById("outputFormat").value;
                const resolutionMode = document.getElementById("resolutionMode").value;
                const fpsMode = document.getElementById("fpsMode").value;
                const audioMode = document.getElementById("audioMode").value;
                const rateControl = document.getElementById("rateControl").value;
                const crfValue = document.getElementById("crfValue").value;
                const videoBitrateMbps = document.getElementById("videoBitrateMbps").value;
                const x264Preset = document.getElementById("x264Preset").value;
                const audioBitrateK = document.getElementById("audioBitrateK").value;
                const extraArgs = parseExtraArgs(document.getElementById("extraFfmpegArgs").value);

                const maxWasmInputBytes = 480 * 1024 * 1024;

                if (this.currentFile.size > maxWasmInputBytes) {
                    this.showError(`文件约 ${formatFileSize(this.currentFile.size)}，超过浏览器内 FFmpeg 建议上限（约 480MB），极易触发 WASM 内存错误。请先缩小文件或使用桌面版 FFmpeg。`);
                    return;
                }

                this.showCompressProgress();

                try {
                    const ffmpeg = this.ffmpeg;
                    const inExt = getExtensionLower(this.currentFile.name);
                    const inName = `input.${inExt}`;
                    const outName = outputFormat === "mp4" ? "output.mp4" : "output.webm";

                    const data = await window.FFmpegUtil.fetchFile(this.currentFile);
                    await ffmpeg.writeFile(inName, data);

                    const vfArgs = this.buildVideoFilter(resolutionMode, fpsMode);
                    const vEnc = this.buildVideoEncodeArgs(outputFormat, rateControl, crfValue, videoBitrateMbps, x264Preset);
                    const aEnc = this.buildAudioArgs(audioMode, audioBitrateK, outputFormat);

                    const tailArgs = outputFormat === "mp4"
                        ? ["-movflags", "+faststart", outName]
                        : [outName];

                    const args = [
                        "-y",
                        "-threads",
                        "1",
                        "-hide_banner",
                        "-loglevel",
                        "info",
                        "-i",
                        inName,
                        ...vfArgs,
                        ...vEnc,
                        ...aEnc,
                        ...extraArgs,
                        ...tailArgs
                    ];

                    await ffmpeg.exec(args);

                    const outData = await ffmpeg.readFile(outName);
                    const outMime = outputFormat === "mp4" ? "video/mp4" : "video/webm";
                    const blob = new Blob([outData], { type: outMime });

                    await ffmpeg.deleteFile(inName).catch(() => {});
                    await ffmpeg.deleteFile(outName).catch(() => {});

                    this.revokeLastUrls();
                    const url = URL.createObjectURL(blob);
                    this.trackObjectUrl(url);

                    const downloadName = buildDownloadName(this.currentFile.name, outputFormat);
                    this.showCompressResult(url, downloadName);
                } catch (error) {
                    console.error(error);
                    let detail = error && error.message ? error.message : String(error);

                    if (/memory access out of bounds|out of memory|OutOfMemory|wasm.*memory/i.test(detail)) {
                        detail = "WASM 内存越界/不足（与物理内存无关，是 wasm 堆上限）。可依次尝试：① 分辨率改为 720p/480p；② WebM 改 VP8 或改 MP4；③ WebM 选更快档位或略提高 CRF 减轻编码负担；④ x264 用 faster/veryfast；⑤ 换更短/更小源文件。原始错误：" + detail;
                    } else if (/signature mismatch|function signature mismatch/i.test(detail)) {
                        detail = "WASM 接口签名不匹配（多为 core.js 与 wasm 版本不一致）。请在 tools/video/ffmpeg-vendor/ 运行 fetch-ffmpeg-core.ps1 拉取成对文件，Ctrl+F5 后重试；并关闭 Ajax Modifier 等扩展。原始错误：" + detail;
                    }

                    this.showError("转码失败：" + detail);

                    try {
                        const inExt = getExtensionLower(this.currentFile.name);
                        await this.ffmpeg.deleteFile(`input.${inExt}`).catch(() => {});
                        await this.ffmpeg.deleteFile("output.mp4").catch(() => {});
                        await this.ffmpeg.deleteFile("output.webm").catch(() => {});
                    } catch {
                        // ignore
                    }
                } finally {
                    document.getElementById("compressBtn").disabled = !this.ffmpeg || !this.ffmpeg.loaded;
                    document.getElementById("compressProgress").style.display = "none";
                }
            }

            showGenerateProgress() {
                const previewModalEl = document.getElementById("generatePreviewModal");

                if (previewModalEl && window.bootstrap) {
                    const inst = bootstrap.Modal.getInstance(previewModalEl);

                    if (inst) {
                        inst.hide();
                    }
                }

                document.getElementById("generateProgress").style.display = "block";
                document.getElementById("generateResult").style.display = "none";
                document.getElementById("generateBtn").disabled = true;
                document.getElementById("generateProgressBar").style.width = "0%";
                document.getElementById("generateStatus").className = "status-indicator status-processing";
                document.getElementById("generateStatus").innerHTML = `<i class="loading-spinner me-2"></i>正在生成视频…`;
            }

            showGenerateResult(url, filename) {
                document.getElementById("generateProgress").style.display = "none";
                document.getElementById("generateResult").style.display = "block";
                document.getElementById("generateBtn").disabled = false;

                const downloadLink = document.getElementById("generateDownload");
                downloadLink.href = url;
                downloadLink.download = filename;

                this.generateOutputBlobUrl = url;
                this.generateOutputFilename = filename;
                this.openGeneratePreviewModal();
            }

            showCompressProgress() {
                document.getElementById("compressProgress").style.display = "block";
                document.getElementById("compressResult").style.display = "none";
                document.getElementById("compressBtn").disabled = true;
                document.getElementById("compressProgressBar").style.width = "0%";
                document.getElementById("compressStatus").className = "status-indicator status-processing";
                document.getElementById("compressStatus").innerHTML = `<i class="loading-spinner me-2"></i>正在转码…`;
                document.getElementById("compressLogLine").textContent = "";
            }

            /**
             * 转码完成后触发浏览器下载（blob URL + download 属性）。
             * 注意：异步任务结束后由脚本触发的下载可能被部分浏览器拦截，此时请用户再点一次下载链接。
             */
            triggerCompressOutputDownload(url, filename) {
                const downloadLink = document.getElementById("compressDownload");

                if (!downloadLink) {
                    return;
                }

                downloadLink.href = url;
                downloadLink.download = filename;

                const fire = () => {
                    try {
                        downloadLink.click();
                    } catch {
                        // ignore
                    }
                };

                window.setTimeout(fire, 0);
            }

            showCompressResult(url, filename) {
                document.getElementById("compressProgress").style.display = "none";
                document.getElementById("compressResult").style.display = "block";
                document.getElementById("compressBtn").disabled = !this.ffmpeg || !this.ffmpeg.loaded;

                this.triggerCompressOutputDownload(url, filename);
            }

            showToast(message, variant) {
                const el = document.createElement("div");
                const isErr = variant === "error";
                el.className = `status-indicator ${isErr ? "status-error" : "status-success"}`;
                el.innerHTML = `<i class="fas fa-${isErr ? "exclamation-triangle" : "check-circle"} me-2"></i>${message}`;

                const container = document.querySelector(".main-container");
                container.insertBefore(el, container.firstChild);

                setTimeout(() => {
                    el.remove();
                }, 5200);
            }

            showError(message) {
                this.showToast(message, "error");
            }
        }

        document.addEventListener("DOMContentLoaded", () => {
            new VideoProcessor();
        });
