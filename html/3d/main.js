$( function() {

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 300;

  var control = {
    position: {
      x: -1,
      y: -1
    },
    velocity: {
      x: 0,
      y: 0
    },
    acceleration: {
      x: 0,
      y: 0
    },
    active: false
  };

  $(window).on( "mousemove", function( event ) {

    control.acceleration.x = event.pageX - control.position.x - control.velocity.x;
    control.acceleration.x = event.pageY - control.position.y - control.velocity.y;
    control.velocity.x = event.pageX - control.position.x;
    control.velocity.y = event.pageY - control.position.y;
    control.position.x = event.pageX;
    control.position.y = event.pageY;

    if( control.active ) {
      sphere.rotation.y += control.velocity.x * 0.01;
      sphere.rotation.x += control.velocity.y * 0.01;
    }

  } );

  $(window).on( "mousedown", function() { control.active = true; } );
  $(window).on( "mouseup", function() { control.active = false; } );

  var scene = new THREE.Scene();
  scene.add( camera );

  var sphere = new THREE.Mesh( new THREE.SphereGeometry( 50, 16, 16 ), new THREE.MeshLambertMaterial( {
    map: THREE.ImageUtils.loadTexture("earth.jpg")
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
