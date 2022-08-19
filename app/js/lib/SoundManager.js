class SoundManager {
  constructor(options = {}) {
    const defaults = {
      audioPath: 'audio/culturecraft_sounds.mp3',
      minTimeBetweenTriggers: 50,
      spriteDataPath: 'audio/culturecraft_sounds.json',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.firstPlay = true;
    this.loaded = false;
    this.enabled = true;
    this.lastPlayTime = 0;
    this.loadSprite(this.options.audioPath, this.options.spriteDataPath);
  }

  loadSprite(audioPath, dataPath) {
    $.getJSON(dataPath, (spriteData) => {
      const keys = _.keys(spriteData);
      this.spriteKeys = keys;
      this.spriteCount = keys.length;
      this.sound = new Howl({
        src: [audioPath],
        sprite: spriteData,
        onload: () => {
          this.loaded = true;
        },
      });
    });
  }

  play(id) {
    if (!this.loaded || !this.enabled) return;
    if (this.audioContextIsResuming === true) return;
    const now = Date.now();
    const timeSinceLastPlay = now - this.lastPlayTime;
    if (timeSinceLastPlay < this.options.minTimeBetweenTriggers) return;
    if (this.firstPlay) {
      this.firstPlay = false;
      this.audioContextIsResuming = true;
      Howler.ctx.resume().then(() => {
        this.audioContextIsResuming = false;
      });
      return;
    }
    this.sound.play(id);
    this.lastPlayTime = now;
  }

  playRandom(low, high) {
    const value = MathUtil.lerp(low, high, Math.random());
    this.playValue(value);
  }

  playValue(value) {
    const index = Math.round(value * (this.spriteCount - 1));
    this.play(String(index));
  }
}