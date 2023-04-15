import { useEffect } from "react";
import { RayTracer } from "../scripts/rayTracer.ts";

const RayTracing = () => {
    useEffect(() => {
        var scaleDim = document.documentElement.clientWidth / 5;
        var div = document.getElementById("rayTracingCanvas");
        if (div != null) {
            var rt = new RayTracer(div, scaleDim, scaleDim, scaleDim, scaleDim)
            rt.reflection_on();
            rt.jitter_on();
            rt.set_sample_level(4);
            
            rt.reset_scene();

            rt.set_background (0.05, 0.05, 0.05);
            
            rt.set_fov(60.0);
            rt.set_eye(-.5,1,4, 0,0.7,0, 0,1,0);
            
            rt.area_light(1.2, .3, .6,   -3, 4, 3, 0.5, 0, 1, 0, 1, -0.75);

            rt.area_light(0.4, 0.7, 1,   3, 5, 1,   1, 0, -0.5,   0, 2, -0.25);
            rt.ambient_light (0.2, 0.2, 0.2);
            // Big blue sphere
            rt.new_sphere ( 0.4,   2, -2,      2,    0.53, 0.81, 0.80,  0.4, 0.3, 20);
            // green sphere
            // rt.new_sphere ( -0.6, -0.3, 1.3,   .3,  0.20, 0.92, 0.32,  0.2, 0.7, 60, -0.5,0,0);
            // purple sphere
            rt.new_sphere (1, .2, 0.6,   0.6,  0.44, 0.22, 0.90,  0.2, 1,   250);
            // red
            rt.new_sphere (-1.2, .3, 0,   0.5,  0.82, 0.02, 0.24,  0.2, 0,   100);
            // yellow
            rt.new_sphere (0, 1.3, 0,   0.3,  0.92, 0.80, 0.20,  0.2, 0,   100);
            
            rt.new_disk(0, -1, 0, 70.0, 0, 1, 0,  0.8, 0.8, 0.8,  0.0, 0.1, 100);
            rt.draw_scene(0.3, 0.5, 3);   
        }
    });
    return (
        <div>
            <div id="rayTracingCanvas"></div>
        </div>
    )
}

export default RayTracing