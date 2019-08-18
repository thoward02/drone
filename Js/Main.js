
window.Start = function(){
  //Calculate canvas with and height
  let CanavsWidth  = window.innerWidth;
  let CanvasHeight = window.innerHeight * 0.9;

  //Setup Config
  let Config = {
    "Element" : document.getElementById("App-Body"),
    "CanvasHeight" : CanvasHeight,
    "CanvasWidth"  : CanavsWidth,
  }

  //Start up the canvas
  window.App = new App(Config);
  window.App.Start();
}


document.addEventListener("DOMContentLoaded", function(){

  window.Start();

})
