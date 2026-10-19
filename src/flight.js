import * as THREE from "three";

// Original modeled aircraft and seeded cloud field; every pose is a function of scroll.
export function setupFlight() {
  const host = document.querySelector("#flight-world"),
    story = document.querySelector(".flight-story");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = preference.matches,
    mobile = innerWidth < 700;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    document.body.classList.add("no-webgl");
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1 : 1.5));
  renderer.setClearColor(0x83b6d1, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xbad6df, 0.006);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x668298, 1.6));
  const sun = new THREE.DirectionalLight(0xfff3dc, 3);
  sun.position.set(-12, 20, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -12;
  scene.add(sun);
  const plane = new THREE.Group();
  scene.add(plane);
  const ivory = new THREE.MeshStandardMaterial({
    color: 0xf5eee0,
    metalness: 0.28,
    roughness: 0.3,
  });
  const red = new THREE.MeshStandardMaterial({
    color: 0xc54730,
    metalness: 0.22,
    roughness: 0.32,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x193545,
    metalness: 0.55,
    roughness: 0.2,
  });
  const mesh = (geo, mat, x, y, z, parent = plane) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  // Long tapered fuselage, rounded nose, swept main wings, tail and cockpit.
  const profile = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    profile.push(
      new THREE.Vector2(
        Math.sin(Math.PI * t) ** 0.65 * (0.32 + 0.16 * t),
        -2.8 + t * 5.6,
      ),
    );
  }
  const body = mesh(new THREE.LatheGeometry(profile, 40), ivory, 0, 0, 0);
  body.rotation.x = Math.PI / 2;
  const wing = (points, mat, y, z) => {
    const shape = new THREE.Shape();
    points.forEach(([x, z], i) =>
      i ? shape.lineTo(x, z) : shape.moveTo(x, z),
    );
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.075,
      bevelEnabled: true,
      bevelSize: 0.055,
      bevelThickness: 0.025,
      bevelSegments: 2,
      steps: 1,
    });
    g.rotateX(Math.PI / 2);
    return mesh(g, mat, 0, y, z);
  };
  wing(
    [
      [-5, 1.15],
      [-5, 0.55],
      [-0.5, -0.8],
      [0.5, -0.8],
      [5, 0.55],
      [5, 1.15],
      [0.5, 0.6],
      [-0.5, 0.6],
    ],
    ivory,
    -0.04,
    0,
  );
  wing(
    [
      [-4.95, 1.12],
      [-4.95, 0.58],
      [-4.2, 0.37],
      [-4.2, 1.03],
    ],
    red,
    0.015,
    0,
  );
  wing(
    [
      [4.95, 1.12],
      [4.95, 0.58],
      [4.2, 0.37],
      [4.2, 1.03],
    ],
    red,
    0.015,
    0,
  );
  wing(
    [
      [-1.9, 0.65],
      [-1.9, 0.25],
      [-0.2, -0.35],
      [0.2, -0.35],
      [1.9, 0.25],
      [1.9, 0.65],
    ],
    red,
    0.12,
    2.05,
  );
  const fin = mesh(new THREE.BoxGeometry(0.09, 1.1, 1.1), red, 0, 0.5, 2.05);
  fin.rotation.x = -0.3;
  const cockpit = mesh(
    new THREE.SphereGeometry(1, 32, 20),
    dark,
    0,
    0.29,
    -0.65,
  );
  cockpit.scale.set(0.31, 0.29, 0.7);
  const nose = mesh(new THREE.SphereGeometry(0.33, 24, 16), red, 0, 0, -2.48);
  nose.scale.z = 1.3;
  const prop = new THREE.Group();
  prop.position.z = -2.92;
  plane.add(prop);
  for (let i = 0; i < 3; i++) {
    const blade = mesh(
      new THREE.BoxGeometry(0.12, 1.95, 0.035),
      dark,
      0,
      0,
      0,
      prop,
    );
    blade.rotation.z = (i * Math.PI) / 3;
  }
  mesh(new THREE.SphereGeometry(0.13, 16, 12), ivory, 0, 0, -2.97);
  // Soft, internally shaded cloud sprites built from an original procedural texture.
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  let seed = 29;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = 0; i < 22; i++) {
    const x = 45 + rand() * 166,
      y = 105 + rand() * 65 - Math.sin((i / 22) * Math.PI) * 35,
      r = 22 + rand() * 26;
    const gradient = ctx.createRadialGradient(
      x - r * 0.13,
      y - r * 0.25,
      r * 0.15,
      x,
      y,
      r,
    );
    gradient.addColorStop(0, "rgba(255,255,250,.88)");
    gradient.addColorStop(0.5, "rgba(248,250,247,.82)");
    gradient.addColorStop(0.75, "rgba(214,226,230,.64)");
    gradient.addColorStop(0.92, "rgba(190,209,220,.24)");
    gradient.addColorStop(1, "rgba(180,205,220,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const texture = new THREE.CanvasTexture(c),
    clouds = new THREE.Group();
  scene.add(clouds);
  for (let i = 0; i < 48; i++) {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0.6 + rand() * 0.2,
        color: i % 4 === 0 ? 0xe4edf0 : 0xffffff,
      }),
    );
    let x = (rand() > 0.5 ? 1 : -1) * (20 + rand() * 50),
      y = (rand() - 0.5) * 25 - 10,
      z = -rand() * 180 - 12;
    if (i < 12) {
      x = (i % 2 ? 1 : -1) * (28 + rand() * 15);
      y = -16 + rand() * 8;
      z = -rand() * 70 - 25;
    }
    sprite.position.set(x, y, z);
    const size = 12 + rand() * 15;
    sprite.scale.set(size * 1.7, size, 1);
    clouds.add(sprite);
  }
  const keys = [
    {
      p: 0,
      pos: [4, -0.5, 0],
      rot: [0.03, -0.58, -0.14],
      cam: [11, 6, 17],
      look: [0, 0, 0],
    },
    {
      p: 0.2,
      pos: [3, 1, -10],
      rot: [-0.12, -0.2, -0.5],
      cam: [9, 5, 9],
      look: [1, 0, -10],
    },
    {
      p: 0.47,
      pos: [-2, 5, -32],
      rot: [-0.22, 0.55, 0.52],
      cam: [-12, 9, -16],
      look: [-2, 4, -32],
    },
    {
      p: 0.73,
      pos: [0, 8, -58],
      rot: [-0.05, 1.6, 0.15],
      cam: [-15, 12, -60],
      look: [0, 7, -58],
    },
    {
      p: 1,
      pos: [3, 12, -85],
      rot: [-0.18, 2.6, -0.3],
      cam: [8, 15, -103],
      look: [3, 11, -85],
    },
  ];
  let current = 0,
    target = 0,
    frame,
    lastTime = performance.now();
  function draw() {
    let p = reduced ? 0 : current;
    const k = keys.findIndex(
      (k, i) => i < keys.length - 1 && p >= k.p && p <= keys[i + 1].p,
    );
    const a = keys[Math.max(0, k)],
      b = keys[Math.min(keys.length - 1, Math.max(0, k) + 1)];
    let t = THREE.MathUtils.smoothstep(p, a.p, b.p);
    const interp = (name) =>
      a[name].map((v, i) => THREE.MathUtils.lerp(v, b[name][i], t));
    plane.position.set(...interp("pos"));
    const r = interp("rot");
    plane.rotation.set(r[0], r[1], mobile ? r[2] * 0.4 : r[2]);
    camera.position.set(...interp("cam"));
    const look = interp("look");
    look[0] -= THREE.MathUtils.smoothstep(p, 0.2, 0.5) * 5;
    camera.lookAt(...look);
    if (mobile) {
      camera.position.x += 3;
      camera.position.z += 9;
      camera.lookAt(plane.position);
    }
    prop.rotation.z = p * 240;
    renderer.render(scene, camera);
    story.style.setProperty("--flight", p);
    host.dataset.progress = p.toFixed(4);
  }
  function tick() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.25);
    lastTime = now;
    current += (target - current) * (1 - Math.exp(-dt * 12));
    if (Math.abs(target - current) < 0.0001) current = target;
    draw();
    if (current !== target) frame = requestAnimationFrame(tick);
    else frame = null;
  }
  function update() {
    target = THREE.MathUtils.clamp(
      -story.getBoundingClientRect().top / (story.offsetHeight - innerHeight),
      0,
      1,
    );
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function resize() {
    mobile = innerWidth < 700;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    if (mobile)
      camera.setViewOffset(
        innerWidth,
        innerHeight,
        0,
        -innerHeight * 0.26,
        innerWidth,
        innerHeight,
      );
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    update();
    draw();
  }
  function setMotion(value) {
    reduced = value;
    document.body.classList.toggle("reduced-motion", value);
    const button = document.querySelector(".motion-toggle");
    button.setAttribute("aria-pressed", String(value));
    button.textContent = value ? "Enable motion" : "Less motion";
    update();
    draw();
  }
  document
    .querySelector(".motion-toggle")
    .addEventListener("click", () => setMotion(!reduced));
  preference.addEventListener("change", (e) => setMotion(e.matches));
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", resize);
  resize();
  setMotion(reduced);
}
