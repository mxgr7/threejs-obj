import {useEffect, useRef} from 'react';
import './App.css';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function doStuff(el, objUrl, mtlUrl) {

			let camera, scene, renderer;

			let object;

			init();


			function init() {

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20 );
				camera.position.z = 1.5;

				// scene

				scene = new THREE.Scene();

				const ambientLight = new THREE.AmbientLight( 0xffffff );
				scene.add( ambientLight );

				const pointLight = new THREE.PointLight( 0xffffff, 15 );
        pointLight.position.z = 3
				scene.add( pointLight );
				scene.add( camera );

				// manager

				function loadModel() {

					object.position.y = 0;
					object.position.z = -2.2;
					object.scale.setScalar( 0.01 );
					scene.add( object );

					render();

				}

				const manager = new THREE.LoadingManager( loadModel );

				// model

				function onProgress( xhr ) {

					if ( xhr.lengthComputable ) {

						const percentComplete = xhr.loaded / xhr.total * 100;
						console.log( 'model ' + percentComplete.toFixed( 2 ) + '% downloaded' );

					}

				}

				function onError() {}

        const mtlLoader = new MTLLoader( manager )
        mtlLoader.load(mtlUrl, (materials) => {
          materials.preload()
          const loader = new OBJLoader( manager );
          loader.setMaterials(materials).load(objUrl, function ( obj ) {

            object = obj;

          }, onProgress, onError );
        })


				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				el.appendChild( renderer.domElement );

				//

				const controls = new  OrbitControls( camera, renderer.domElement );
				controls.minDistance = 0.5;
				controls.maxDistance = 5;
				controls.addEventListener( 'change', render );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function render() {

				renderer.render( scene, camera );

			}
}

function App() {
  const threejsEl = useRef(null)
  const initialized = useRef(false)
  useEffect(() => {
    const mtlUrl = process.env.PUBLIC_URL + '/models/hauptstr/odm_textured_model_geo.obj.mtl';
    const objUrl = process.env.PUBLIC_URL + '/models/hauptstr/odm_textured_model_geo.obj';


    if (initialized.current === false) {
      doStuff(threejsEl.current, objUrl, mtlUrl)
    }
    initialized.current = true

  })
  return (
    <div className="App">
      <div ref={threejsEl}>
      </div>
    </div>
  );
}

export default App;
