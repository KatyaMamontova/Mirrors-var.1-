function main() {
  const canvas = document.querySelector('.screen');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialiasing: true
  });

  let fov = 100;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  camera.position.y = 0.3;

  const scene = new THREE.Scene();

  let lightX = 5;
  let lightY = 2;
  const lightZ = 3;

  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.PointLight(color, intensity);
  light.angle = 0.5;
  light.position.set(lightX, lightY, lightZ);
  scene.add(light);

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  //фон
  const loader = new THREE.TextureLoader();
  {

    const texture = loader.load(
      'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
  }

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  //материалы

  const materialColor = new THREE.MeshStandardMaterial({
    color: '#faf',
    roughness: 0.3,
    metalness: 0.2
  });

  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024);
  const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
  const materialMirror = new THREE.MeshStandardMaterial({
    envMap: cubeRenderTarget.texture,
    roughness: 0.01,
    metalness: 1,
    side: THREE.DoubleSide,
  });


  //M

  const height = 2;

  const widthP = 1.5;
  const heightP = height;
  const planeGeometry = new THREE.PlaneGeometry(widthP, heightP);
  const plane1 = new THREE.Mesh(planeGeometry, materialMirror);
  plane1.position.x = -1;
  plane1.rotateY(-Math.PI / 2);

  scene.add(plane1);

  //E

  const radiusTop = 0.2;
  const radiusBottom = 0.2;
  const heightLC = height;
  const radialSegments = 12;
  const longCylinderGeometry = new THREE.CylinderGeometry(
    radiusTop, radiusBottom, heightLC, radialSegments);
  const cylinder = new THREE.Mesh(longCylinderGeometry, materialColor);

  scene.add(cylinder);

  //M2
  /* const plane2 = new THREE.Reflector(
    new THREE.PlaneGeometry(2, 2),
    {
      color: new THREE.Color(0x7f7f7f),
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio
    }
  ) */
  const plane2 = new THREE.Mesh(planeGeometry, materialMirror);
  plane2.position.x = 1;
  plane2.rotateY(Math.PI / 2);

  scene.add(plane2);

  function render() {

    cubeCamera.update(renderer, scene);
    materialMirror.envMap = cubeRenderTarget.texture;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

window.onload = () => main();