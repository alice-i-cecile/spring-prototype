// FIXME: is this needed?
import { Spring, PointMass } from 'physics_objects';

export function draw() {
  canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  canvas.globalAlpha = 1;
  canvas.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  canvas.font="20px Courier";
  canvas.fillText(`FPS: ${FPS}`, 0.9*CANVAS_WIDTH, 0.05*CANVAS_HEIGHT);

  canvas.globalAlpha = PM_ALPHA;
  pointMasses.forEach(function(pm){
    pm.draw();
  })

  canvas.globalAlpha = SPRING_ALPHA;
  springs.forEach(function(sp){
    sp.draw();
  })
}
