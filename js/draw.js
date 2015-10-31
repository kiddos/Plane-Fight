function drawRotation(image, x, y, rad) {
  context.translate(x, y);
  context.translate(image.width/2, image.height/2);
  context.rotate(rad);
  context.drawImage(image, -image.width/2, -image.height/2);
  context.rotate(-rad);
  context.translate(-image.width/2, -image.height/2);
  context.translate(-x, -y);
}
