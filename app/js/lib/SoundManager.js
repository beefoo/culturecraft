class SoundManager {
  constructor(options = {}) {
    const defaults = {
      audioPath: 'audio/culturecraft_sounds.mp3',
      minTimeBetweenTriggers: 50,
      spriteDataPath: 'audio/culturecraft_sounds.json',
      spriteGroups: 10,
      volumeMin: 0.5,
      volumeMax: 1,
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
    this.loadListeners();
  }

  loadListeners() {
    $('.toggle-sound').on('click', (e) => this.toggleSound(e));
  }

  loadRandomSpriteGroup() {
    let groups = this.spriteGroups;
    if (this.spriteGroup !== false) {
      groups = _.reject(this.spriteGroups, (g) => (g.id === this.spriteGroup.id));
    }
    this.spriteGroup = _.sample(groups);
    console.log(this.spriteGroup.title, this.spriteGroup.url);
  }

  loadSprite(audioPath, dataPath) {
    $.getJSON(dataPath, (data) => {
      this.onSpriteDataLoad(audioPath, data);
    });
  }

  onSpriteDataLoad(audioPath, data) {
    const spriteData = data.sprites;
    const groupData = data.groups;
    const keys = _.keys(spriteData);
    this.spriteCount = keys.length;
    this.spriteGroups = groupData;
    this.loadRandomSpriteGroup();
    this.sound = new Howl({
      src: [audioPath],
      sprite: spriteData,
      onload: () => {
        this.loaded = true;
      },
    });
  }

  play(id, volume) {
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
    if (volume !== undefined) {
      Howler.volume(volume, id);
    }
    this.sound.play(id);
    this.lastPlayTime = now;
  }

  playRandom(low, high) {
    const value = MathUtil.lerp(low, high, Math.random());
    this.playValue(value);
  }

  playRandomInGroup(value = 1) {
    const volume = MathUtil.lerp(this.options.volumeMin, this.options.volumeMax, value);
    const id = _.sample(this.spriteGroup.sprites);
    this.play(id, volume);
  }

  playValue(value) {
    const index = Math.round(value * (this.spriteCount - 1));
    this.play(String(index));
  }

  toggleSound(event) {
    const $el = $(event.currentTarget);
    $el.toggleClass('active');
    this.enabled = $el.hasClass('active');
  }
}
