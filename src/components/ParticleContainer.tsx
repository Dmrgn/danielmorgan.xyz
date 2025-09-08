import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import cLogo from "../../assets/logo/c.png";
import cppLogo from "../../assets/logo/cpp.png";
import cssLogo from "../../assets/logo/css.png";
import htmlLogo from "../../assets/logo/html.png";
import javaLogo from "../../assets/logo/java.png";
import jsLogo from "../../assets/logo/js.png";
import tsLogo from "../../assets/logo/ts.png";
import pandasLogo from "../../assets/logo/pandas.png";
import pythonLogo from "../../assets/logo/python.png";
import rnLogo from "../../assets/logo/rn.png";
import tailwindLogo from "../../assets/logo/tailwind.png";
import vscodeLogo from "../../assets/logo/vscode.png";
import vueLogo from "../../assets/logo/vue.png";



import "../index.css";

export function ParticleContainer() {
    const [init, setInit] = useState(false);
    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container) => {
    };

    return init && <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        className="absolute -z-10"
        options={{
            background: { color: { value: "#0d47a1" } },
            detectRetina: true,
            fpsLimit: 120,

            particles: {
                number: { value: 200 },
                color: { value: "#ffffff" },
                shape: {
                    type: ["square", "circle", "star"],
                },

                rotate: {
                    value: { min: 0, max: 360 },
                    direction: "random",
                    animation: { enable: true, speed: 20, sync: false },
                },

                // fly to the right
                move: {
                    enable: true,
                    direction: "right",
                    speed: { min: 0.5, max: 1.5 },
                    straight: true,
                    random: false,
                    outModes: { default: "out", right: "destroy" },
                },

                size: {
                    value: { min: 0, max: 10 },
                    animation: {
                        enable: true,
                        startValue: "random",
                        speed: 5,
                        destroy: "min",
                    },
                },

                opacity: { value: { min: 0.6, max: 1 } },
                life: { count: 0 },
            },

            emitters: [
                {
                    direction: "right",
                    rate: { delay: 0.8, quantity: 4 },
                    size: { width: 0, height: 100, mode: "percent" },
                    position: { x: 0, y: 50 },
                },

                {
                    direction: "right",
                    rate: { delay: 2.8, quantity: 1 }, // occasional
                    size: { width: 0, height: 100, mode: "percent" },
                    position: { x: 0, y: 50 },
                    
                    particles: {
                        // make this emitter spawn images only
                        shape: {
                            type: "image",
                            options: {
                                image: [cLogo, cppLogo, cssLogo, htmlLogo, javaLogo, jsLogo, tsLogo, pandasLogo, pythonLogo, rnLogo, tailwindLogo, vscodeLogo, vueLogo].map((src) => ({
                                    src,
                                    width: 64,
                                    height: 64,
                                    replaceColor: false,
                                })),
                            },
                        },

                        rotate: {
                            value: { min: 0, max: 360 },
                            direction: "random",
                            animation: { enable: true, speed: 20, sync: false },
                        },
                        move: {
                            enable: true,
                            direction: "right",
                            speed: { min: 0.8, max: 1.8 },
                            straight: true,
                            random: false,
                            outModes: { default: "out", right: "destroy" },
                        },
                        size: {
                            // start modestly large so the shrink is visible
                            value: { min: 12, max: 28 },
                            animation: {
                                enable: true,
                                startValue: "random",
                                speed: 6,
                                destroy: "none",
                            },
                        },
                        opacity: { value: { min: 0.8, max: 1 } },
                        life: { count: 1 },
                    },
                },
            ],
        }}
    />
}

export default ParticleContainer;
