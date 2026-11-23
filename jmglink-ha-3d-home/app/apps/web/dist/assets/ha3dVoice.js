// ===== ha3d-self: 0.2.3 语音输入（麦克风按钮） =====
// 两种识别方式，按顺序选：
//   1. 浏览器自带的语音识别（SpeechRecognition / webkitSpeechRecognition：Chrome、Edge、Safari；iPhone/iPad 上走 Siri 听写）
//   2. 录音后交给 Home Assistant 的 Assist 管线识别（POST ./api/ha/assist-stt，后端转给 HA 的 assist_pipeline/run 的 stt 阶段），
//      用于没有浏览器语音识别、或者它不能用的环境（例如 HA iOS App 的内置浏览器、Firefox）。需要 getUserMedia。
// 浏览器只允许安全上下文（HTTPS 或 localhost）使用麦克风：通过 http://<局域网 IP> 打开时，getUserMedia 不存在，
// 浏览器语音识别也会被拒绝（not-allowed）。这时不启动录音，直接提示需要 HTTPS。
// 识别出的文字由调用方提交给 ./api/ha/conversation，和键入的指令走同一条路。

const ha3dSttRate = 16000;
// 浏览器语音识别在安全上下文里被拒绝（权限、服务不可用）后，本次打开页面期间改用 HA 识别
let ha3dPreferHa = false;

function ha3dRecognitionCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}
function ha3dCanRecord() {
  return Boolean(
    window.isSecureContext !== false &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function" &&
      (window.AudioContext || window.webkitAudioContext),
  );
}
function ha3dInsecureHint() {
  return `语音输入需要 HTTPS：现在是用 ${window.location.protocol}//${window.location.host} 打开的，浏览器不允许 http 页面使用麦克风。请用 https 地址打开 Home Assistant（例如 Nabu Casa 远程访问，或给 HA 配置 SSL 证书）后再用语音。现在可以在下面键入指令。`;
}
/** 当前环境能用哪种识别；都不能用时给出原因（界面直接显示）。 */
// 非安全上下文直接不可用：WebKit（Safari、HA iOS App）在 http 页面上 webkitSpeechRecognition 和 navigator.mediaDevices 都不存在；
// Chromium 还保留语音识别的构造函数，但拿不到麦克风（实测 start() 后不出 start/error 事件就结束）。
export function ha3dVoiceSupport() {
  const secure = window.isSecureContext !== false;
  const recognition = secure && Boolean(ha3dRecognitionCtor());
  const record = ha3dCanRecord();
  const engine = !ha3dPreferHa && recognition ? "browser" : record ? "ha" : recognition ? "browser" : null;
  let reason;
  if (!engine) reason = secure ? "这个浏览器不支持语音输入（没有语音识别，也不能录音）。请换用 Safari 或 Chrome，或在下面键入指令。" : ha3dInsecureHint();
  return { secure, recognition, record, engine, reason };
}
function ha3dRecognitionError(code, secure, canFallback) {
  if (code === "aborted") return "";
  if ((code === "not-allowed" || code === "service-not-allowed") && !secure) return ha3dInsecureHint();
  if (code === "not-allowed" || code === "service-not-allowed" || code === "language-not-supported") {
    if (canFallback) {
      ha3dPreferHa = true;
      return "浏览器的语音识别不能用（可能是麦克风或语音识别权限没开、iPhone 上 Siri 没打开，或 HA App 内置浏览器不支持），已改用 Home Assistant 语音识别，请再点一次麦克风。";
    }
    return code === "language-not-supported"
      ? "浏览器的语音识别不支持中文，请在下面键入指令。"
      : "语音识别被拒绝：请在浏览器或系统设置里允许这个网站使用麦克风和语音识别（iPhone 上还需要打开 Siri 与听写），然后再试。";
  }
  if (code === "no-speech") return "没有听到说话，请再点一次麦克风重试。";
  if (code === "audio-capture") return "没有找到可用的麦克风。";
  if (code === "network") return "语音识别服务连不上（网络错误），请稍后重试，或在下面键入指令。";
  return `语音识别失败（${code || "未知错误"}），请重试或在下面键入指令。`;
}

/**
 * 开始一次语音输入。回调：
 *   onListening(engine)：开始收音；onInterim(text)：识别中的文字；onTranscribing()：录音结束、等 HA 识别；
 *   onText(text)：最终文字；onError(message)：失败原因（空字符串表示用户取消，不用提示）；onEnd()：这次结束（总会调用一次）。
 * 返回 { stop()（停止收音，用已听到的内容）, abort()（取消） }。必须在点击事件里同步调用（iOS 要求用户手势）。
 */
export function ha3dStartVoice({ pipelineId, onListening, onInterim, onTranscribing, onText, onError, onEnd }) {
  const support = ha3dVoiceSupport();
  let ended = false;
  const end = () => {
    if (ended) return;
    ended = true;
    onEnd?.();
  };
  if (!support.engine) {
    onError(support.reason);
    end();
    return { stop() {}, abort() {} };
  }
  return support.engine === "browser"
    ? ha3dStartRecognition(support, { onListening, onInterim, onText, onError, end })
    : ha3dStartRecording({ pipelineId, onListening, onInterim, onTranscribing, onText, onError, end });
}

function ha3dStartRecognition(support, { onListening, onInterim, onText, onError, end }) {
  const Ctor = ha3dRecognitionCtor();
  const r = new Ctor();
  let finalText = "",
    latest = "",
    started = false,
    failed = false,
    aborted = false,
    quietTimer,
    maxTimer,
    // 5 秒内没有 start 事件（服务没有响应）就放弃，按「服务不可用」处理
    startTimer = setTimeout(() => {
      started || failed || aborted || ((failed = true), onError(ha3dRecognitionError("service-not-allowed", support.secure, support.record)), r.abort());
    }, 5e3);
  const clearTimers = () => {
    clearTimeout(quietTimer);
    clearTimeout(maxTimer);
    clearTimeout(startTimer);
  };
  r.lang = "zh-CN";
  r.continuous = !1;
  r.interimResults = !0;
  r.maxAlternatives = 1;
  r.onstart = () => {
    started = true;
    clearTimeout(startTimer);
    onListening("browser");
    // 最长 15 秒；iOS Safari 有时说完了也不结束，最后一次有结果后 1.6 秒没有新结果就停止
    maxTimer = setTimeout(() => r.stop(), 15e3);
  };
  r.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const item = event.results[i];
      const text = item && item[0] ? item[0].transcript : "";
      item && item.isFinal ? (finalText += text) : (interim += text);
    }
    latest = (finalText + interim).trim();
    onInterim(latest);
    clearTimeout(quietTimer);
    quietTimer = setTimeout(() => r.stop(), 1600);
  };
  r.onerror = (event) => {
    failed = true;
    clearTimers();
    // 只有安全上下文里能录音时才改用 HA 识别
    onError(aborted ? "" : ha3dRecognitionError(event.error, support.secure, support.record));
  };
  r.onend = () => {
    clearTimers();
    if (!failed && !aborted) {
      const text = finalText.trim() || latest;
      // 没有 start 就结束：识别服务没有启动（权限或服务不可用）
      text ? onText(text) : onError(ha3dRecognitionError(started ? "no-speech" : "service-not-allowed", support.secure, !started && support.record));
    }
    end();
  };
  try {
    r.start();
  } catch (error) {
    failed = true;
    onError(ha3dRecognitionError(error && error.name === "NotAllowedError" ? "not-allowed" : String((error && error.message) || error), support.secure, support.record));
    end();
  }
  return {
    stop: () => r.stop(),
    abort() {
      aborted = true;
      clearTimers();
      r.abort();
    },
  };
}

function ha3dStartRecording({ pipelineId, onListening, onInterim, onTranscribing, onText, onError, end }) {
  const AC = window.AudioContext || window.webkitAudioContext;
  // AudioContext 要在用户手势里创建，iOS 上才不会一直是 suspended
  const ctx = new AC();
  ctx.resume && ctx.resume().catch(() => {});
  const chunks = [];
  let stream,
    source,
    proc,
    total = 0,
    heard = !1,
    quiet = 0,
    elapsed = 0,
    state = "starting";
  const cleanup = () => {
    try {
      proc && (proc.onaudioprocess = null, proc.disconnect());
      source && source.disconnect();
    } catch {}
    stream && stream.getTracks().forEach((track) => track.stop());
    ctx.close && ctx.close().catch(() => {});
  };
  const finish = async (cancel) => {
    if (state === "done") return;
    const wasRecording = state === "recording";
    state = "done";
    cleanup();
    if (cancel) {
      onError("");
      return end();
    }
    if (!wasRecording) return end();
    if (!heard || total < ha3dSttRate * 0.3) {
      onError("没有听到说话，请再点一次麦克风重试。");
      return end();
    }
    const pcm = new Int16Array(total);
    let offset = 0;
    for (const chunk of chunks) (pcm.set(chunk, offset), (offset += chunk.length));
    onTranscribing?.();
    try {
      const query = new URLSearchParams({ sample_rate: String(ha3dSttRate) });
      pipelineId && pipelineId !== "default" && query.set("pipeline_id", pipelineId);
      const response = await fetch(`./api/ha/assist-stt?${query}`, { method: "POST", headers: { "Content-Type": "audio/pcm" }, body: pcm.buffer });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.message || `语音识别请求失败：${response.status}`);
      const text = String(data.text || "").trim();
      text ? onText(text) : onError("Home Assistant 没有识别出文字，请再说一次。");
    } catch (error) {
      onError(`Home Assistant 语音识别失败：${error instanceof Error ? error.message : String(error)}`);
    }
    end();
  };
  navigator.mediaDevices
    .getUserMedia({ audio: { channelCount: 1, echoCancellation: !0, noiseSuppression: !0 } })
    .then((media) => {
      stream = media;
      if (state === "done") return cleanup();
      state = "recording";
      source = ctx.createMediaStreamSource(media);
      proc = ctx.createScriptProcessor(4096, 1, 1);
      const ratio = ctx.sampleRate / ha3dSttRate;
      proc.onaudioprocess = (event) => {
        if (state !== "recording") return;
        const input = event.inputBuffer.getChannelData(0);
        // 降采样到 16 kHz：每个输出样本取对应区间的平均值
        const count = Math.floor(input.length / ratio);
        const out = new Int16Array(Math.max(0, count));
        let sum = 0;
        for (let i = 0; i < count; i += 1) {
          const from = Math.floor(i * ratio),
            to = Math.min(input.length, Math.floor((i + 1) * ratio));
          let acc = 0;
          for (let k = from; k < to; k += 1) acc += input[k];
          const value = Math.max(-1, Math.min(1, acc / Math.max(1, to - from)));
          out[i] = value < 0 ? value * 32768 : value * 32767;
          sum += value * value;
        }
        chunks.push(out);
        total += out.length;
        // 简单的说话检测：RMS > 0.02 算有声音；说过话后安静 1.2 秒、或者一直没说话 6 秒、或者总长 12 秒就停止
        const seconds = input.length / ctx.sampleRate;
        const rms = Math.sqrt(sum / Math.max(1, count));
        elapsed += seconds;
        rms > 0.02 ? ((heard = !0), (quiet = 0)) : (quiet += seconds);
        if ((heard && quiet >= 1.2) || (!heard && elapsed >= 6) || elapsed >= 12) finish(!1);
      };
      source.connect(proc);
      proc.connect(ctx.destination);
      onListening("ha");
      onInterim("");
    })
    .catch((error) => {
      if (state === "done") return;
      state = "done";
      cleanup();
      const name = error && error.name;
      onError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "麦克风权限被拒绝：请在浏览器或系统设置里允许这个网站（HA App 里是允许 Home Assistant App）使用麦克风，然后再试。"
          : name === "NotFoundError"
            ? "没有找到可用的麦克风。"
            : `无法打开麦克风：${(error && error.message) || name || error}`,
      );
      end();
    });
  return { stop: () => finish(!1), abort: () => finish(!0) };
}
