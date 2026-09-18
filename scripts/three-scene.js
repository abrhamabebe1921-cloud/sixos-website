/**
 * SIXOS — Interactive 3D Brand Logo Engine (V9 - Pure Animation Edition)
 * ═════════════════════════════════════════════════════════════════════════════════
 * Centerpiece: The company name "SIXOS" displayed prominently in the middle
 * of the 3D animation stage, featuring:
 *  - Bold, luminous "SIXOS" typography with rich burgundy & rose-gold gradient
 *  - The iconic stylized "6" loop motif in polished metallic chrome
 *  - High-resolution in-memory CanvasTexture (guaranteed 100% offline & zero CORS)
 *  - 3D physical extrusion relief with realistic perspective depth
 *  - Dynamic specular light sweep and pulsing core illumination
 *  - Concentric gyroscopic orbital rings encircling the "SIXOS" name
 *  - 5 interactive service satellites with glowing energy conduits
 * ═════════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ─── WebGL Availability Check ──────────────────────────────────────────────
  function isWebGLAvailable() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const container = document.getElementById('hero-canvas-container');
  const fallback  = document.getElementById('hero-fallback-3d');

  if (!container || !isWebGLAvailable() || typeof THREE === 'undefined') {
    if (fallback)  fallback.classList.add('active');
    if (container) container.style.display = 'none';
    return;
  }

  // ─── Viewport Detection ───────────────────────────────────────────────────
  function getViewport() {
    const w = window.innerWidth;
    return w <= 640 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
  }
  let viewport = getViewport();

  // ─── Scene & Camera Setup ─────────────────────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);

  function updateCameraPosition() {
    viewport = getViewport();
    if (viewport === 'mobile') {
      camera.position.set(0, 0, 14.8);
    } else if (viewport === 'tablet') {
      camera.position.set(0, 0, 12.5);
    } else {
      camera.position.set(0, 0, 10.4);
    }
    camera.lookAt(0, 0, 0);
  }
  updateCameraPosition();

  // ─── WebGL Renderer ───────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    antialias: viewport !== 'mobile',
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, viewport === 'mobile' ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.domElement.id = 'hero-three-canvas';
  container.appendChild(renderer.domElement);

  // Move the HTML logo overlay to be on top of the canvas (re-append after canvas insert)
  const logoOverlay = document.getElementById('hero-3d-logo-overlay');
  if (logoOverlay) container.appendChild(logoOverlay);

  // ─── Brand Color Palette ───────────────────────────────────────────────────
  const C = {
    deepBurgundy:  0x420D32,
    burgundy:      0x781650,
    burgundyLight: 0x942065,
    magentaRose:   0xC92C85,
    roseGlow:      0xFF9ED5,
    roseSheen:     0xFFC8EA,
    platinum:      0xE8E8F4,
    white:         0xFFFFFF,
    darkRelief:    0x2E0620
  };

  // ─── Studio Lighting Setup ─────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  // Key directional light targeting the "SIXOS" name
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
  keyLight.position.set(6, 8, 8);
  scene.add(keyLight);

  // Rose-tinted fill light
  const fillLight = new THREE.DirectionalLight(0xffb8df, 1.4);
  fillLight.position.set(-8, -4, 5);
  scene.add(fillLight);

  // Logo core pulsing point light directly at (0, 0)
  const coreLight = new THREE.PointLight(C.burgundyLight, 6.0, 16);
  coreLight.position.set(0, 0, 1.6);
  scene.add(coreLight);

  // Dynamic moving specular sheen light across the "SIXOS" letters
  const sheenLight = new THREE.PointLight(C.roseSheen, 4.2, 14);
  sheenLight.position.set(-3, 1.5, 2.2);
  scene.add(sheenLight);

  // Rim back-light for glass plinth bevels
  const rimLight = new THREE.PointLight(C.deepBurgundy, 3.5, 15);
  rimLight.position.set(0, 3.5, -3);
  scene.add(rimLight);

  // ─── Master 3D Universe Group ──────────────────────────────────────────────
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. DYNAMIC HIGH-RES "SIXOS" NAME TEXTURE GENERATOR (ZERO CORS / OFFLINE)
  // ═══════════════════════════════════════════════════════════════════════════
  function createSixosEmblemTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 512, cy = 256;

    ctx.clearRect(0, 0, 1024, 512);

    // Radial back-glow
    const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 480);
    bgGrad.addColorStop(0, 'rgba(255, 158, 213, 0.45)');
    bgGrad.addColorStop(0.35, 'rgba(148, 32, 101, 0.25)');
    bgGrad.addColorStop(0.7, 'rgba(66, 13, 50, 0.06)');
    bgGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 480, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted Glass Shield Plinth
    const pw = 840, ph = 400, pr = 42;
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(cx - pw/2, cy - ph/2, pw, ph, pr);
    } else {
      ctx.rect(cx - pw/2, cy - ph/2, pw, ph);
    }
    // Frosted glass gradient
    const glassGrad = ctx.createLinearGradient(cx - pw/2, cy - ph/2, cx + pw/2, cy + ph/2);
    glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    glassGrad.addColorStop(0.5, 'rgba(255, 248, 252, 0.90)');
    glassGrad.addColorStop(1, 'rgba(255, 240, 248, 0.96)');
    ctx.fillStyle = glassGrad;
    ctx.shadowColor = 'rgba(66, 13, 50, 0.22)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 12;
    ctx.fill();

    // Glowing Neon Border
    ctx.lineWidth = 3.5;
    const borderGrad = ctx.createLinearGradient(cx - pw/2, cy, cx + pw/2, cy);
    borderGrad.addColorStop(0, '#781650');
    borderGrad.addColorStop(0.3, '#FF9ED5');
    borderGrad.addColorStop(0.7, '#C92C85');
    borderGrad.addColorStop(1, '#781650');
    ctx.strokeStyle = borderGrad;
    ctx.stroke();
    ctx.restore();

    // Iconic Stylized Metallic Pink "6" Loop (Centered Emblem Logo - No Brown Text)
    ctx.save();
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const loopX = cx;
    const loopY = cy; // centered in emblem plinth

    const loopGrad = ctx.createLinearGradient(loopX - 70, loopY - 100, loopX + 70, loopY + 60);
    loopGrad.addColorStop(0, '#781650');
    loopGrad.addColorStop(0.3, '#FF9ED5');
    loopGrad.addColorStop(0.65, '#C92C85');
    loopGrad.addColorStop(1, '#942065');
    ctx.strokeStyle = loopGrad;
    ctx.shadowColor = 'rgba(255, 158, 213, 0.9)';
    ctx.shadowBlur = 28;

    ctx.beginPath();
    ctx.moveTo(loopX - 35, loopY + 32);
    ctx.bezierCurveTo(loopX - 12, loopY - 40, loopX + 44, loopY - 98, loopX + 25, loopY - 120);
    ctx.bezierCurveTo(loopX + 7, loopY - 138, loopX - 30, loopY - 120, loopX - 35, loopY - 75);
    ctx.bezierCurveTo(loopX - 40, loopY - 22, loopX + 35, loopY - 12, loopX + 35, loopY + 20);
    ctx.bezierCurveTo(loopX + 35, loopY + 55, loopX - 22, loopY + 58, loopX - 35, loopY + 32);
    ctx.stroke();
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return { texture, canvas };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. 3D "SIXOS" EMBLEM CONSTRUCT (Positioned dead-center at 0, 0)
  // ═══════════════════════════════════════════════════════════════════════════
  const logoGroup = new THREE.Group();
  masterGroup.add(logoGroup);

  const emblemW = viewport === 'mobile' ? 6.2 : 7.4;
  const emblemH = emblemW * (512 / 1024);

  const { texture: sixosTex, canvas: sixosCanvas } = createSixosEmblemTexture();

  // A. Front High-Fidelity "SIXOS" Name Plane
  const planeGeo = new THREE.PlaneGeometry(emblemW, emblemH, 32, 32);
  const frontMat = new THREE.MeshStandardMaterial({
    map: sixosTex,
    transparent: true,
    alphaTest: 0.01,
    roughness: 0.12,
    metalness: 0.85,
    emissive: C.burgundyLight,
    emissiveIntensity: 0.22,
    side: THREE.DoubleSide
  });
  const sixosMeshFront = new THREE.Mesh(planeGeo, frontMat);
  sixosMeshFront.position.set(0, 0, 0.06);
  logoGroup.add(sixosMeshFront);

  // B. Physical 3D Extrusion Relief Layer (Creates authentic depth on tilt)
  const reliefMat = new THREE.MeshBasicMaterial({
    map: sixosTex,
    transparent: true,
    color: C.darkRelief,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  const sixosMeshRelief = new THREE.Mesh(planeGeo, reliefMat);
  sixosMeshRelief.position.set(0.04, -0.04, -0.08);
  sixosMeshRelief.scale.set(0.996, 0.996, 1);
  logoGroup.add(sixosMeshRelief);

  // C. Sample Canvas Pixels to build 3D Stardust Constellation Particles
  function buildSixosConstellation() {
    const w = 256;
    const h = 128;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = w;
    offCanvas.height = h;
    const offCtx = offCanvas.getContext('2d');
    offCtx.drawImage(sixosCanvas, 0, 0, w, h);
    const imgData = offCtx.getImageData(0, 0, w, h).data;

    const sampledPoints = [];
    const step = 3;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        const alpha = imgData[idx + 3];
        if (alpha > 60) {
          const nx = (x / w - 0.5) * emblemW;
          const ny = -(y / h - 0.5) * emblemH;
          const nz = 0.12 + (Math.random() - 0.5) * 0.18;

          const r = imgData[idx]     / 255;
          const g = imgData[idx + 1] / 255;
          const b = imgData[idx + 2] / 255;

          sampledPoints.push({
            x: nx, y: ny, z: nz,
            ox: nx, oy: ny, oz: nz,
            r, g, b,
            seed: Math.random() * 10
          });
        }
      }
    }

    const count = Math.min(sampledPoints.length, 900);
    const stride = Math.max(1, Math.floor(sampledPoints.length / count));
    const posArray = new Float32Array(count * 3);
    const colArray = new Float32Array(count * 3);

    const validCoords = [];
    for (let i = 0; i < count; i++) {
      const pt = sampledPoints[i * stride] || sampledPoints[i];
      validCoords.push(pt);
      posArray[i * 3]     = pt.x;
      posArray[i * 3 + 1] = pt.y;
      posArray[i * 3 + 2] = pt.z;

      colArray[i * 3]     = Math.min(1.0, pt.r * 1.4 + 0.1);
      colArray[i * 3 + 1] = Math.min(1.0, pt.g * 1.4 + 0.05);
      colArray[i * 3 + 2] = Math.min(1.0, pt.b * 1.4 + 0.1);
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

    const pMat = new THREE.PointsMaterial({
      size: viewport === 'mobile' ? 0.075 : 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const pts = new THREE.Points(pGeo, pMat);
    pts.position.set(0, 0, 0);
    logoGroup.add(pts);
    return { pts, validCoords };
  }

  const { pts: constellationParticles, validCoords: constellationData } = buildSixosConstellation();

  // D. Ambient Radial Backlight Aura behind "SIXOS"
  const auraGeo = new THREE.PlaneGeometry(emblemW * 1.4, emblemH * 1.5);
  const auraCanvas = document.createElement('canvas');
  auraCanvas.width = 128;
  auraCanvas.height = 128;
  const aCtx = auraCanvas.getContext('2d');
  const grad = aCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 158, 213, 0.65)');
  grad.addColorStop(0.35, 'rgba(201, 44, 133, 0.42)');
  grad.addColorStop(0.7, 'rgba(120, 22, 80, 0.18)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  aCtx.fillStyle = grad;
  aCtx.fillRect(0, 0, 128, 128);

  const auraTex = new THREE.CanvasTexture(auraCanvas);
  const auraMat = new THREE.MeshBasicMaterial({
    map: auraTex,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const auraMesh = new THREE.Mesh(auraGeo, auraMat);
  auraMesh.position.set(0, 0, -0.3);
  logoGroup.add(auraMesh);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. KINETIC GYROSCOPIC ORBITAL RINGS (Symmetrically Encircling "SIXOS")
  // ═══════════════════════════════════════════════════════════════════════════
  const orbitGroup = new THREE.Group();
  masterGroup.add(orbitGroup);

  // Outer Grand Ring 1 — Rich Burgundy Metallic Ribbon
  const grandRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(5.6, 0.024, 16, 180),
    new THREE.MeshStandardMaterial({
      color: C.burgundyLight,
      metalness: 0.92,
      roughness: 0.12,
      emissive: C.deepBurgundy,
      emissiveIntensity: 0.38
    })
  );
  grandRing1.rotation.x = Math.PI / 2.7;
  grandRing1.rotation.y = Math.PI / 12;
  orbitGroup.add(grandRing1);

  // Ring 1 Satellite Orb
  const sat1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 16, 16),
    new THREE.MeshBasicMaterial({ color: C.white })
  );
  sat1.position.set(5.6, 0, 0);
  grandRing1.add(sat1);

  // Grand Ring 2 — Rose Gold Tilted Luminous Ring
  const grandRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(4.8, 0.018, 14, 160),
    new THREE.MeshStandardMaterial({
      color: C.roseGlow,
      metalness: 0.88,
      roughness: 0.18,
      transparent: true,
      opacity: 0.7
    })
  );
  grandRing2.rotation.x = -Math.PI / 3.2;
  grandRing2.rotation.y =  Math.PI / 3.4;
  orbitGroup.add(grandRing2);

  // Ring 2 Satellite Orb
  const sat2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 14, 14),
    new THREE.MeshBasicMaterial({ color: C.roseGlow })
  );
  sat2.position.set(-4.8, 0, 0);
  grandRing2.add(sat2);

  // Grand Ring 3 — Equatorial Fine Liquid Platinum Ribbon
  const grandRing3 = new THREE.Mesh(
    new THREE.TorusGeometry(4.1, 0.014, 10, 140),
    new THREE.MeshBasicMaterial({
      color: C.platinum,
      transparent: true,
      opacity: 0.5
    })
  );
  grandRing3.rotation.x = Math.PI / 1.9;
  grandRing3.rotation.z = Math.PI / 7;
  orbitGroup.add(grandRing3);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. SERVICE SATELLITES & SYNAPSE ENERGY CONDUITS (Framing "SIXOS" in Center)
  // ═══════════════════════════════════════════════════════════════════════════
  const nodeDefs = [
    { id: 'customer-support', basePos: new THREE.Vector3(-5.0,  2.2,  1.0), color: 0x942065, type: 'orb' },
    { id: 'call-center',      basePos: new THREE.Vector3( 5.0,  2.1, -0.7), color: 0x781650, type: 'arc' },
    { id: 'ecommerce',        basePos: new THREE.Vector3(-5.1, -2.1, -0.6), color: 0x5a103c, type: 'box' },
    { id: 'virtual-assistant',basePos: new THREE.Vector3( 5.1, -1.9,  0.8), color: 0x942065, type: 'plates' },
    { id: 'dedicated-teams',  basePos: new THREE.Vector3( 0.0,  3.6, -0.8), color: 0x781650, type: 'cluster' }
  ];

  const serviceNodes   = [];
  const interactMeshes = [];
  const conduitBeads   = [];

  nodeDefs.forEach((def, idx) => {
    const ng = new THREE.Group();
    ng.position.copy(def.basePos);
    ng.userData = { id: def.id, basePos: def.basePos.clone(), isHovered: false, index: idx };

    if (def.type === 'orb') {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 32, 32),
        new THREE.MeshPhysicalMaterial({
          color: def.color, metalness: 0.8, roughness: 0.12,
          clearcoat: 0.8, emissive: C.deepBurgundy, emissiveIntensity: 0.4
        })
      );
      ng.add(orb);
      const orb2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 20, 20),
        new THREE.MeshStandardMaterial({ color: C.roseGlow, metalness: 0.9, roughness: 0.1 })
      );
      orb2.position.set(0.34, 0.25, 0.12);
      ng.add(orb2);
      ng.add(new THREE.Mesh(
        new THREE.TorusGeometry(0.52, 0.015, 12, 48),
        new THREE.MeshBasicMaterial({ color: C.roseGlow, transparent: true, opacity: 0.55 })
      ));

    } else if (def.type === 'arc') {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(0.40, 0.055, 14, 36, Math.PI * 1.4),
        new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.9, roughness: 0.15 })
      );
      arc.rotation.z = Math.PI / 3;
      ng.add(arc);
      ng.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 20, 20),
        new THREE.MeshStandardMaterial({ color: C.white, metalness: 0.92, roughness: 0.08 })
      ));

    } else if (def.type === 'box') {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.56, 0.56),
        new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.85, roughness: 0.18 })
      );
      box.rotation.set(0.4, 0.6, 0.2);
      ng.add(box);
      box.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.58, 0.58, 0.58)),
        new THREE.LineBasicMaterial({ color: C.roseGlow })
      ));

    } else if (def.type === 'plates') {
      const pm = new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.75, roughness: 0.2 });
      const pg = new THREE.BoxGeometry(0.62, 0.42, 0.05);
      const p1 = new THREE.Mesh(pg, pm);
      p1.rotation.set(0.25, -0.35, 0.15);
      ng.add(p1);
      const p2 = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ color: 0x5a103c, metalness: 0.9, roughness: 0.15 }));
      p2.position.set(0.1, -0.1, -0.12);
      p2.rotation.set(0.15, -0.2, 0.05);
      ng.add(p2);
      ng.add(new THREE.Mesh(
        new THREE.OctahedronGeometry(0.15, 0),
        new THREE.MeshBasicMaterial({ color: C.white })
      ));

    } else { // cluster
      ng.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 20, 20),
        new THREE.MeshStandardMaterial({ color: C.white, metalness: 0.92, roughness: 0.1 })
      ));
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 14, 14),
          new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.88, roughness: 0.18 })
        );
        s.position.set(Math.cos(a) * 0.6, Math.sin(a) * 0.6, i % 2 === 0 ? 0.16 : -0.16);
        ng.add(s);
        ng.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), s.position]),
          new THREE.LineBasicMaterial({ color: C.roseGlow, transparent: true, opacity: 0.58 })
        ));
      }
    }

    // Invisible Hitbox for fluid raycast mouse interaction
    const hb = new THREE.Mesh(new THREE.SphereGeometry(0.92, 12, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hb.userData = { parentNode: ng };
    ng.add(hb);
    interactMeshes.push(hb);

    masterGroup.add(ng);
    serviceNodes.push(ng);

    // Dynamic Energy Conduit connecting the central "SIXOS" core to Satellite Node
    const coreOrigin = new THREE.Vector3(0, 0, 0);
    const midPoint = new THREE.Vector3(
      def.basePos.x * 0.48,
      def.basePos.y * 0.48 + (def.basePos.y > 0 ? 0.35 : -0.35),
      def.basePos.z * 0.45 + 0.12
    );
    const curve = new THREE.QuadraticBezierCurve3(coreOrigin, midPoint, def.basePos);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.016, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: C.burgundy,
      transparent: true,
      opacity: 0.28
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    masterGroup.add(tube);

    // Photon Energy Bead travelling along conduit
    const bead = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 10, 10),
      new THREE.MeshBasicMaterial({ color: C.white })
    );
    masterGroup.add(bead);

    conduitBeads.push({
      mesh: bead,
      curve,
      progress: (idx * 0.22) % 1,
      speed: 0.0032 + idx * 0.0003,
      tubeMat
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ATMOSPHERIC STARDUST AMBIENCE
  // ═══════════════════════════════════════════════════════════════════════════
  const bgPtCount = viewport === 'mobile' ? 90 : viewport === 'tablet' ? 180 : 280;
  const bgPtPos   = new Float32Array(bgPtCount * 3);
  for (let i = 0; i < bgPtCount; i++) {
    bgPtPos[i * 3]     = (Math.random() - 0.5) * 28;
    bgPtPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    bgPtPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 2;
  }
  const bgPtGeo = new THREE.BufferGeometry();
  bgPtGeo.setAttribute('position', new THREE.BufferAttribute(bgPtPos, 3));
  const bgParticles = new THREE.Points(
    bgPtGeo,
    new THREE.PointsMaterial({
      color: C.burgundyLight,
      size: 0.065,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })
  );
  scene.add(bgParticles);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. INTERACTION & INPUT CONTROLS
  // ═══════════════════════════════════════════════════════════════════════════
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const ray = new THREE.Raycaster();
  const mouseCoords = new THREE.Vector2(-999, -999);
  let hoveredNode = null;
  let activeIdx = 0;
  let scrollProg = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragRotX = 0;
  let dragRotY = 0;

  window.addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;

    const r = container.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
      mouseCoords.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    } else {
      mouseCoords.set(-999, -999);
    }

    if (isDragging) {
      const dx = (e.clientX - dragStartX) * 0.005;
      const dy = (e.clientY - dragStartY) * 0.005;
      dragRotY += dx;
      dragRotX += dy;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }
  }, { passive: true });

  container.addEventListener('mousedown', e => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('click', () => {
    if (hoveredNode) {
      window.dispatchEvent(new CustomEvent('sixos:select-service', {
        detail: { serviceId: hoveredNode.userData.id }
      }));
    }
  });

  window.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      mouse.tx = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
    }
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scrollProg = Math.min(window.scrollY / maxScroll, 1);
  }, { passive: true });

  let isVisible = true;
  new IntersectionObserver(e => {
    isVisible = e[0].isIntersecting;
  }, { threshold: 0.05 }).observe(container);

  window.addEventListener('sixos:service-changed', e => {
    const idx = nodeDefs.findIndex(d => d.id === e.detail.serviceId);
    if (idx !== -1) activeIdx = idx;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. ANIMATION & RENDERING LOOP
  // ═══════════════════════════════════════════════════════════════════════════
  const clock = new THREE.Clock();
  const targetScale = new THREE.Vector3();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible && !prefersReducedMotion) return;

    const t = clock.getElapsedTime();

    if (!prefersReducedMotion) {
      // Smooth Camera Parallax Tracking directly centered on (0, 0, 0)
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      camera.position.x = mouse.x * 0.65;
      camera.position.y = -mouse.y * 0.42;
      camera.lookAt(0, 0, 0);

      // Damp drag rotation back towards center
      if (!isDragging) {
        dragRotX *= 0.94;
        dragRotY *= 0.94;
      }

      // === A. "SIXOS" 3D Centered Logo Breathing & Perspective Tilt ===
      const floatY = Math.sin(t * 0.75) * 0.08;
      logoGroup.position.y = floatY;
      logoGroup.rotation.y = Math.sin(t * 0.38) * 0.08 + mouse.x * 0.18 + dragRotY;
      logoGroup.rotation.x = Math.cos(t * 0.42) * 0.04 - mouse.y * 0.14 + dragRotX;

      // Dynamic Specular Light Sweep across metallic "SIXOS" letters
      const sweepCycle = (t * 0.65) % (Math.PI * 2);
      sheenLight.position.x = Math.sin(sweepCycle) * 6.0;
      sheenLight.position.y = Math.cos(sweepCycle) * 2.8 + 1.2;
      sheenLight.intensity = 3.4 + Math.sin(t * 3.0) * 1.2;

      // Pulsing Core Light directly at center
      coreLight.intensity = 5.2 + Math.sin(t * 2.4) * 1.4;

      // Background Radial Aura Pulse
      auraMesh.scale.setScalar(1.0 + Math.sin(t * 1.6) * 0.07);

      // === B. Logo Stardust Constellation Particles Animation ===
      if (constellationParticles && constellationData.length > 0) {
        const positions = constellationParticles.geometry.attributes.position.array;
        const count = constellationData.length;
        const mx = mouseCoords.x * 3.5;
        const my = mouseCoords.y * 2.2;

        for (let i = 0; i < count; i++) {
          const pt = constellationData[i];
          const i3 = i * 3;
          // Organic sine oscillation around center
          const wave = Math.sin(t * 2.2 + pt.seed) * 0.035;
          let tx = pt.ox;
          let ty = pt.oy + wave;
          let tz = pt.oz + Math.cos(t * 1.9 + pt.seed) * 0.03;

          // Interactive cursor proximity push
          if (mouseCoords.x > -900) {
            const dx = tx - mx;
            const dy = ty - my;
            const distSq = dx * dx + dy * dy;
            if (distSq < 1.3) {
              const force = (1.3 - distSq) * 0.24;
              tx += dx * force;
              ty += dy * force;
              tz += force * 0.45;
            }
          }

          // Smooth lerp
          positions[i3]     += (tx - positions[i3]) * 0.1;
          positions[i3 + 1] += (ty - positions[i3 + 1]) * 0.1;
          positions[i3 + 2] += (tz - positions[i3 + 2]) * 0.1;
        }
        constellationParticles.geometry.attributes.position.needsUpdate = true;
      }

      // === C. Gyroscopic Orbital Rings ===
      grandRing1.rotation.z =  t * 0.18;
      grandRing2.rotation.z = -t * 0.14;
      grandRing3.rotation.y =  t * 0.24;

      // Background Stardust Drift
      bgParticles.rotation.y = t * 0.007;

      // === D. Synapse Energy Conduits ===
      conduitBeads.forEach((item, i) => {
        item.progress += item.speed;
        if (item.progress > 1) item.progress = 0;
        item.mesh.position.copy(item.curve.getPoint(item.progress));

        if (i === activeIdx) {
          item.tubeMat.opacity = 0.9;
          item.tubeMat.color.setHex(C.roseGlow);
          item.mesh.scale.setScalar(1.35);
        } else {
          item.tubeMat.opacity = 0.25;
          item.tubeMat.color.setHex(C.burgundy);
          item.mesh.scale.setScalar(1.0);
        }
      });

      // === E. Service Satellites Bob & Scale ===
      serviceNodes.forEach((node, i) => {
        const base = node.userData.basePos;
        const off = i * 1.25;
        node.position.x = base.x + Math.cos(t * 1.1 + off) * 0.06;
        node.position.y = base.y + Math.sin(t * 1.3 + off) * 0.08;
        node.rotation.y += 0.008;

        const s = node.userData.isHovered ? 1.24 : (i === activeIdx ? 1.12 : 1.0);
        targetScale.setScalar(s);
        node.scale.lerp(targetScale, 0.1);
      });

      // === F. Scroll Parallax Morph ===
      masterGroup.rotation.y = scrollProg * Math.PI * 0.75;
      masterGroup.position.y = -scrollProg * 2.0;

      // === G. Raycasting Node Hover ===
      ray.setFromCamera(mouseCoords, camera);
      const hits = ray.intersectObjects(interactMeshes);
      if (hits.length > 0) {
        const targetNode = hits[0].object.userData.parentNode;
        if (hoveredNode !== targetNode) {
          if (hoveredNode) hoveredNode.userData.isHovered = false;
          hoveredNode = targetNode;
          hoveredNode.userData.isHovered = true;
          container.style.cursor = 'pointer';
        }
      } else {
        if (hoveredNode) {
          hoveredNode.userData.isHovered = false;
          hoveredNode = null;
        }
        container.style.cursor = 'default';
      }
    }

    renderer.render(scene, camera);
  }

  animate();

  // ─── Window Resize Handler ────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    if (!container) return;
    updateCameraPosition();
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }, { passive: true });

})();
