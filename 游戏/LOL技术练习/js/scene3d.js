window.LOL = window.LOL || {};

LOL.Scene3D = {
  init(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1410);
    this.scene.fog = new THREE.Fog(0x0a1410, 2400, 5200);
    this.camera = new THREE.PerspectiveCamera(36, 1, 10, 9000);
    this.camTarget = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.hit = new THREE.Vector3();
    this.heroMesh = null;
    this.dummyMeshes = new Map();
    this.projMeshes = [];
    this.fxMeshes = [];
    this.rangeRing = null;
    this.moveMark = null;
    this.aMark = null;
    this.windup = null;
    this.buildWorld();
    this.resize();
  },

  buildWorld() {
    const W = LOL.CONFIG.MAP_W;
    const H = LOL.CONFIG.MAP_H;
    const amb = new THREE.AmbientLight(0xb8d4c8, 0.55);
    this.scene.add(amb);
    const sun = new THREE.DirectionalLight(0xfff2d6, 1.05);
    sun.position.set(600, 900, 200);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -900;
    sun.shadow.camera.right = 900;
    sun.shadow.camera.top = 900;
    sun.shadow.camera.bottom = -900;
    sun.shadow.camera.far = 2500;
    this.scene.add(sun);
    this.sun = sun;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      new THREE.MeshStandardMaterial({ color: 0x1a3328, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(W / 2, 0, H / 2);
    ground.receiveShadow = true;
    this.scene.add(ground);
    this.groundMesh = ground;

    const grid = new THREE.GridHelper(Math.max(W, H), 64, 0x2f5a45, 0x243d32);
    grid.position.set(W / 2, 0.4, H / 2);
    this.scene.add(grid);

    this.addBrush(W * 0.4, H * 0.2, 160);
    this.addBrush(W * 0.7, H * 0.72, 190);
    this.addBrush(W * 0.25, H * 0.65, 140);

    const lane = new THREE.Mesh(
      new THREE.BoxGeometry(40, 2, Math.hypot(W, H) * 0.85),
      new THREE.MeshStandardMaterial({ color: 0x3d5a80, roughness: 0.85 })
    );
    lane.position.set(W * 0.48, 1, H * 0.48);
    lane.rotation.y = -Math.atan2(H - 260, W - 280);
    lane.receiveShadow = true;
    this.scene.add(lane);

    this.rangeFill = new THREE.Mesh(
      new THREE.CircleGeometry(420, 64),
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false,
      })
    );
    this.rangeFill.rotation.x = -Math.PI / 2;
    this.rangeFill.visible = false;
    this.scene.add(this.rangeFill);

    this.rangeRing = new THREE.Mesh(
      new THREE.RingGeometry(414, 426, 72),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    );
    this.rangeRing.rotation.x = -Math.PI / 2;
    this.rangeRing.visible = false;
    this.scene.add(this.rangeRing);
    this._range = 420;

    this.moveMark = this.marker(0x7dd3fc);
    this.aMark = this.marker(0xfca5a5);
    this.windup = new THREE.Mesh(
      new THREE.TorusGeometry(40, 3.2, 8, 32, Math.PI * 2),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    this.windup.visible = false;
    this.scene.add(this.windup);
  },

  addBrush(x, z, r) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(r, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 1, transparent: true, opacity: 0.72 })
    );
    m.position.set(x, r * 0.25, z);
    m.scale.y = 0.45;
    m.castShadow = true;
    this.scene.add(m);
  },

  marker(color) {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(14, 24, 24),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    m.rotation.x = -Math.PI / 2;
    m.visible = false;
    this.scene.add(m);
    return m;
  },

  resize() {
    const w = this.canvas.parentElement.clientWidth;
    const h = this.canvas.parentElement.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  },

  unproject(sx, sy) {
    const rect = this.canvas.getBoundingClientRect();
    this.ndc.x = ((sx / rect.width) * 2) - 1;
    this.ndc.y = -((sy / rect.height) * 2) + 1;
    this.raycaster.setFromCamera(this.ndc, this.camera);
    if (this.raycaster.ray.intersectPlane(this.groundPlane, this.hit)) {
      return { x: this.hit.x, y: this.hit.z };
    }
    return { x: 0, y: 0 };
  },
};
