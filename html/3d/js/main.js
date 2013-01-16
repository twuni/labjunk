$( function() {

  var hasWebGL = ( function() {

    var canvas = document.createElement("canvas"), gl = null;

    try { gl = canvas.getContext("webgl"); } catch(x) { gl = null; }

    if( gl == null ) {
      try { gl = canvas.getContext("experimental-webgl"); } catch(x) { gl = null; }
    }

    return gl !== null;

  } )();

  var renderer = hasWebGL ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer({overdraw:true});
  renderer.setSize( window.innerWidth, window.innerHeight );

  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 300;

  Movement.prototype.report = function() {
    sphere.rotation.y += this.velocity.x * 0.1;
    sphere.rotation.x += this.velocity.y * 0.1;
  };

  var scene = new THREE.Scene();
  scene.add( camera );

  var sphere = new THREE.Mesh( new THREE.SphereGeometry( 50, 16, 16 ), new THREE.MeshPhongMaterial( {
    map: THREE.ImageUtils.loadTexture("images/earth_texture.jpg"),
    specularMap: THREE.ImageUtils.loadTexture("images/earth_spec.jpg"),
    bumpMap: THREE.ImageUtils.loadTexture("images/earth_bump.jpg")
  } ) );
  scene.add( sphere );

  var lighting = new THREE.PointLight( 0xFFFFFF );

  lighting.position.x = 10;
  lighting.position.y = 50;
  lighting.position.z = 130;

  scene.add( lighting );

  ( function() {
    requestAnimationFrame( arguments.callee );
    sphere.rotation.y += 0.001;
    renderer.render( scene, camera );
  } )();

  $("#viewport").append(renderer.domElement);

} );
