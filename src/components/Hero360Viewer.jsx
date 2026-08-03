/**
 * HERO 360° PANORAMA PREVIEWER
 * Embedded interactive Three.js 360° equirectangular viewer for the Hero Stage.
 * Matches PanoramaViewer360 rendering engine, projection, camera FOV, and quality.
 * Auto-rotates smoothly, pauses on hover/drag, and resumes after 3 seconds of inactivity.
 */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Maximize2 } from 'lucide-react';
import PanoramaViewer360 from './PanoramaViewer360';

export default function Hero360Viewer({ image, showFullscreenBtn = true }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);

  const isHoveredRef = useRef(false);
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  const stateRef = useRef({
    isUserInteracting: false,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
    lon: 0,
    lat: 0,
    velLon: 0,
    velLat: 0,
    lastInteractionTime: Date.now(),
    fov: 75,
    touchDist: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Exact matching FOV & ratio)
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Equirectangular Inverted Sphere Geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 4. Renderer with GPU Acceleration
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 5. Load Texture with High Quality Anisotropic Filtering
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        if (renderer.capabilities) {
          const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
          if (maxAnisotropy > 1) {
            texture.anisotropy = maxAnisotropy;
          }
        }

        if (meshRef.current) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;

          // Fade in texture
          let opacity = 0;
          const fadeIn = () => {
            opacity += 0.08;
            if (meshRef.current) {
              meshRef.current.material.opacity = Math.min(1, opacity);
            }
            if (opacity < 1) requestAnimationFrame(fadeIn);
          };
          fadeIn();
        }
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.error('[Hero360Viewer] Texture load error:', err);
        setIsLoading(false);
      }
    );

    // 6. Render Loop with Auto Rotation & Inactivity Resume
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const st = stateRef.current;
      const inactiveDuration = Date.now() - st.lastInteractionTime;

      if (!st.isUserInteracting) {
        // Inertia damping
        st.lon += st.velLon;
        st.lat += st.velLat;
        st.velLon *= 0.92;
        st.velLat *= 0.92;

        // Auto rotate smoothly (0.05° per frame ~ 3°/sec) when NOT hovered & inactive > 3s
        if (!isHoveredRef.current && inactiveDuration > 3000) {
          st.lon += 0.05;
        }
      }

      // Clamp vertical pitch (-85° to +85°)
      st.lat = Math.max(-85, Math.min(85, st.lat));

      // Calculate 3D target vector
      const phi = THREE.MathUtils.degToRad(90 - st.lat);
      const theta = THREE.MathUtils.degToRad(st.lon);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [image]);

  // Pointer & Touch Handlers
  const handlePointerDown = (e) => {
    if (e.target.closest('.no-drag')) return;
    const st = stateRef.current;
    st.isUserInteracting = true;
    st.lastInteractionTime = Date.now();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    st.onPointerDownPointerX = clientX;
    st.onPointerDownPointerY = clientY;
    st.onPointerDownLon = st.lon;
    st.onPointerDownLat = st.lat;
    st.velLon = 0;
    st.velLat = 0;

    if (e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      st.touchDist = Math.hypot(dx, dy);
    }
  };

  const handlePointerMove = (e) => {
    const st = stateRef.current;
    if (!st.isUserInteracting) return;
    st.lastInteractionTime = Date.now();

    if (e.touches && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const diff = st.touchDist - newDist;
      st.touchDist = newDist;

      updateFov(st.fov + diff * 0.15);
      return;
    }

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = (clientX - st.onPointerDownPointerX) * 0.18;
    const deltaY = (clientY - st.onPointerDownPointerY) * 0.18;

    const newLon = (st.onPointerDownLon - deltaX) % 360;
    const newLat = st.onPointerDownLat + deltaY;

    st.velLon = (newLon - st.lon) * 0.3;
    st.velLat = (newLat - st.lat) * 0.3;

    st.lon = newLon;
    st.lat = newLat;
  };

  const handlePointerUp = () => {
    stateRef.current.isUserInteracting = false;
    stateRef.current.lastInteractionTime = Date.now();
  };

  const handleWheel = (e) => {
    stateRef.current.lastInteractionTime = Date.now();
    updateFov(stateRef.current.fov + e.deltaY * 0.05);
  };

  const updateFov = (newFov) => {
    const clampedFov = Math.max(30, Math.min(95, newFov));
    stateRef.current.fov = clampedFov;
    if (cameraRef.current) {
      cameraRef.current.fov = clampedFov;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'grab' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        stateRef.current.isUserInteracting = false;
        stateRef.current.lastInteractionTime = Date.now();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Progressive Skeleton Loader */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 8, 17, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: '#FFFFFF',
          fontSize: '0.88rem',
          fontWeight: 600,
          zIndex: 5,
        }}>
          <Compass size={18} className="spin-slow" style={{ color: 'var(--apple-blue)' }} /> Loading 360° Panorama...
        </div>
      )}

      {/* Floating Interactive Badge (Top Left) */}
      <div
        className="no-drag"
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          background: 'rgba(5, 8, 17, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          borderRadius: '20px',
          padding: '6px 14px',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}
      >
        <Compass size={14} className="spin-slow" style={{ color: '#60D4F4' }} />
        <span>360° Interactive Tour · Drag to Rotate</span>
      </div>

      {/* Launch Fullscreen Tour Button (Center/Bottom Right) */}
      {showFullscreenBtn && (
        <button
          className="no-drag"
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: 'var(--text-dark-primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--apple-blue)';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
            e.currentTarget.style.color = 'var(--text-dark-primary)';
          }}
        >
          <Maximize2 size={15} /> Launch Fullscreen 360°
        </button>
      )}

      {/* Fullscreen Modal View when clicked */}
      {isModalOpen && (
        <PanoramaViewer360
          initialRoomId="main-reception"
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
