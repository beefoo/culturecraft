class Mask {
  constructor(options = {}) {
    const defaults = {
      activeW: 256,
      activeH: 256,
      debug: false,
      height: 512,
      minThickness: 0.4,
      maxThickness: 1,
      nLength: 1, // [0 - 1.] how "long" shapes should be
      shapeCount: 3,
      width: 512,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    const {
      activeW, activeH, height, minThickness, maxThickness, shapeCount, width,
    } = this.options;
    const nThickness = MathUtil.lerp(minThickness, maxThickness, 1 - this.options.nLength);
    const scaledActiveH = Math.max(Math.round(activeH * nThickness), 16);

    // calculate bounds
    const leftX = Math.ceil((width - activeW) / 2);
    const rightX = Math.floor(leftX + activeW);
    const topY = Math.ceil((height - scaledActiveH) / 2);
    const bottomY = Math.floor(topY + scaledActiveH);
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    const halfWidth = Math.round(activeW / 2);
    const halfHeight = Math.round(scaledActiveH / 2);
    const quarterWidth = Math.round(halfWidth / 2);
    const quarterHeight = Math.round(halfHeight / 2);

    // define section bounds
    this.middleBounds = {
      topY: topY + quarterHeight,
      rightX,
      bottomY: bottomY - quarterHeight,
      leftX,
      centerX,
      centerY,
    };
    this.topLeftBounds = {
      topY,
      rightX: leftX + quarterWidth * 3,
      bottomY: topY + quarterHeight,
      leftX,
      centerX: leftX + Math.round((quarterWidth * 3) / 2),
      centerY: topY + Math.round(quarterHeight / 2),
    };
    this.topRightBounds = {
      topY,
      rightX,
      bottomY: topY + quarterHeight,
      leftX: leftX + quarterWidth,
      centerX: rightX - Math.round((quarterWidth * 3) / 2),
      centerY: topY + Math.round(quarterHeight / 2),
    };
    this.bottomLeftBounds = {
      topY: bottomY - quarterHeight,
      rightX: leftX + quarterWidth * 3,
      bottomY,
      leftX,
      centerX: leftX + Math.round((quarterWidth * 3) / 2),
      centerY: bottomY - Math.round(quarterHeight / 2),
    };
    this.bottomRightBounds = {
      topY: bottomY - quarterHeight,
      rightX,
      bottomY,
      leftX: leftX + quarterWidth,
      centerX: rightX - Math.round((quarterWidth * 3) / 2),
      centerY: bottomY - Math.round(quarterHeight / 2),
    };

    const path = new Path2D();
    _.times(shapeCount, (i) => this.addShape(path, i));
    this.path = path;
  }

  addShape(path, i) {
    // determine which section bounds
    let bounds = this.middleBounds;
    const isTop = (i > 0 && i % 2 > 0);
    let isLeft = true;

    if (isTop) {
      if ((i + 1) % 4 > 0) bounds = this.topLeftBounds;
      else {
        isLeft = false;
        bounds = this.topRightBounds;
      }
    } else if (i > 0) {
      if (i % 4 > 0) bounds = this.bottomLeftBounds;
      else {
        isLeft = false;
        bounds = this.bottomRightBounds;
      }
    }

    const { rightX, centerX, centerY } = bounds;
    let { topY, bottomY, leftX } = bounds;
    const width = rightX - leftX;
    const height = bottomY - topY;

    if (this.options.debug) {
      path.moveTo(leftX, topY);
      path.lineTo(rightX, centerY);
      path.lineTo(leftX, bottomY);
      path.lineTo(leftX, topY);
      return;
    }

    if (i > 0) {
      const newWidth = Math.round(MathUtil.lerp(width * 0.25, width, Math.random()));
      const newHeight = Math.round(MathUtil.lerp(height * 0.25, height, Math.random()));
      if (isTop) bottomY = topY + newHeight;
      else topY = bottomY - newHeight;
      leftX = rightX - newWidth;
    }

    const points = [];
    // right side
    points.push({
      x: rightX,
      y: centerY,
    });
    // top side
    points.push({
      x: MathUtil.lerp(leftX + 1, rightX - 1, Math.random()),
      y: topY,
    });
    // left side
    points.push({
      x: leftX,
      y: MathUtil.lerp(topY + 1, bottomY - 1, Math.random()),
    });
    // bottom side
    points.push({
      x: MathUtil.lerp(leftX + 1, rightX - 1, Math.random()),
      y: bottomY,
    });
    points.push(_.clone(points[0]));

    _.each(points, (point, pointIndex) => {
      const x = Math.round(point.x);
      const y = Math.round(point.y);
      if (pointIndex === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
  }
}
