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
    for(let Objects in window.App.ToUpdate){
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

  CreateSky(){
    //Create Sky
    this.Sky = new THREE.Sky();
    this.Sky.scale.setScalar( 450000 );

    // Add Sun
		let Sun = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 20000, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0xffffff } )
		);
		Sun.position.y = - 700000;
		Sun.visible = false;

		//Modify sky
		let EffectControler = {
			turbidity: 10,
			rayleigh: 2,
			mieCoefficient: 0.005,
			mieDirectionalG: 0.8,
			luminance: 1,
			inclination: 0.49, // elevation / inclination
			azimuth: 0.25, // Facing front,
			sun: ! true
		};
		let distance = 400000;

    //Bind modifications
    let Uniforms = this.Sky.material.uniforms;
		Uniforms[ "turbidity" ].value = EffectControler.turbidity;
		Uniforms[ "rayleigh" ].value = EffectControler.rayleigh;
		Uniforms[ "luminance" ].value = EffectControler.luminance;
		Uniforms[ "mieCoefficient" ].value = EffectControler.mieCoefficient;
		Uniforms[ "mieDirectionalG" ].value = EffectControler.mieDirectionalG;
		let theta = Math.PI * ( EffectControler.inclination - 0.5 );
		let phi = 2 * Math.PI * ( EffectControler.azimuth - 0.5 );
		Sun.position.x = distance * Math.cos( phi );
		Sun.position.y = distance * Math.sin( phi ) * Math.sin( theta );
		Sun.position.z = distance * Math.sin( phi ) * Math.cos( theta );
		Sun.visible = EffectControler.sun;
		Uniforms[ "sunPosition" ].value.copy( Sun.position );

    this.Scene.add(this.Sky);
    this.Scene.add(Sun);
  }

  CreateScene(){
    //Build Drone
    this.Drone = new Drone();
    this.Scene.add(this.Drone.Model);

    //Add drone to update list
    this.ToUpdate[this.ToUpdate.length] = this.Drone;

    this.CreateSky();

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
