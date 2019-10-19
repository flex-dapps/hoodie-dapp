export function triangle(ctx, x, y, w, h, size, rotation = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate((rotation * Math.PI) / 180)
  var path = new Path2D()
  path.moveTo(size, 0)
  path.lineTo(0, 0 - size)
  path.lineTo(0 - size, 0)
  ctx.fill(path)
  ctx.restore()
}

export function meter(ctx, x, y, width, points, t) {
  let height = width / (points * 3)
  let l = width / points
  let lh = height / 20
  ctx.fillRect(x, y, width, lh)
  let dt = Math.sin((t + 38) / 30) + 1
  for (let i = 0; i < points + 1; i++) {
    ctx.fillRect(x + i * l, y - height + lh, lh, height)
    ctx.textAlign = 'center'
    ctx.fillText(`${i}`, x + i * l, y - height - lh * 3)
  }
  triangle(ctx, x + dt * (width / 2), y - height * 2, width, height, 8, 180)
}

export function barcode(ctx, x, y, w, h, density) {
  let dw = w / density
  for (let i = 0; i < density; i++) {
    let s = Math.sin(i) + 0.5
    ctx.fillRect(x + i * dw, y, dw * s * 0.5, h)
  }
  ctx.textAlign = 'start'
  ctx.fillText(Math.round(Math.random() * 9999), x, y + h * 1.1)
  ctx.textAlign = 'end'
  ctx.fillText(Math.round(Math.random() * 9999), x + w, y + h * 1.1)
}

export function slidingSquare(ctx, x, y, s, n, t, d) {
  let mainP = (Math.sin(t / 30) + 1) * d
  for (let i = 0; i < n; i++) {
    let p = (i * d * 2) / n
    if (mainP > p) {
      ctx.strokeRect(x + p, y + p, s, s)
    }
  }
  ctx.strokeRect(x + mainP, y + mainP, s, s)
}
