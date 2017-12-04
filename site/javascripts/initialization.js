// Imports
// FIXME: needs access to jQuery.inArray 
import { createArray } from 'utils';
import { Spring, PointMass } from 'physics_objects';
import { update } from 'engine';
import { draw } from 'drawing';

// Setting up gamestate
export function initialize(){

  // Initialize object lists
  pointMasses = [];
  springs = [];

  // Create point masses at random
  // TODO: change to case statement
  if (SPAWN_FORMATION == "RECTANGLE"){
    minSpawnX = CANVAS_WIDTH/2  -  CANVAS_WIDTH*SPAWN_SIZE/2;
    minSpawnY = CANVAS_HEIGHT/2 - CANVAS_HEIGHT*SPAWN_SIZE/2;

    for (var i = 1; i <= NUM_PM; i++){
      new PointMass(minSpawnX + Math.random() * CANVAS_WIDTH  * SPAWN_SIZE,
                    minSpawnY + Math.random() * CANVAS_HEIGHT * SPAWN_SIZE);
    }
  } else if (SPAWN_FORMATION == "CIRCLE"){
    center_x = CANVAS_WIDTH/2;
    center_y = CANVAS_HEIGHT/2;
    maxRadius = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2;
    radius = maxRadius * SPAWN_SIZE;

    for (var i = 1; i <= NUM_PM; i++){
      r_i = Math.random() * radius;
      theta_i = Math.random() * 2 * Math.PI;
      x_i = center_x + r_i*Math.cos(theta_i);
      y_i = center_y + r_i*Math.sin(theta_i);

      new PointMass(x_i, y_i);
    }
  } else if (SPAWN_FORMATION == "RING"){
    center_x = CANVAS_WIDTH/2;
    center_y = CANVAS_HEIGHT/2;
    max_radius = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2;
    radius = max_radius * SPAWN_SIZE;

    for (var i = 1; i <= NUM_PM; i++){
      theta_i = Math.random() * 2 * Math.PI;
      x_i = center_x + radius*Math.cos(theta_i);
      y_i = center_y + radius*Math.sin(theta_i);

      new PointMass(x_i, y_i);
    }
  } else if (SPAWN_FORMATION == "UNIFORM_RING"){
    center_x = CANVAS_WIDTH/2;
    center_y = CANVAS_HEIGHT/2;
    maxRadius = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2;
    radius = maxRadius * SPAWN_SIZE;

    for (var i = 1; i <= NUM_PM; i++){
      theta_i = i / NUM_PM * 2 * Math.PI;
      x_i = center_x + radius*Math.cos(theta_i);
      y_i = center_y + radius*Math.sin(theta_i);

      new PointMass(x_i, y_i);
    }
  }

  connectivityMatrix = createArray(NUM_PM, NUM_PM);

  // CONNECTIVITY needs to be complemented with NUM_PM - CONNECTIVITY
  // Ensures proper looping
  if (CONNECTIVITY instanceof Array){
    CONNECTIVITY = CONNECTIVITY.concat(CONNECTIVITY.map(x => NUM_PM - x));
  }

  // TODO: cleanup logic
  for (var i = 0; i <= NUM_PM - 1; i++){
    for (var j = 0; j <= NUM_PM - 1; j++){
      // Use only the upper triangular matrix to ensure single connections
      if (i > j){
        if (CONNECTIVITY instanceof Array){
          // Connect k-neighbours
          // inArray returns -1 when not found
          if (jQuery.inArray(i-j, CONNECTIVITY) != -1){
            connectivityMatrix[i][j] = 1;
          } else {
            connectivityMatrix[i][j] = 0;
          }
        // Random connections
        } else if (Math.random() < CONNECTIVITY) {
          connectivityMatrix[i][j] = 1;
        } else {
          connectivityMatrix[i][j] = 0;
        }
      } else {
        connectivityMatrix[i][j] = 0;
      }
    }
  }

  // Create springs based on connectivityMatrix
  for (var i = 0; i <= NUM_PM - 1; i++){
    for (var j = 0; j <= NUM_PM - 1; j++){
      if (connectivityMatrix[i][j] == 1){
        new Spring(pointMasses[i], pointMasses[j]);
      }
    }
  }
}

// Main gameplay loop
export function gameLoop(){
  // TODO: Change to requestAnimationFrame() for performance
  setInterval(function() {
    update();
    draw();
  }, 1000 * TIMESTEP);
}
