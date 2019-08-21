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

  SetupDroneControls(){
    //Setup slider
    document.getElementById("DroneCont-DroneSlider").oninput = function(){
      let nvalue = parseInt(this.value);

      if(nvalue < 50){
          nvalue = -100 + nvalue;
          nvalue = nvalue / 100;

      }else{
        nvalue = nvalue / 100;
      }


      if(nvalue != 0.50){
        window.App.Drone.SpeedMult = nvalue;
      }
    }

    //When user lets go of slider, reset it's pos and reset the speed multiplier
    document.getElementById("DroneCont-DroneSlider").onmouseup = function(){
      //Set vars
      this.value = 50;

      //Apply drone changes
      window.App.Drone.SpeedMult = 0;
      window.App.Drone.YSpeed =  0.981;
    }

    //Kill drone button
    document.getElementById("DroneCont-KillDrone").onclick = function(){
      window.App.Drone.YSpeed = 0;
    }

  }

  SetupControls(){
    //Set speed
    this.Speed     = 0;
    this.YSpeed    = 0;
    this.SpeedMult = 0.0;
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
    //Get hard values
    let ComputedVal = Val * (window.Delta / 1000);
    let GravEffect = 0.981 * (window.Delta / 1000);

    //If gravity over powers the movement, don't bother
    if((ComputedVal - GravEffect) >= 0){
      window.App.Drone.Model.position[Direction] += ComputedVal;
      window.App.Camera.position[Direction]      += ComputedVal;
    }
  }

  HitFloor(){
    window.App.Drone.Model.position.y = 0.15;
    window.App.Camera.position.y = 3;
  }

  UpdatePosition(){
    //Add effect of grav
    let GravEffect = 0.981 * (window.Delta / 1000);

    //If below the limit of G, just have it hit the floor
    if(window.App.Drone.Model.position.y <= 0.15){
      window.App.Drone.HitFloor();
    }

    //Else just have it drop due to G
    else {
      window.App.Drone.Model.position.y -= GravEffect;
      window.App.Camera.position.y      -= GravEffect;
    }

    /** BUTTON CONTROL
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
      //window.App.Drone.Reposition("y", window.App.Drone.Speed);
      window.App.Drone.YSpeed += window.App.Drone.SpeedMult;
    }

    //Down
    if(Buttons.shift == 1){
      window.App.Drone.YSpeed -= window.App.Drone.SpeedMult;
    }
    **/
    //Apply speed
    window.App.Drone.YSpeed += (window.App.Drone.SpeedMult * (window.Delta / 1000));
    window.App.Drone.Reposition("y", window.App.Drone.YSpeed);


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
    document.getElementById("Stats-DroneLocation").innerHTML = "Y Position : " + Math.round(window.App.Drone.Model.position.y * 100) / 100;
    document.getElementById("Stats-DroneSpeed").innerHTML    = "Y Speed : " + (Math.round(window.App.Drone.YSpeed * 100) / 100) + " U/S";

  }



}
