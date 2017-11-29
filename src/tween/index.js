import * as easing from './easing';

export class Tween {
  constructor(settings) {
    const {
      from,
      to,
      duration,
      delay,
      easing,
      onStart,
      onUpdate,
      onFinish
    } = settings;

    for(let key in from) {
      if(to[key] === undefined) {
        to[key] = from[key];
      }
    }
    for(let key in to) {
      if(from[key] === undefined) {
        from[key] = to[key];
      }
    }

    this.from = from;
    this.to = to;
    this.duration = duration || 500;
    this.delay = delay || 0;
    this.easing = easing || 'linear';
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
    this.startTime = Date.now() + this.delay;
    this.started = false;
    this.finished = false;
    this.keys = {};
  }

  update() {
    this.time = Date.now();
    // delay some time
    if(this.time < this.startTime) {
      return;
    }
    // finish animation
    if(this.elapsed === this.duration) {
      if(!this.finished) {
        this.onFinish && this.onFinish(this.keys);
        this.finished = true;
      }
      return;
    }
    this.elapsed = this.time - this.startTime;
    this.elapsed = this.elapsed > this.duration ? this.duration : this.elapsed;
    for(let key in this.to) {
      this.keys[key] = this.from[key] + ( this.to[key] - this.from[key] ) * easing[this.easing](this.elapsed / this.duration);
    }
    if(!this.started) {
      this.onStart && this.onStart(this.keys);
      this.started = true;
    }
    this.onUpdate(this.keys);
  }
}
