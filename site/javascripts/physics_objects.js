export class PointMass {
  constructor (x, y){
    this.x = x;
    this.y = y;

    this.v_x = 0;
    this.v_y = 0;

    this.a_x = 0;
    this.a_y = 0;

    this.F_x = 0;
    this.F_y = 0;

    this.CONTROL_FORCE = CONTROL_FORCE;
    this.drag_coefficient = DRAG_COEFFICIENT;
    this.elasticity = ELASTICITY;
    this.mass = PM_MASS;

    pointMasses.push(this);
  }

  draw() {
    canvas.beginPath();
    canvas.arc(this.x, this.y,
               PM_SIZE,
               0, 2*Math.PI);
    canvas.fill();
  }
}

export class Spring {
  constructor (pm_1, pm_2){
    this.pm_1 = pm_1;
    this.pm_2 = pm_2;

    this.deltaX = (this.pm_2.x - this.pm_1.x)/CANVAS_WIDTH;
    this.deltaY = (this.pm_2.y - this.pm_1.y)/CANVAS_WIDTH;
    this.length = this.compute_length(); // resting distance
    this.dist = this.length; // current distance

    this.stiffness = SPRING_STIFFNESS;
    this.strength = this.stiffness * RELATIVE_STRENGTH;

    springs.push(this);
  }

  draw() {
    canvas.beginPath();
    canvas.moveTo(this.pm_1.x, this.pm_1.y);
    canvas.lineTo(this.pm_2.x, this.pm_2.y);
    canvas.stroke();
  }

  compute_length() {
    var dist = Math.sqrt(this.deltaX*this.deltaX + this.deltaY*this.deltaY);
    // If distance becomes zero then object disappears
    dist = Math.max(dist, 1e-6);

    return dist;
  }

  springForce() {
    // Hooke's law
    var force = {};
    force.total = -1 * this.stiffness * (this.length - this.dist);
    force.x = force.total * this.deltaX / this.dist;
    force.y = force.total * this.deltaY / this.dist;

    this.pm_1.F_x += force.x;
    this.pm_2.F_x -= force.x;

    this.pm_1.F_y += force.y;
    this.pm_2.F_y -= force.y;
  }

  muscle(){
    // Relative strength is the fraction of the lenth the muscle can change
    var force = {};
    force.total = this.strength * this.length;

    force.x = force.total * this.deltaX / this.dist;
    force.y = force.total * this.deltaY / this.dist;

    console.log(force);
    return force;
  }

  contract(){
    var force = this.muscle()
    this.pm_1.F_x += force.x;
    this.pm_2.F_x -= force.x;

    this.pm_1.F_y += force.y;
    this.pm_2.F_y -= force.y;
  }

  expand(){
    var force = this.muscle()
    this.pm_1.F_x -= force.x;
    this.pm_2.F_x += force.x;

    this.pm_1.F_y -= force.y;
    this.pm_2.F_y += force.y;
  }
}
