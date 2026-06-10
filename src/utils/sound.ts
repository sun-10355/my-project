// 使用 Web Audio API 播放提示音
// 生成一个简单的电子音效，无需外部音频文件

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

export function playAlarm(volume: number = 70) {
  try {
    const ctx = getAudioContext()
    const vol = volume / 100
    const now = ctx.currentTime

    // 创建和弦音符序列: C5, E5, G5, C6
    const frequencies = [523.25, 659.25, 783.99, 1046.5]

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(vol * 0.3, now + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + i * 0.15)
      osc.stop(now + i * 0.15 + 0.4)
    })
  } catch {
    // 静默失败
  }
}

export function playTick(volume: number = 50) {
  try {
    const ctx = getAudioContext()
    const vol = volume / 100
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(vol * 0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch {
    // 静默失败
  }
}
