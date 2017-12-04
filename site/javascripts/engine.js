// FIXME: is this needed?
import { Spring, PointMass } from './javascripts/physics_objects.js';

export function update() {
  // Reset forces and acceleration for the timestep
  pointMasses.forEach(function(pm){
    pm.F_x = 0;
    pm.F_y = 0;
    pm.a_x = 0;
    pm.a_y = 0;
  })

  // Apply forces from springs
  springs.forEach(function(sp){

    // Update distances
    sp.deltaX = (sp.pm_2.x - sp.pm_1.x)/CANVAS_WIDTH;
    sp.deltaY = (sp.pm_2.y - sp.pm_1.y)/CANVAS_WIDTH;
    sp.dist = sp.compute_length();

    sp.springForce();

    // Muscle controls
    if (keydown.space){
      sp.expand();
    }

    if (keydown.ctrl){
      sp.contract();
    }
  })

  // Apply point specific forces
  pointMasses.forEach(function(pm){
    controls(pm);

    physics(pm);
  })

  // Apply kinematics
  pointMasses.forEach(function(pm){
    pm.a_x = pm.F_x / pm.mass;
    pm.a_y = pm.F_y / pm.mass;

    pm.v_x += pm.a_x * TIMESTEP;
    pm.v_y += pm.a_y * TIMESTEP;

    pm.x += pm.v_x * TIMESTEP * CANVAS_WIDTH;
    pm.y += pm.v_y * TIMESTEP * CANVAS_WIDTH;

    check_collisions(pm);
  })
}

function controls(pm) {
  // Correct for faster diagonal movement
  // Sum of vectors must be same as in case where moving along one axis
  // so each is scaled by 1/sqrt(2)
  var step_CONTROL_FORCE = pm.CONTROL_FORCE;

  if ((keydown.left || keydown.right) && (keydown.up || keydown.down)){
    step_CONTROL_FORCE *= 0.70710678118;
  }

  // Movement controls
  if(keydown.left) {
    pm.F_x -= step_CONTROL_FORCE;
  }

  if(keydown.right) {
    pm.F_x += step_CONTROL_FORCE;
  }

  if(keydown.up) {
    pm.F_y -= step_CONTROL_FORCE;
  }

  if(keydown.down) {
    pm.F_y += step_CONTROL_FORCE;
  }
}

function physics(pm){
  // Gravity
  pm.F_y += GRAVITY*pm.mass;

  // Drag
  pm.F_x -= pm.v_x * pm.drag_coefficient;
  pm.F_y -= pm.v_y * pm.drag_coefficient;
}

function check_collisions(pm) {
  if (pm.x < 0 || pm.x > CANVAS_WIDTH){
    pm.v_x *= -pm.elasticity;
  }

  if (pm.y < 0 || pm.y > CANVAS_HEIGHT){
    pm.v_y *= -pm.elasticity;
  }

  // Enforce existence in game area by rebounding
  if (pm.x < 0){
    pm.x = 0 - pm.elasticity*(pm.x - 0);
  } else if (pm.x > CANVAS_WIDTH){
    pm.x = CANVAS_WIDTH - pm.elasticity*(pm.x - CANVAS_WIDTH);
  }

  if (pm.y < 0){
    pm.y = 0 - pm.elasticity*(pm.y - 0);
  } else if (pm.y > CANVAS_HEIGHT){
    pm.y = CANVAS_HEIGHT - pm.elasticity*(pm.y - CANVAS_HEIGHT);
  }
}
