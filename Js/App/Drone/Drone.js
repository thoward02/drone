class Drone{
  //Build object
  constructor(){
    //Build object
    this.Geo   = new THREE.BoxGeometry(1, 0.5, 1);
    this.Mat   = new THREE.MeshPhongMaterial({
      color: 0x7FFFD4,
      emissive: 0x3a3a3a
    });
    this.Model = new THREE.Mesh(this.Geo, this.Mat);

    //Setup controls
    this.SetupControls();


  }

  SetupControls(){
    //Set speed
    this.Speed = 1.75;

    //Setup button
    this.Buttons = {
      "w"       : 0,
      "a"       : 0,
      "s"       : 0,
      "d"       : 0,
      " "       : 0,
      "shift"   : 0
     }

    //Setup controls --  Key Down
    window.onkeydown = function(k){
      //Set key to lowercase to ignore caps
      let KeyPress = k.key.toLowerCase();

      //Loop through buttons and activate ones
      for(var Buttons in window.App.Drone.Buttons){
        if(Buttons == KeyPress){
          window.App.Drone.Buttons[Buttons] = 1;
        }
      }
    }

    //Setup controls -- keyup
    window.onkeyup  = function(k){
      //Set key to lowercase to ignore caps
      let KeyPress = k.key.toLowerCase();

      //Loop through buttons and activate ones
      for(var Buttons in window.App.Drone.Buttons){
        if(Buttons == KeyPress){
          window.App.Drone.Buttons[Buttons] = 0;
        }
      }
    }




  }

  Reposition(Direction, Val){
    window.App.Drone.Model.position[Direction] += Val;
    window.App.Camera.position[Direction]      += Val;
  }

  HitFloor(){
    window.App.Drone.Model.position.y = 0.15;
    window.App.Camera.position.y = 3;
  }

  UpdatePosition(){
    //Add effect of grav
    window.App.Drone.Model.position.y -= 0.0981 * window.Delta;
    window.App.Camera.position.y      -= 0.0981 * window.Delta;
    //Get button pressed
    let Buttons = window.App.Drone.Buttons;

    //Forward
    if(Buttons.w == 1){
      window.App.Drone.Reposition("z", -window.App.Drone.Speed);
    }

    //Backward
    if(Buttons.s == 1){
      window.App.Drone.Reposition("z", window.App.Drone.Speed);

    }

    //Left
    if(Buttons.a == 1){
      window.App.Drone.Reposition("x", -window.App.Drone.Speed);

    }

    //Right
    if(Buttons.d == 1){
      window.App.Drone.Reposition("x", window.App.Drone.Speed);

    }



    //Up
    if(Buttons[" "] == 1){
      window.App.Drone.Reposition("y", window.App.Drone.Speed);

    }

    //Down
    if(Buttons.shift == 1){
      window.App.Drone.Reposition("y", window.App.Drone.Speed);

    }


    //Check and see if it hit the floor
    if(window.App.Drone.Model.position.y <= 0.1){
      window.App.Drone.HitFloor();
    }

    if(window.App.Camera.position.y <= 0.1){
      window.App.Drone.HitFloor();
    }

  }

  Update(){
    //Update drone pos
    this.UpdatePosition();

    //Update drone stats
    document.getElementById("Stats-DroneSpeed").innerHTML = "Y Position : " + Math.round(window.App.Drone.Model.position.y * 100) / 100;

  }



}
