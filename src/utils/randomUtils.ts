/**
 * Collection of random number generation utilities for creative coding and experimental art
 */

/**
 * Generates a random number between min and max using uniform distribution
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns A random number between min and max
 * @example
 * const value = random(0, 100); // Returns a number between 0 and 100
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 * @example
 * const value = randomInt(1, 6); // Returns a random dice roll (1-6)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(random(min, max + 1));
};

/**
 * Generates a random number using normal (Gaussian) distribution
 * Uses Box-Muller transform for generating normally distributed random numbers
 * @param mean - The mean (average) of the distribution (default: 0)
 * @param stdDev - The standard deviation of the distribution (default: 1)
 * @returns A random number following normal distribution
 * @example
 * const value = gaussian(0, 1); // Returns a number following standard normal distribution
 * const height = gaussian(170, 10); // Simulates human height distribution
 */
export const gaussian = (mean: number = 0, stdDev: number = 1): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};

/**
 * Generates a random number using exponential distribution
 * Useful for modeling time between events or decay processes
 * @param lambda - The rate parameter (default: 1)
 * @returns A random number following exponential distribution
 * @example
 * const time = exponential(0.5); // Simulates time between events with rate 0.5
 */
export const exponential = (lambda: number = 1): number => {
  return -Math.log(1 - Math.random()) / lambda;
};

/**
 * Generates a random point on a circle's circumference
 * @param radius - The radius of the circle (default: 1)
 * @returns An object containing x and y coordinates of the point
 * @example
 * const point = randomPointOnCircle(50);
 * // Returns { x: 25, y: 43.3 } (coordinates on circle with radius 50)
 */
export const randomPointOnCircle = (
  radius: number = 1
): { x: number; y: number } => {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};

/**
 * Generates a random point on a sphere's surface
 * Uses spherical coordinates for uniform distribution
 * @param radius - The radius of the sphere (default: 1)
 * @returns An object containing x, y, and z coordinates of the point
 * @example
 * const point = randomPointOnSphere(100);
 * // Returns { x: 45.2, y: -32.1, z: 84.3 } (coordinates on sphere with radius 100)
 */
export const randomPointOnSphere = (
  radius: number = 1
): { x: number; y: number; z: number } => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.sin(phi) * Math.sin(theta),
    z: radius * Math.cos(phi),
  };
};

/**
 * Generates a random color in HSL format
 * Returns colors with controlled saturation and lightness for better visual results
 * @returns An object containing hue (0-360), saturation (50-100), and lightness (40-60)
 * @example
 * const color = randomHSL();
 * // Returns { h: 240, s: 75, l: 50 } (a blue-ish color)
 */
export const randomHSL = (): { h: number; s: number; l: number } => {
  return {
    h: random(0, 360),
    s: random(50, 100),
    l: random(40, 60),
  };
};

/**
 * A class that implements a random walk algorithm
 * Useful for simulating particle movement or creating organic patterns
 */
export class RandomWalk {
  private x: number;
  private y: number;
  private stepSize: number;

  /**
   * Creates a new RandomWalk instance
   * @param startX - Initial x position (default: 0)
   * @param startY - Initial y position (default: 0)
   * @param stepSize - Size of each step (default: 1)
   * @example
   * const walker = new RandomWalk(0, 0, 2);
   */
  constructor(startX: number = 0, startY: number = 0, stepSize: number = 1) {
    this.x = startX;
    this.y = startY;
    this.stepSize = stepSize;
  }

  /**
   * Generates the next position in the random walk
   * @returns An object containing the new x and y coordinates
   * @example
   * const walker = new RandomWalk();
   * const nextPos = walker.next();
   * // Returns { x: 0.5, y: -0.3 } (new position after random step)
   */
  next(): { x: number; y: number } {
    const angle = Math.random() * Math.PI * 2;
    this.x += Math.cos(angle) * this.stepSize;
    this.y += Math.sin(angle) * this.stepSize;
    return { x: this.x, y: this.y };
  }
}

/**
 * A Perlin-like noise function that generates smooth, continuous random values
 * Useful for terrain generation, organic animations, and natural-looking randomness
 * @param x - X coordinate in noise space
 * @param y - Y coordinate in noise space (default: 0)
 * @param z - Z coordinate in noise space (default: 0)
 * @returns A value between -1 and 1
 * @example
 * const value = noise(0.5, 0.5); // Returns a smooth random value
 * // Use in a loop for animation:
 * for(let x = 0; x < 100; x++) {
 *   const y = noise(x * 0.1) * 50;
 *   // y will create a smooth, natural-looking curve
 * }
 */
export const noise = (() => {
  const p = new Array(512);
  const permutation = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
    36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120,
    234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
    134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133,
    230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
    1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130,
    116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250,
    124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227,
    47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44,
    154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98,
    108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34,
    242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14,
    239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121,
    50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243,
    141, 128, 195, 78, 66, 215, 61, 156, 180,
  ];

  for (let i = 0; i < 256; i++) {
    p[i] = permutation[i];
    p[256 + i] = permutation[i];
  }

  const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number): number => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number): number => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number = 0, z: number = 0): number => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = fade(x);
    const v = fade(y);
    const w = fade(z);

    const A = p[X] + Y;
    const AA = p[A] + Z;
    const AB = p[A + 1] + Z;
    const B = p[X + 1] + Y;
    const BA = p[B] + Z;
    const BB = p[B + 1] + Z;

    return lerp(
      w,
      lerp(
        v,
        lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
        lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z))
      ),
      lerp(
        v,
        lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
        lerp(
          u,
          grad(p[AB + 1], x, y - 1, z - 1),
          grad(p[BB + 1], x - 1, y - 1, z - 1)
        )
      )
    );
  };
})();

// Example usage:
/*
// Basic random number
const num = random(0, 100);

// Random point on a circle
const point = randomPointOnCircle(50);

// Random walk
const walker = new RandomWalk(0, 0, 2);
const nextPoint = walker.next();

// Noise value
const noiseValue = noise(0.5, 0.5);
*/
