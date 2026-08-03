import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import {
  X,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Compass,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { virtualTourRooms } from '../data/virtualTourData';

export default function PanoramaViewer360({ initialRoomId, onClose }) {
  const containerRef = useRef(null);

  // State
  const [currentRoomId, setCurrentRoomId] = useState(initialRoomId || 'main-reception');
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [fov, setFov] = useState(75);

  const room = virtualTourRooms.find((r) => r.id === currentRoomId) || virtualTourRooms[0];
  const roomIndex = virtualTourRooms.findIndex((r) => r.id === room.id);

  // Three.js mutable refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);

  // Rotation & physics state
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

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ── Initialize Three.js Scene ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Sphere Mesh for Equirectangular Panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert sphere so texture displays inside

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // 4. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 5. Render Loop with Inertia & Auto Rotation
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const st = stateRef.current;

      // Inactivity check for Auto Rotation
      const inactiveDuration = Date.now() - st.lastInteractionTime;

      if (!st.isUserInteracting) {
        // Inertia damping
        st.lon += st.velLon;
        st.lat += st.velLat;
        st.velLon *= 0.92;
        st.velLat *= 0.92;

        // Auto rotate if inactive for > 4.5s and auto rotate is enabled
        if (inactiveDuration > 4500 && isAutoRotating) {
          st.lon += 0.08;
        }
      }

      // Clamp vertical latitude pitch (-85° to +85°)
      st.lat = Math.max(-85, Math.min(85, st.lat));

      // Calculate 3D target vector from spherical angles
      const phi = THREE.MathUtils.degToRad(90 - st.lat);
      const theta = THREE.MathUtils.degToRad(st.lon);

      camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(camera.target);
      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
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
  }, []);

  // ── Load Texture when Current Room Changes ────────────────────────────────
  useEffect(() => {
    if (!meshRef.current) return;

    setIsLoading(true);
    const textureLoader = new THREE.TextureLoader();

    // Smoothly fade out old texture
    meshRef.current.material.opacity = 0;

    textureLoader.load(
      room.image,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        if (meshRef.current) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;

          // Fade in new texture
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
        console.error('[PanoramaViewer360] Texture load error:', err);
        setIsLoading(false);
      }
    );
  }, [currentRoomId]);

  // ── Pointer & Touch Event Handlers ────────────────────────────────────────
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

    // Touch Pinch Zoom handling
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

  const handleDoubleClick = () => {
    stateRef.current.lastInteractionTime = Date.now();
    const targetFov = stateRef.current.fov > 55 ? 45 : 75;
    updateFov(targetFov);
  };

  const updateFov = (newFov) => {
    const clampedFov = Math.max(30, Math.min(95, newFov));
    stateRef.current.fov = clampedFov;
    setFov(Math.round(clampedFov));
    if (cameraRef.current) {
      cameraRef.current.fov = clampedFov;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const resetView = () => {
    stateRef.current.lon = 0;
    stateRef.current.lat = 0;
    stateRef.current.velLon = 0;
    stateRef.current.velLat = 0;
    stateRef.current.lastInteractionTime = Date.now();
    updateFov(75);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const prevRoom = () => {
    const nextIdx = (roomIndex - 1 + virtualTourRooms.length) % virtualTourRooms.length;
    setCurrentRoomId(virtualTourRooms[nextIdx].id);
  };

  const nextRoom = () => {
    const nextIdx = (roomIndex + 1) % virtualTourRooms.length;
    setCurrentRoomId(virtualTourRooms[nextIdx].id);
  };

  // ── Viewer Portal JSX ─────────────────────────────────────────────────────
  const viewerJSX = (
    <div
      className="pano-360-overlay"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="pano-360-canvas" />

      {/* Progressive Skeleton Loader */}
      {isLoading && (
        <div className="pano-360-loader no-drag">
          <div className="pano-loader-spinner" />
          <div className="pano-loader-text">
            <Sparkles size={16} /> Loading 360° Equirectangular Panorama...
          </div>
        </div>
      )}

      {/* Top Left Header (Room Name & Details) */}
      <div className="pano-360-top-left no-drag">
        <div className="pano-badge">
          <Compass size={14} className="spin-slow" /> 360° Virtual Tour ({roomIndex + 1} / {virtualTourRooms.length})
        </div>
        <h2 className="pano-title">{room.title}</h2>
        <p className="pano-desc">{room.description}</p>
      </div>

      {/* Top Right Close Button */}
      <div className="pano-360-top-right no-drag">
        <button className="pano-icon-btn close-btn" onClick={onClose} title="Close 360° Virtual Tour">
          <X size={20} />
        </button>
      </div>

      {/* Navigation Arrows (Prev / Next Room) */}
      <button className="pano-nav-arrow left no-drag" onClick={prevRoom} title="Previous Room">
        <ChevronLeft size={24} />
      </button>
      <button className="pano-nav-arrow right no-drag" onClick={nextRoom} title="Next Room">
        <ChevronRight size={24} />
      </button>

      {/* Bottom Center Floating Glass Control Bar */}
      <div className="pano-360-controls-bar no-drag">
        {/* Reset View */}
        <button className="pano-ctrl-btn" onClick={resetView} title="Reset Camera View">
          <RotateCcw size={18} />
          <span className="ctrl-label">Reset</span>
        </button>

        {/* Zoom Out */}
        <button className="pano-ctrl-btn" onClick={() => updateFov(stateRef.current.fov + 10)} title="Zoom Out">
          <ZoomOut size={18} />
        </button>

        {/* FOV Indicator */}
        <span className="pano-fov-indicator">{fov}°</span>

        {/* Zoom In */}
        <button className="pano-ctrl-btn" onClick={() => updateFov(stateRef.current.fov - 10)} title="Zoom In">
          <ZoomIn size={18} />
        </button>

        <div className="pano-ctrl-divider" />

        {/* Auto Rotate Toggle */}
        <button
          className={`pano-ctrl-btn ${isAutoRotating ? 'active' : ''}`}
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Auto-Rotate' : 'Start Auto-Rotate'}
        >
          {isAutoRotating ? <Pause size={18} /> : <Play size={18} />}
          <span className="ctrl-label">{isAutoRotating ? 'Rotating' : 'Rotate'}</span>
        </button>

        {/* Toggle Thumbnail Strip */}
        <button
          className={`pano-ctrl-btn ${showThumbnails ? 'active' : ''}`}
          onClick={() => setShowThumbnails(!showThumbnails)}
          title="Toggle Room Carousel"
        >
          <Layers size={18} />
          <span className="ctrl-label">Rooms</span>
        </button>

        {/* Fullscreen Toggle */}
        <button className="pano-ctrl-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Bottom Thumbnail Strip Carousel */}
      {showThumbnails && (
        <div className="pano-360-thumb-strip no-drag">
          <div className="pano-thumb-scroll">
            {virtualTourRooms.map((r) => (
              <button
                key={r.id}
                className={`pano-thumb-card ${r.id === currentRoomId ? 'active' : ''}`}
                onClick={() => setCurrentRoomId(r.id)}
              >
                <img src={r.image} alt={r.title} loading="lazy" />
                <div className="pano-thumb-overlay">
                  <span>{r.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(viewerJSX, document.body);
}
