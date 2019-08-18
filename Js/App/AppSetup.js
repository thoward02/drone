class App{
  //Setup
  constructor(Settings){
    //Apply config
    this.Config   = Settings;

    //Setup renderer
    this.Renderer = new THREE.WebGLRenderer();
    this.Scene    = new THREE.Scene();
    this.Camera   = new THREE.PerspectiveCamera(75, this.Config.CanvasWidth / this.Config.CanvasHeight, 0.1, 1000);

    //Flesh out renderer
    this.Renderer.setSize(this.Config.CanvasWidth, this.Config.CanvasHeight);

    //Append Renderer
    this.Config.Element.appendChild(this.Renderer.domElement);

    //Setup timimg
    window.CurrentTime = Date.now();
    window.LastTime    = Date.now();
    window.Delta       = 0;

    //Setup Objects to Update
    this.ToUpdate = [];

  }

  Animate(){
    window.CurrentTime = Date.now();
    window.Delta       = window.CurrentTime - window.LastTime;
    window.LastTime = window.CurrentTime;
    //Setup next frame
    requestAnimationFrame(window.App.Animate);

    //Render camera and scene
    window.App.Renderer.render(window.App.Scene, window.App.Camera);

    //Update
    for(var Objects in window.App.ToUpdate){
      window.App.ToUpdate[Objects].Update();
    }
  }


  //Run
  Start(){
    //Add scene
    this.CreateScene();

    //Start animation
    this.Animate();
  }

  CreateScene(){
    //Build Drone
    this.Drone = new Drone();
    this.Scene.add(this.Drone.Model);
    //Add drone to update list
    this.ToUpdate[this.ToUpdate.length] = this.Drone;

    //Build Floor
    let geometry = new THREE.BoxGeometry(10, 0.1, 10);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let Floor     = new THREE.Mesh(geometry, material);


    //Append shape
    this.Scene.add(Floor);

    //Set camera pos so we can see it
    this.Camera.position.z = 5;
    this.Camera.position.y = 3;
    this.Camera.rotation.x = -30 * Math.PI / 180

  }


}
