// Jason Gao

// Global variables for objects
var background: Color;

var lights = new Array<Light>();
var ambientLight: Color;
var primitives = new Array<Primitive>();

var focalLength: number;
var eye: PerspectiveCamera;

// Helper functions for ignoring a small margin of error during intersection testing
function lessEpsilon(num: number){ 
    return Math.abs(num) < 1e-10; 
} 
function greaterEpsilon(num: number){ 
    return Math.abs(num) > 1e-10; 
}
  
// classes from the Typescript RayTracer sample
export class Vector {
    constructor(public x: number,
                public y: number,
                public z: number) {
    }
    static times(k: number, v: Vector) { return new Vector(k * v.x, k * v.y, k * v.z); }
    static minus(v1: Vector, v2: Vector) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
    static plus(v1: Vector, v2: Vector) { return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z); }
    static dot(v1: Vector, v2: Vector) { return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; }
    static mag(v: Vector) { return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z); }
    static norm(v: Vector) {
        var mag = Vector.mag(v);
        var div = (mag === 0) ? Infinity : 1.0 / mag;
        return Vector.times(div, v);
    }
    static cross(v1: Vector, v2: Vector) {
        return new Vector(v1.y * v2.z - v1.z * v2.y,
                          v1.z * v2.x - v1.x * v2.z,
                          v1.x * v2.y - v1.y * v2.x);
    }
}

export class Color {
    constructor(public r: number,
                public g: number,
                public b: number) {
    }
    static scale(k: number, v: Color) { return new Color(k * v.r, k * v.g, k * v.b); }
    static plus(v1: Color, v2: Color) { return new Color(v1.r + v2.r, v1.g + v2.g, v1.b + v2.b); }
    static times(v1: Color, v2: Color) { return new Color(v1.r * v2.r, v1.g * v2.g, v1.b * v2.b); }
    static white = new Color(1.0, 1.0, 1.0);
    static grey = new Color(0.5, 0.5, 0.5);
    static black = new Color(0.0, 0.0, 0.0);
    static lightness(c: Color) { return Math.sqrt(c.r * c.r + c.g * c.g + c.b * c.b); }
    static toDrawingColor(c: Color) {
        var legalize = (d: number) => d > 1 ? 1 : d;
        return {
            r: Math.floor(legalize(c.r) * 255),
            g: Math.floor(legalize(c.g) * 255),
            b: Math.floor(legalize(c.b) * 255)
        }
    }
}

abstract class Object3D {
    pos: Vector;

    constructor(x: number, y: number, z: number) {
            this.pos = new Vector(x, y, z);
    }

    // Given a ray, return the time parameter of first intersection, if it exists
    // Default intersection is for a single point at the origin
    abstract rayIntersection(ray: Ray): number | null;
}

abstract class Light extends Object3D {
    color: Color;

    constructor(r: number, g: number, b: number, x: number, y: number, z: number) {
        super(x, y, z);
        this.color = new Color(r, g, b);
    }

    // Give ray intersection time for rays guaranteed to intersect light
    // Function added as an optimization to speed up rendering
    // so that shadow rays wouldn't have to be checked to see if they were intersecting the light or not
    abstract rayIntersectionTime(ray: Ray): number;
}

class PointLight extends Light {
    rayIntersectionTime(ray: Ray): number {
        return (this.pos.x - ray.x) / ray.dx;
    }

    rayIntersection(ray: Ray): number | null {
        var xIntersectTime = (this.pos.x - ray.x) / ray.dx;
        var yIntersectTime = (this.pos.y - ray.y) / ray.dy;
        var zIntersectTime = (this.pos.z - ray.z) / ray.dz;

        if (lessEpsilon(xIntersectTime - yIntersectTime) && lessEpsilon(yIntersectTime - zIntersectTime)) {
            return xIntersectTime;
        }
        return null;
    }
}

class AreaLight extends Light {
    u: Vector;
    v: Vector;

    constructor(r: number, g: number, b: number, 
                x: number, y: number, z: number, 
                ux: number, uy: number, uz: number, 
                vx: number, vy: number, vz: number) {
        super(r, g, b, x, y, z);
        this.u = new Vector(ux, uy, uz);
        this.v = new Vector(vx, vy, vz);
    }

    rayIntersectionTime(ray: Ray): number {
        // c - u
        // var nux = this.pos.x - this.u.x;
        // var nuy = this.pos.y - this.u.y;
        // var nuz = this.pos.z - this.u.z;
        // c + u
        var pux = this.pos.x + this.u.x;
        var puy = this.pos.y + this.u.y;
        var puz = this.pos.z + this.u.z;
        // c - v
        var nvx = this.pos.x - this.v.x;
        var nvy = this.pos.y - this.v.y;
        var nvz = this.pos.z - this.v.z;
        // c + v
        var pvx = this.pos.x + this.v.x;
        var pvy = this.pos.y + this.v.y;
        var pvz = this.pos.z + this.v.z;

        var surfaceNormal = Vector.norm(Vector.cross(new Vector(pvx - pux, pvy - puy, pvz - puz), 
                                                     new Vector(nvx - pux, nvy - puy, nvz - puz)));
        // time the ray intersects the disk's plane
        var intersectTime = (surfaceNormal.x * (this.pos.x - ray.x) 
                            + surfaceNormal.y * (this.pos.y - ray.y) 
                            + surfaceNormal.z * (this.pos.z - ray.z))
                            / (surfaceNormal.x * ray.dx + surfaceNormal.y * ray.dy + surfaceNormal.z * ray.dz);
        return intersectTime;
    }

    // NOTE ON FOLLOWING METHOD:
    // Method originally used to determine if a shadow ray would intersect the area light.
    //
    // This was important as we couldn't just to see if a shadow ray intersected an object in order to cast a shadow.
    // For instance, if a shadow ray intersected an object only after it intersected the light first, 
    // then the object would be behind the light and shouldn't cast a shadow on the surface in front of the light.
    //
    // Thus a method for determining if a ray intersected the rectangular area light was needed.
    //
    // However, the method turns out to be fairly expensive 
    // and we know that the shadow rays are guaranteed to intersect the light anyways since they're pointed at the light
    // so the method ends up not getting used :(
    // 
    // Method could be repurposed if rectangle primitive objects were ever implemented. 
    // Also it took forever to write all the implicit equations and project to the largest plane and all... so I'm sad it's not used
    rayIntersection(ray: Ray): number | null {     
        // c - u
        var nux = this.pos.x - this.u.x;
        var nuy = this.pos.y - this.u.y;
        var nuz = this.pos.z - this.u.z;
        // c + u
        var pux = this.pos.x + this.u.x;
        var puy = this.pos.y + this.u.y;
        var puz = this.pos.z + this.u.z;
        // c - v
        var nvx = this.pos.x - this.v.x;
        var nvy = this.pos.y - this.v.y;
        var nvz = this.pos.z - this.v.z;
        // c + v
        var pvx = this.pos.x + this.v.x;
        var pvy = this.pos.y + this.v.y;
        var pvz = this.pos.z + this.v.z;

        var surfaceNormal = Vector.norm(Vector.cross(new Vector(pvx - pux, pvy - puy, pvz - puz), 
                                                     new Vector(nvx - pux, nvy - puy, nvz - puz)));

        // time the ray intersects the disk's plane
        var intersectTime = (surfaceNormal.x * (this.pos.x - ray.x) 
                            + surfaceNormal.y * (this.pos.y - ray.y) 
                            + surfaceNormal.z * (this.pos.z - ray.z))
                            / (surfaceNormal.x * ray.dx + surfaceNormal.y * ray.dy + surfaceNormal.z * ray.dz);

        // intersects behind eye
        if (greaterEpsilon(intersectTime) && intersectTime < 0) {
            return null;
        }

        // plane intersection point
        var intersectX = ray.x + intersectTime * ray.dx;
        var intersectY = ray.y + intersectTime * ray.dy;
        var intersectZ = ray.z + intersectTime * ray.dz;
        var point = new Vector(intersectX, intersectY, intersectZ);
        
        // project rectangle into plane that results in largest area to reduce error when checking for intersections in 2D
        var projAreaXY = Vector.mag(Vector.cross(new Vector(pvx - pux, pvy - puy, 0), 
                                                 new Vector(nvx - pux, nvy - puy, 0)));

        var projAreaXZ = Vector.mag(Vector.cross(new Vector(pvx - pux, 0, pvz - puz), 
                                                 new Vector(nvx - pux, 0, nvz - puz)));

        var projAreaYZ = Vector.mag(Vector.cross(new Vector(0, pvy - puy, pvz - puz), 
                                                 new Vector(0, nvy - puy, nvz - puz)));
        switch (Math.max(projAreaXY, projAreaXZ, projAreaYZ)) {
            case projAreaXY:
                {
                    // implicit equation for (cx - ux, cy - uy) to (cx - vx, cy - vy)
                    let nnnn = (x: number, y: number) => x * (nvy - nuy) - y * (nvx - nux) 
                                                            + nuy * nvx - nux * nvy;

                    // implicit equation for (cx - ux, cy - uy) to (cx + vx, cy + vy)
                    let nnpp = (x: number, y: number) => x * (pvy - nuy) - y * (pvx - nux) 
                                                            + nuy * pvx - nux * pvy;

                    // implicit equation for (cx + ux, cy + uy) to (cx - vx, cy - vy)
                    let ppnn = (x: number, y: number) => x * (nvy - puy) - y * (nvx - pux) 
                                                            + puy * nvx - pux * nvy;

                    // implicit equation for (cx + ux, cy + uy) to (cx + vx, cy + vy)
                    let pppp = (x: number, y: number) => x * (pvy - puy) - y * (pvx - pux) 
                                                            + puy * pvx - pux * pvy;

                    // use implicit equations to determine whether point is within bounds of all lines, i.e. the projected quadrilateral
                    if ((lessEpsilon(nnnn(point.x, point.y)) || Math.sign(nnnn(point.x, point.y)) == Math.sign(nnnn(this.pos.x, this.pos.y)))
                        && (lessEpsilon(nnpp(point.x, point.y)) || Math.sign(nnpp(point.x, point.y)) == Math.sign(nnpp(this.pos.x, this.pos.y)))
                        && (lessEpsilon(ppnn(point.x, point.y)) || Math.sign(ppnn(point.x, point.y)) == Math.sign(ppnn(this.pos.x, this.pos.y)))
                        && (lessEpsilon(pppp(point.x, point.y)) || Math.sign(pppp(point.x, point.y)) == Math.sign(pppp(this.pos.x, this.pos.y)))) {
                            return intersectTime;
                    }
                    return null;
                }
            case projAreaXZ:
                {
                    // implicit equation for (cx - ux, cz - uz) to (cx - vx, cz - vz)
                    let nnnn = (x: number, z: number) => x * (nvz - nuz) - z * (nvx - nux) 
                                                            + nuz * nvx - nux * nvz;

                    // implicit equation for (cx - ux, cz - uz) to (cx + vx, cz + vz)
                    let nnpp = (x: number, z: number) => x * (pvz - nuz) - z * (pvx - nux) 
                                                            + nuz * pvx - nux * pvz;

                    // implicit equation for (cx + ux, cz + uz) to (cx - vx, cz - vz)
                    let ppnn = (x: number, z: number) => x * (nvz - puz) - z * (nvx - pux) 
                                                            + puz * nvx - pux * nvz;

                    // implicit equation for (cx + ux, cz + uz) to (cx + vx, cz + vz)
                    let pppp = (x: number, z: number) => x * (pvz - puz) - z * (pvx - pux) 
                                                            + puz * pvx - pux * pvz;

                    // use implicit equations to determine whether point is within bounds of all lines, i.e. the projected quadrilateral
                    if ((lessEpsilon(nnnn(point.x, point.z)) || Math.sign(nnnn(point.x, point.z)) == Math.sign(nnnn(this.pos.x, this.pos.z)))
                        && (lessEpsilon(nnpp(point.x, point.z)) || Math.sign(nnpp(point.x, point.z)) == Math.sign(nnpp(this.pos.x, this.pos.z)))
                        && (lessEpsilon(ppnn(point.x, point.z)) || Math.sign(ppnn(point.x, point.z)) == Math.sign(ppnn(this.pos.x, this.pos.z)))
                        && (lessEpsilon(pppp(point.x, point.z)) || Math.sign(pppp(point.x, point.z)) == Math.sign(pppp(this.pos.x, this.pos.z)))) {
                            return intersectTime;
                    }
                    return null;
                }
            default:
                {
                    // implicit equation for (cy - uy, cz - uz) to (cy - vy, cz - vz)
                    let nnnn = (y: number, z: number) => y * (nvz - nuz) - z * (nvy - nuy) 
                                                            + nuz * nvy - nuy * nvz;

                    // implicit equation for (cy - uy, cz - uz) to (cy + vy, cz + vz)
                    let nnpp = (y: number, z: number) => y * (pvz - nuz) - z * (pvy - nuy) 
                                                            + nuz * pvy- nuy * pvz;

                    // implicit equation for (cy + uy, cz + uz) to (cy - vy, cz - vz)
                    let ppnn = (y: number, z: number) => y * (nvz - puz) - z* (nvy - puy) 
                                                            + puz * nvy - puy * nvz;

                    // implicit equation for (cy + uy, cz + uz) to (cy + vy, cz + vz)
                    let pppp = (y: number, z: number) => y * (pvz - puz) - z * (pvy - puy) 
                                                            + puz * pvy - puy * pvz

                    // use implicit equations to determine whether point is within bounds of all lines, i.e. the projected quadrilateral
                    if ((lessEpsilon(nnnn(point.y, point.z)) || Math.sign(nnnn(point.y, point.z)) == Math.sign(nnnn(this.pos.y, this.pos.z)))
                        && (lessEpsilon(nnpp(point.y, point.z)) || Math.sign(nnpp(point.y, point.z)) == Math.sign(nnpp(this.pos.y, this.pos.z)))
                        && (lessEpsilon(ppnn(point.y, point.z)) || Math.sign(ppnn(point.y, point.z)) == Math.sign(ppnn(this.pos.y, this.pos.z)))
                        && (lessEpsilon(pppp(point.y, point.z)) || Math.sign(pppp(point.y, point.z)) == Math.sign(pppp(this.pos.y, this.pos.z)))) {
                            return intersectTime;
                    }
                    return null;
                }
        }
    }
}

class PerspectiveCamera {
    pos: Vector;
    lookAt: Vector;
    up: Vector;
    
    // Orthonormal basis
    u: Vector;
    v: Vector;
    w: Vector;

    constructor(pos: Vector, lookAt: Vector, up: Vector) {
        this.pos = pos;
        this.lookAt = lookAt;
        this.up = up;

        // w is the normalized local positive z vector (where the lookat vector points down the negative z axis)
        this.w = Vector.norm(Vector.times(-1, Vector.minus(this.lookAt, this.pos)));
        // u is the normalized local positive x vector
        this.u = Vector.norm(Vector.cross(Vector.minus(this.up, this.pos), this.w));
        // v is the normalized local positive y vector
        this.v = Vector.norm(Vector.cross(this.w, this.u));
    }
}

abstract class Primitive extends Object3D {
    diffuseColor: Color;
    ambientMod: number;
    specularMod: number;
    specularPower: number;

    vx: number;
    vy: number;
    vz: number;

    constructor(x: number, y: number, z: number, 
        dr: number, dg: number, db: number, 
        kAmbient: number, kSpecular: number, specularPower: number,
        vx: number = 0, vy: number = 0, vz: number = 0) {
            super(x, y, z);
            this.diffuseColor = new Color(dr, dg, db);
            this.ambientMod = kAmbient;
            this.specularMod = kSpecular;
            this.specularPower = specularPower;

            this.vx = vx;
            this.vy = vy;
            this.vz = vz;
    }

    // Returns the surface normal of a point on the primitive
    abstract getSurfaceNormal(point: Vector): Vector;
}

class Sphere extends Primitive {
    radius: number;

    constructor(x: number, y: number, z: number, r: number, 
        dr: number, dg: number, db: number, 
        kAmbient: number, kSpecular: number, specularPower: number, 
        vx?: number, vy?: number, vz?: number) {
            super(x, y, z, dr, dg, db, kAmbient, kSpecular, specularPower, vx, vy, vz);
            this.radius = r;
    }

    rayIntersection(ray: Ray): number | null {
        // Coefficients for quadratic equation
        var a = Math.pow(ray.dx, 2) + Math.pow(ray.dy, 2) + Math.pow(ray.dz, 2);
        var b = 2 * (ray.dx * (ray.x - this.pos.x) + ray.dy * (ray.y - this.pos.y) + ray.dz * (ray.z - this.pos.z));
        var c = Math.pow(ray.x - this.pos.x, 2) 
                + Math.pow(ray.y - this.pos.y, 2) 
                + Math.pow(ray.z - this.pos.z, 2) 
                - Math.pow(this.radius, 2);

        // Quadratic equation
        const discriminant = Math.pow(b, 2) - (4 * a * c);
        // Negative discriminant = no real answers = no intersection
        if (greaterEpsilon(discriminant) && discriminant < 0) {
            return null;
        // Zero discriminant = 1 real answer = 1 intersection, grazes the sphere
        } else if (lessEpsilon(discriminant)) {
            return (-b) / (2 * a);
        // Positive discriminant = 2 real answers = 2 intersections, take the closer one
        } else {
            var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

            return Math.min(t1, t2);
        }
    }

    getSurfaceNormal(point: Vector): Vector {
        return Vector.norm(new Vector(point.x - this.pos.x, point.y - this.pos.y, point.z - this.pos.z));
    }
}

class Disk extends Primitive {
    radius: number;
    normal: Vector;

    constructor(x: number, y: number, z: number, r: number, 
        nx:number, ny:number, nz:number,
        dr: number, dg: number, db: number, 
        kAmbient: number, kSpecular: number, specularPower: number, 
        vx?: number, vy?: number, vz?: number) {
            super(x, y, z, dr, dg, db, kAmbient, kSpecular, specularPower, vx, vy, vz);
            this.radius = r;
            this.normal = Vector.norm(new Vector(nx, ny, nz));
    }

    rayIntersection(ray: Ray): number | null {
        // time the ray intersects the disk's plane
        var intersectTime = (this.normal.x * (this.pos.x - ray.x) 
                            + this.normal.y * (this.pos.y - ray.y) 
                            + this.normal.z * (this.pos.z - ray.z))
                            / (this.normal.x * ray.dx + this.normal.y * ray.dy + this.normal.z * ray.dz);
        
        // do not render if intersection is behind eye
        if (greaterEpsilon(intersectTime) && intersectTime < 0) {
            return null;
        }

        // plane intersection point
        var intersectX = ray.x + intersectTime * ray.dx;
        var intersectY = ray.y + intersectTime * ray.dy;
        var intersectZ = ray.z + intersectTime * ray.dz;
    
        // distance from intersection point to center of disk
        var distance = Math.sqrt(Math.pow(intersectX - this.pos.x, 2) 
                       + Math.pow(intersectY - this.pos.y, 2) 
                       + Math.pow(intersectZ - this.pos.z, 2));

        // ray intersects disk if distance from plane intersection point to center is less than or equal to radius
        if (distance <= this.radius) {
            return intersectTime;
        }
        return null;
    }

    getSurfaceNormal(point: Vector): Vector {
        return this.normal;
    }
}

class Ray {
    start: Vector;
    dir: Vector;

    x: number;
    y: number;
    z: number;

    dx: number;
    dy: number;
    dz: number;

    constructor(start: Vector, direction: Vector) {
        this.start = start;
        this.dir = Vector.norm(direction);

        this.x = this.start.x;
        this.y = this.start.y;
        this.z = this.start.z;

        this.dx = this.dir.x;
        this.dy = this.dir.y;
        this.dz = this.dir.z;
    }
}

// a suggested interface for jitter samples
interface Sample {
    s: number,
    t: number
}

// A class for our application state and functionality
class RayTracer {
    // the constructor paramater "canv" is automatically created 
    // as a property because the parameter is marked "public" in the 
    // constructor parameter
    // canv: HTMLCanvasElement
    //
    // rendering context for the canvas, also public
    // ctx: CanvasRenderingContext2D

    // initial color we'll use for the canvas
    canvasColor = "lightyellow"

    canv: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    samples = 1

    // some things that will get specified by user method calls
    enableShadows = true
    jitter = false

    // user method calls set these, for the optional parts of the assignment
    enableBlur = false
    enableReflections = false
    enableDepth = false

    // if you are doing reflection, set some max depth here
    maxDepth = 5;

    constructor (div: HTMLElement,
        public width: number, public height: number, 
        public screenWidth: number, public screenHeight: number) {

        // let's create a canvas and to draw in
        this.canv = document.createElement("canvas");
        this.ctx = this.canv.getContext("2d")!;
        if (!this.ctx) {
            console.warn("our drawing element does not have a 2d drawing context")
            return
        }
        
        div.appendChild(this.canv);

        this.canv.id = "main";
        this.canv.style.width = this.width.toString() + "px";
        this.canv.style.height = this.height.toString() + "px";
        this.canv.width  = this.width;
        this.canv.height = this.height;
    }

    // HINT: SUGGESTED METHOD
    // create an array of samples (size this.samples ^ 2) in the range 0..1, which can
    // be used to create a distribution of rays around a single eye ray or light ray.
    // The distribution would use the jitter parameters to create either a regularly spaced or 
    // randomized set of samples.
    createDistribution(): Sample[] {
        var sampleArray = new Array<Sample>();
        for (let i = 0; i < Math.pow(this.samples, 2); i++) {
            sampleArray.push({s: Math.random(), t: Math.random()});
        }
        return sampleArray;
    }

    // HINT: SUGGESTED BUT NOT REQUIRED, INTERNAL METHOD
    // like traceRay, but returns on first hit. More efficient than traceRay for detecting if "in shadow"
    // Use for shadow rays shot from surface to light source
    // returns true if the ray hits an object before the light, i.e. the surface is being shadowed by another object, otherwise returns false
    private isShadowRay(ray: Ray, light: Light, depth: number = 0): boolean {
        var lightIntersectTime = light.rayIntersectionTime(ray); 
        for (const obj of primitives) {
            var objIntersectTime = obj.rayIntersection(ray);
            // Ray intersects an object before intersecting the light
            if (objIntersectTime 
                && greaterEpsilon(objIntersectTime)
                && Math.sign(objIntersectTime) > 0
                && Math.sign(lightIntersectTime) > 0
                && greaterEpsilon(lightIntersectTime - objIntersectTime)) {
                    return true;
            }
        }
        // Ray does not intersect an object, does not intersect a light, or intersects an object only after intersecting the light source
        return false;
    }

    // NEW COMMANDS FOR PART B

    // create a new disk 
    // 
    // NOTE:  the final vx, vy, vz are only needed for optional motion blur part, 
    // and are the velocity of the object. The object is moving from x,y,z - vx,vy,vz to x,y,z + vx,vy,vz 
    // during the time interval being rendered.
    new_disk (x: number, y: number, z: number, radius: number, 
              nx: number, ny: number, nz: number, dr: number, dg: number, db: number, 
              k_ambient: number, k_specular: number, specular_pow: number,
              vx?: number, vy?: number, vz?: number) {
                  primitives.push(new Disk(x, y, z, radius, nx, ny, nz, dr, dg, db, k_ambient, k_specular, specular_pow, vx, vy, vz));
    }

    // create a new area light source
    area_light (r: number, g: number, b: number, x: number, y: number, z: number, 
                ux: number, uy: number, uz: number, vx: number, vy: number, vz: number) {
                    lights.push(new AreaLight(r, g, b, x, y, z, ux, uy, uz, vx, vy, vz));
    }

    set_sample_level (num: number) {
        this.samples = num
    }

    jitter_on() {
        this.jitter = true
    }

    jitter_off() {
        this.jitter = false
    }

    // turn reflection on or off for extra credit reflection part
    reflection_on() {
        this.enableReflections = true
    }

    reflection_off() {
        this.enableReflections = false
    }

    // turn motion blur on or off for extra credit motion blur part
    blur_on() {
        this.enableBlur = true
    }

    blur_off() {
        this.enableBlur = false
    }

    // turn depth of field on or off for extra credit depth of field part
    depth_on() {
        this.enableDepth = true
    }

    depth_off() {
        this.enableDepth = false
    }

    // COMMANDS FROM PART A

    // clear out all scene contents
    reset_scene() {
        // Reset canvas background color
        background = new Color(1, 1, 224 / 255);

        // Set default ambient light color to white
        ambientLight = new Color(1, 1, 1)

        // Set default fov to 90 degrees
        this.set_fov(90);

        // Set default eye position to origin looking down z axis
        this.set_eye(0, 0, 0, 0, 0, -1, 0, 1, 0);

        // Remove all point lights
        lights.length = 0;

        // Remove all objects
        primitives.length = 0;
    }

    // create a new point light source
    new_light (r: number, g: number, b: number, x: number, y: number, z: number) {
        lights.push(new PointLight(r, g, b, x, y, z));
    }

    // set value of ambient light source
    ambient_light (r: number, g: number, b: number) {
        ambientLight = new Color(r, g, b);
    }

    // set the background color for the scene
    set_background (r: number, g: number, b: number) {
        background = new Color(r, g, b);
    }

    // set the field of view
    DEG2RAD = (Math.PI/180)

    set_fov (theta: number) {
        focalLength = (this.screenHeight / 2) / Math.tan((theta * this.DEG2RAD) / 2);
    }

    // set the virtual camera's viewing direction
    set_eye(x1: number, y1: number, z1: number, 
            x2: number, y2: number, z2: number, 
            x3: number, y3: number, z3: number) {
                eye = new PerspectiveCamera(new Vector(x1, y1, z1), new Vector(x2, y2, z2), new Vector(x3, y3, z3));
    }

    // create a new sphere.
    //
    // NOTE:  the final vx, vy, vz are only needed for optional motion blur part, 
    // and are the velocity of the object. The object is moving from x,y,z - vx,vy,vz to x,y,z + vx,vy,vz 
    // during the time interval being rendered.

    new_sphere (x: number, y: number, z: number, radius: number, 
                dr: number, dg: number, db: number, 
                k_ambient: number, k_specular: number, specular_pow: number, 
                vx?: number, vy?: number, vz?: number) {
                    primitives.push(new Sphere(x, y, z, radius, dr, dg, db, k_ambient, k_specular, specular_pow, vx, vy, vz));
    }

    // INTERNAL METHODS YOU MUST IMPLEMENT

    // create an eye ray based on the current pixel's position
    private eyeRay(i: number, j: number): Ray {
        // Compute the components of the ray in terms of the local coordinates of the eye
        // i and j start from the top left corner of the screen
        var x = Vector.times(i - (this.screenWidth / 2), eye.u);
        // Reversed because j grows from 0 to this.screenHeight positively to the top of the screen
        var y = Vector.times((this.screenHeight / 2) - j, eye.v);
        // w points in the positive z axis, opposite of the direction the camera is pointed
        var z = Vector.times(focalLength, Vector.times(-1, eye.w))

        // The sum of these component vectors is the ray vector in world coordinates
        var rayDir = Vector.plus(x, y);
        rayDir = Vector.plus(rayDir, z);
        
        // Normalize the vector and put it in local coordinates relative to eye position
        rayDir = Vector.norm(Vector.minus(rayDir, eye.pos));
        return new Ray(eye.pos, rayDir);
    }

    private traceRayColor(ray: Ray, depth: number = 0): Color {
        var xInfo = this.traceRay(ray)
        // Return color of first intersection
        if (xInfo?.xPoint && xInfo.xObj) {
            var baseColor = this.illumination(xInfo.xPoint, xInfo.xObj, depth);
            return baseColor;
            // if (this.enableReflections) {
            //     return Color.plus(baseColor, this.reflectionRay(ray, depth, xInfo.xPoint, xInfo.xObj));
            // } else {
            //     return baseColor;
            // }
        }
        // If no objects intersected, return background color
        return Color.black;
    }

    // Traces a ray and returns the intersection point and intersection object for the first intersection
    private traceRay(ray: Ray): {xPoint: Vector, xObj: Primitive} | null {
        // time parameter of first intersection with an Object3D, null if it never intersects
        var t: number | null;
        t = null;
        var firstObj: Primitive | null;
        firstObj = null;

        for (const obj of primitives) {
            var intersectTime = obj.rayIntersection(ray);
            // Set t to the first intersection in time
            if (!t || (intersectTime
                       && intersectTime < t)) { 
                t = intersectTime;
                firstObj = obj;
            }
        }
        // Return color of first intersection
        if (t && firstObj) {
            var intersectPoint = Vector.plus(ray.start, Vector.times(t, ray.dir));
            return {xPoint: intersectPoint, xObj: firstObj};
        }
        // If no objects intersected, return background color
        return null;
    }

    private reflectionRay(ray: Ray, depth: number, intersectPoint: Vector, intersectObject: Primitive): Color {
        var surfaceNorm = Vector.norm(intersectObject.getSurfaceNormal(intersectPoint));
        // Get the reflected vector r of vector d from surface normal n by r = d - 2(d * n)n
        var reflectVector = Vector.minus(Vector.times(2 * Vector.dot(ray.dir, surfaceNorm), surfaceNorm), ray.dir);
        // Get the reflection color value for + 1 depth
        depth++;
        if (depth >= this.maxDepth) {

        }
        var reflectColor = this.illumination(intersectPoint, intersectObject, depth);
        var visibleRay = Vector.norm(Vector.minus(eye.pos, intersectPoint));
        var scaledColor = Color.scale(intersectObject.specularMod, reflectColor);
        if (depth >= this.maxDepth) {
            // Return the reflected color scaled by the specular component
            return reflectColor;
        }
        var reflectRay = new Ray(intersectPoint, reflectVector);
        
        // Information of reflection at one more depth
        var reflectInfo = this.traceRay(reflectRay);
        if (reflectInfo != null) {
            reflectColor = Color.plus(reflectColor, this.reflectionRay(reflectRay, depth, reflectInfo?.xPoint, reflectInfo?.xObj));
            return reflectColor;
        }
        // If no objects intersected, return background color
        return background;
    }

    private reflectRay(ray: Ray, depth: number, intersectPoint: Vector, intersectObject: Primitive): Color {
        var surfaceNorm = intersectObject.getSurfaceNormal(intersectPoint);
        var reflectVector = Vector.norm(Vector.minus(ray.dir, Vector.times(2 * Vector.dot(ray.dir, surfaceNorm), surfaceNorm)));
        var reflectedRay = new Ray(intersectPoint, reflectVector);
        var refInfo = this.traceRay(reflectedRay);
        if (refInfo != null) {
            if (depth < this.maxDepth) {
                depth++;
                var reflectedColor = this.illumination(refInfo?.xPoint, refInfo?.xObj, depth);
                return reflectedColor;
            } else {
                return Color.black;
            }
        }
        return Color.black;
    }

    // Calculate shading of a point on the primitive
    illumination(point: Vector, obj: Primitive, depth: number = 0): Color {
        var ambient = Color.times(Color.scale(obj.ambientMod, ambientLight), obj.diffuseColor);
        var shadedColor = ambient;
        var diffuse = Color.black;
        for (const light of lights) {
            var surfaceNormal = obj.getSurfaceNormal(point);
            var vecs = this.createDistribution();

            // initialize diffuse and specular components as no contribution
            diffuse = Color.black;
            var specular = Color.black;

            var lightPoint = light.pos;
            var samplesCalculated = 0;

            sampleLoop:
                for (let s = 0; s < this.samples; s++) {
                    for (let t = 0; t < this.samples; t++) {
                        if (light instanceof AreaLight) {
                            // scale s and t to the center point of every grid on a grid based of the sample size
                            var su = (s / this.samples) + (1 / (this.samples * 2));
                            var tv = (t / this.samples) + (1 / (this.samples * 2));
                            // scale by random factor in [0, 2] as original point is at center (0.5, 0.5) of light grid cell
                            if (this.jitter) {
                                su += (1 / (this.samples * 2));
                                su *= vecs[s * t + s + t].s;
                                tv += (1 / (this.samples * 2));
                                tv *= vecs[s * t + s + t].t;
                            }
                            // scale su and tv to [-1, 1]
                            var uOffset = Vector.times(2 * su - 1, light.u);
                            var vOffset = Vector.times(2 * tv - 1, light.v);
                            lightPoint = Vector.plus(uOffset, vOffset);
                            // p = c + su + v
                            lightPoint = Vector.plus(lightPoint, light.pos);
                        }

                        var lightRay = Vector.norm(Vector.minus(lightPoint, point));
                        var reflectionRay = Vector.norm(Vector.minus(Vector.times(2 * Vector.dot(lightRay, surfaceNormal), 
                                                                                    surfaceNormal), lightRay));
                        var visibleRay = Vector.norm(Vector.minus(eye.pos, point));
                        
                        // don't contribute any color if ray is shadowed
                        var shadowed = this.isShadowRay(new Ray(point, lightRay), light);

                        diffuse = shadowed ? 
                            Color.plus(diffuse, Color.black) : 
                            Color.plus(diffuse, Color.times(Color.scale(Vector.dot(surfaceNormal, lightRay), obj.diffuseColor), light.color));

                        // compute full specular if any single sample ray is unshadowed
                        var newSpec = Color.scale(obj.specularMod * Math.pow(Math.max(Vector.dot(reflectionRay, visibleRay), 0), obj.specularPower), light.color);
                        specular = (shadowed || Color.lightness(specular) >= Color.lightness(newSpec)) ? specular : newSpec;

                        samplesCalculated++;
                        // stop after first sample if not an area light
                        if (!(light instanceof AreaLight)) {
                            break sampleLoop;
                        }
                    }
                }
            // average samples to get diffuse
            diffuse = Color.scale(1 / samplesCalculated, diffuse);

            // Add the light's contribution to the shaded color
            var lightContribution = Color.plus(diffuse, specular);
            shadedColor = Color.plus(shadedColor, lightContribution);
        }
        // if (this.enableReflections && depth < this.maxDepth) {
        //     // Eye vector in direction of point
        //     var visVec = Vector.norm(Vector.minus(point, eye.pos));
        //     var surfNorm = obj.getSurfaceNormal(point);
        //     var refVec = Vector.norm(Vector.minus(Vector.times(2 * Vector.dot(visVec, surfNorm), surfNorm), visVec));
            
        //     var refRay = new Ray(point, refVec);
        //     var xInfo = this.traceRay(refRay);
        //     if (xInfo != null) {
        //         // var refColor = this.illumination(xInfo?.xPoint, xInfo?.xObj, ++depth);
        //         var refColor = this.traceRayColor(refRay, ++depth);
        //         var refSpec = Color.scale(obj.specularMod, refColor);
        //         shadedColor = refColor;
        //     }
        // }
        return shadedColor;
    }

    // draw_scene is provided to create the image from the ray traced colors. 
    // 1. it renders 1 line at a time, and uses requestAnimationFrame(render) to schedule 
    //    the next line.  This causes the lines to be displayed as they are rendered.
    // 2. it uses the additional constructor parameters to allow it to render a  
    //    smaller # of pixels than the size of the canvas
    //
    // YOU WILL NEED TO MODIFY draw_scene TO IMPLEMENT DISTRIBUTION RAY TRACING!
    //
    // NOTE: this method now has three optional parameters that are used for the depth of
    // field extra credit part. You will use these to modify this routine to adjust the
    // eyeRays to create the depth of field effect.
    draw_scene(lensSize?: number, depth1?: number, depth2?: number) {

        // rather than doing a for loop for y, we're going to draw each line in
        // an animationRequestFrame callback, so we see them update 1 by 1
        var pixelWidth = this.width / this.screenWidth;
        var pixelHeight = this.height / this.screenHeight;
        var y = 0;
        
        this.clear_screen();

        var renderRow = () => {
            for (var x = 0; x < this.screenWidth; x++) {
                // HINT: if you implemented "createDistribution()" above, you can use it here
                let vecs = this.createDistribution();

                // HINT: you will need to loop through all the rays, if distribution is turned
                // on, and compute an average color for each pixel.
                var averageColor: Color | null;
                averageColor = null;

                for (let i = 0; i < this.samples; i++) {
                    for (let j = 0; j < this.samples; j++) {
                        var subpixelX = i / this.samples;
                        var subpixelY = j / this.samples;

                        // jitter randomizes subpixel ray location
                        if (this.jitter) {
                            subpixelX *= vecs[i * j + i + j].s;
                            subpixelY *= vecs[i * j + i + j].t;
                        }

                        // Shoot ray through center of pixel
                        var ray = this.eyeRay(x + subpixelX + (1 / (this.samples * 2)), y + subpixelY + (1 / (this.samples * 2)));
                        var c = this.traceRayColor(ray);

                        if (!averageColor) {
                            averageColor = c;
                        } else {
                            averageColor = Color.plus(averageColor, c);
                        }
                    }
                }
                if (averageColor) {
                    averageColor = Color.scale(1 / Math.pow(this.samples, 2), averageColor);
                    var color = Color.toDrawingColor(averageColor);
                    this.ctx.fillStyle = "rgb(" + String(color.r) + ", " + String(color.g) + ", " + String(color.b) + ")";
                    this.ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth+1, pixelHeight+1);
                }
            }
            
            // finished the row, so increment row # and see if we are done
            y++;
            if (y < this.screenHeight) {
                // finished a line, do another
                requestAnimationFrame(renderRow);            
            } else {
                console.log("Finished rendering scene")
            }
        }

        renderRow();
    }

    clear_screen() {
        this.ctx.fillStyle = this.canvasColor;
        this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);
    }
}

export {RayTracer}