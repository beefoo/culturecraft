class SoundManager {
  constructor(options = {}) {
    const defaults = {
      audioPath: 'audio/culturecraft_sounds.mp3',
      minTimeBetweenTriggers: 50,
      spriteDataPath: 'audio/culturecraft_sounds.json',
      spriteGroups: 10,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.firstPlay = true;
    this.loaded = false;
    this.enabled = true;
    this.lastPlayTime = 0;
    this.spriteGroup = false;
    this.loadSprite(this.options.audioPath, this.options.spriteDataPath);
  }

  loadRandomSpriteGroup() {
    this.spriteGroup = _.sample(this.spriteGroups);
  }

  loadSprite(audioPath, dataPath) {
    $.getJSON(dataPath, (spriteData) => {
      this.onSpriteDataLoad(audioPath, spriteData);
    });
  }

  onSpriteDataLoad(audioPath, spriteData) {
    const keys = _.keys(spriteData);
    this.spriteCount = keys.length;
    const groupCount = this.options.spriteGroups;
    const groupSize = Math.floor(this.spriteCount / groupCount);
    this.spriteGroups = _.times(groupCount, (i) => keys.slice(i * groupSize, (i + 1) * groupSize));
    this.loadRandomSpriteGroup();
    this.sound = new Howl({
      src: [audioPath],
      sprite: spriteData,
      onload: () => {
        this.loaded = true;
      },
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

  playRandomInGroup() {
    const id = _.sample(this.spriteGroup);
    this.play(id);
  }

  playValue(value) {
    const index = Math.round(value * (this.spriteCount - 1));
    this.play(String(index));
  }
}
