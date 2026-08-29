import * as THREE from 'three';

// Every tunable number for the hero particle portrait lives here.
// ParticleField.tsx interpolates these into its GLSL shaders at module load,
// so editing a value here changes the animation — no shader knowledge needed.

// ---- photo sampling --------------------------------------------------------
export const PHOTO_URL = '/hero-photo.png';
export const TARGET_COUNT = 50000; // rough particle budget (subject pixels that survive sampling)
export const WORLD_HEIGHT = 2.8; // height of the portrait in world units
export const ALPHA_THRESHOLD = 90; // pixels at or below this alpha are treated as transparent
// flood-fill background removal: how close a pixel must be to the border color to count as background
export const BG_DIST_SQ = 100 * 100;

// ---- color -----------------------------------------------------------------
export const ACCENT_A = new THREE.Color('#22d3ee');
export const ACCENT_B = new THREE.Color('#f59e0b');
export const PHOTO_COLOR_WEIGHT = 0.9; // how much of the original photo color survives (0..1)
export const ACCENT_WASH = 0.15; // strength of the accent tint layered on top

// ---- assembly intro ----------------------------------------------------------
export const ASSEMBLY_DURATION = 2.2; // seconds for the scattered cloud to form the portrait
export const SCATTER_X = 3.5; // initial scatter spread per axis (world units)
export const SCATTER_Y = 2.5;
export const SCATTER_Z = 1.5;

// ---- organic drift (wobble) --------------------------------------------------
export const DRIFT_AMP_IDLE = 0.06; // max distance a particle wanders from home when pointer is idle
export const DRIFT_AMP_ACTIVE = 0.025; // ...and when the pointer is over the hero
export const DRIFT_SPEED_X = 0.7; // wobble speed per axis — higher = faster oscillation
export const DRIFT_SPEED_Y = 0.6;
export const DRIFT_SPEED_Z = 0.5;
export const DRIFT_FREQ_XA = 2.1; // spatial frequency — higher = choppier ripples across the portrait
export const DRIFT_FREQ_XB = 1.3;
export const DRIFT_FREQ_YA = 1.9;
export const DRIFT_FREQ_YB = 1.1;
export const DRIFT_FREQ_ZA = 2.3;
export const DRIFT_FREQ_ZB = 0.9;
export const DEPTH_JITTER = 0.06; // random z-thickness of the portrait slab

// ---- pointer dent ------------------------------------------------------------
export const DENT_RADIUS = 1.1; // world-unit radius of the bulge around the cursor
export const DENT_STRENGTH = 0.4; // max sideways push at the cursor center
export const DENT_Z_LIFT = 0.5; // how much dented particles pop toward the camera
export const DENT_EASE = 4; // fade in/out speed of the dent — higher = snappier

// ---- particle appearance -------------------------------------------------------
export const POINT_SIZE_FACTOR = 1.25; // point size as a multiple of the sampling grid spacing
export const PARTICLE_ALPHA = 0.88; // peak opacity of each particle
export const EDGE_FADE_START = 0.16; // squared-distance where the soft circular edge begins...
export const EDGE_FADE_END = 0.25; // ...and ends (0.25 = full point radius)

// ---- layout ------------------------------------------------------------------
export const PORTRAIT_OFFSET = 0.22; // fraction of viewport width the portrait shifts right on desktop
export const PORTRAIT_BREAKPOINT = 1024; // px — below this the portrait stays centered
export const OFFSET_EASE = 6; // how quickly the portrait glides to its offset position
