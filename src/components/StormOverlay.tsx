


import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * StormOverlay – full-screen TRANSLUCENT storm effect using Framer Motion + SVG
 *
 * Fixes vs v1
 * - Translucent overlay: page stays visible beneath (uses alpha + blend modes)
 * - Clouds now visible (blurred ellipses), multiple parallax layers
 * - Waves: centered, responsive, tall enough, parallax, fill bottom viewport
 * - Pointer events pass through by default (overlay decoration)
 * - 30s default timeline, fires onFinished + window CustomEvent("storm:finished")
 */

export type StormOverlayProps = {
    isOpen?: boolean;
    durationMs?: number; // default 30_000
    fadeOutAtEnd?: boolean; // default true
    overlayOpacity?: number; // 0..1 controls overall translucency (default 0.55)
    zIndexClass?: string; // default z-[9999]
    intensity?: number; // 0.5..3: lightning spawn multiplier (default 1)
    onFinished?: () => void;
    className?: string;
};

// ---------------- utils ----------------
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function createBoltPath(width: number, height: number) {
    const startX = rand(width * 0.2, width * 0.8);
    const startY = rand(height * 0.02, height * 0.18);
    const segments = Math.floor(rand(6, 10));
    const pts: Array<[number, number]> = [[startX, startY]];
    let x = startX;
    let y = startY;
    for (let i = 0; i < segments; i++) {
        x += rand(-width * 0.12, width * 0.12);
        y += rand(height * 0.08, height * 0.17);
        x = clamp(x, 0, width);
        y = clamp(y, 0, height * 0.96);
        pts.push([x, y]);
    }
    return pts.map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`)).join(" ");
}

// ---------------- lightning ----------------

type Bolt = { id: number; d: string };

function useLightning(durationMs: number, intensity: number) {
    const [bolts, setBolts] = useState<Bolt[]>([]);
    const idRef = useRef(0);
    const stopRef = useRef(false);

    useEffect(() => {
        stopRef.current = false;
        const endAt = performance.now() + durationMs;

        const loop = () => {
            if (stopRef.current) return;
            const now = performance.now();
            if (now >= endAt) return;

            const baseMin = 280 / intensity;
            const baseMax = 1600 / intensity;
            const nextIn = rand(baseMin, baseMax);
            const t = window.setTimeout(() => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                const forks = Math.floor(rand(1, 3.9));
                setBolts((prev) => [
                    ...prev,
                    ...new Array(forks).fill(0).map(() => ({ id: idRef.current++, d: createBoltPath(w, h) })),
                ]);
                loop();
            }, nextIn);
            return () => window.clearTimeout(t);
        };

        const cleanup = loop();
        return () => {
            stopRef.current = true;
            cleanup && cleanup();
        };
    }, [durationMs, intensity]);

    const removeBolt = (id: number) => setBolts((prev) => prev.filter((b) => b.id !== id));
    return { bolts, removeBolt };
}

// ---------------- cloud layers ----------------

function Clouds({ speed = 60, y = 0, scale = 1, opacity = 0.8 }: { speed?: number; y?: number; scale?: number; opacity?: number }) {
    /**
     * Large blurred ellipses to ensure clouds are visible on all screens.
     * The SVG is 220vw wide and horizontally centered; we animate it left for a looping drift.
     */
    return (
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ opacity }} aria-hidden>
            <motion.svg
                width="220vw"
                height="40vh"
                viewBox="0 0 2200 400"
                preserveAspectRatio="none"
                className="block absolute left-1/2 -translate-x-1/2"
                initial={{ x: 0 }}
                animate={{ x: [0, -1100, 0] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                style={{ y, scale }}
            >
                <defs>
                    <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0b1020" />
                        <stop offset="100%" stopColor="#1f2937" />
                    </linearGradient>
                    <filter id="cBlur" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="28" />
                    </filter>
                </defs>
                <g filter="url(#cBlur)" fill="url(#cGrad)">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <ellipse key={i} cx={100 + i * 160} cy={200 + (i % 2 === 0 ? -30 : 20)} rx={180} ry={90} />
                    ))}
                    {/* duplicate row for seamless loop */}
                    <g transform="translate(2200,0)">
                        {Array.from({ length: 14 }).map((_, i) => (
                            <ellipse key={i} cx={100 + i * 160} cy={200 + (i % 2 === 0 ? -30 : 20)} rx={180} ry={90} />
                        ))}
                    </g>
                </g>
            </motion.svg>
        </div>
    );
}

// ---------------- waves ----------------

function Waves({ heightVh = 10, speed = 30, opacity = 0.9 }: { heightVh?: number; speed?: number; opacity?: number }) {
    /**
     * Centered, responsive wave band that fills the bottom of the viewport.
     */
    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none" style={{ width: "240vw", height: `${heightVh}vh`, opacity }} aria-hidden>
            <motion.svg
                viewBox="0 0 2400 600"
                preserveAspectRatio="none"
                className="w-full h-full"
                initial={{ x: 0 }}
                animate={{ x: [0, -1200, 0] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            >
                <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(124,58,237,0.25)" />
                        <stop offset="100%" stopColor="rgba(2,6,23,0.6)" />
                    </linearGradient>
                    <filter id="waveSoft" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" />
                    </filter>
                </defs>

                {/* base ocean fill */}
                <rect x="0" y="0" width="2400" height="600" fill="url(#waveFill)" />

                {/* animated strokes for wave crests */}
                {[
                    { y: 420, amp: 35, thick: 5, dur: speed * 1.0 },
                    { y: 360, amp: 28, thick: 4, dur: speed * 0.9 },
                    { y: 300, amp: 22, thick: 3, dur: speed * 0.8 },
                    { y: 250, amp: 18, thick: 2.5, dur: speed * 0.75 },
                ].map((cfg, i) => (
                    <motion.path
                        key={i}
                        d={buildWavePath(0, cfg.y, 2400, 8, cfg.amp)}
                        fill="none"
                        stroke="rgba(199,210,254,0.6)"
                        strokeWidth={cfg.thick}
                        filter="url(#waveSoft)"
                        initial={{ x: 0 }}
                        animate={{ x: [-100, 0] }}
                        transition={{ duration: cfg.dur, repeat: Infinity, ease: "linear" }}
                        style={{ mixBlendMode: "screen" as any }}
                    />
                ))}
            </motion.svg>
        </div>
    );
}

function buildWavePath(x0: number, y: number, width: number, cycles: number, amp: number) {
    const seg = width / cycles;
    let d = `M ${x0},${y}`;
    for (let i = 0; i < cycles; i++) {
        const x1 = x0 + i * seg + seg * 0.25;
        const x2 = x0 + i * seg + seg * 0.75;
        const x3 = x0 + (i + 1) * seg;
        d += ` C ${x1},${y - amp} ${x2},${y + amp} ${x3},${y}`;
    }
    return d;
}

// ---------------- lightning SVG ----------------

function Lightning({ bolt, onDone }: { bolt: Bolt; onDone: (id: number) => void }) {
    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
            <defs>
                <filter id={`glow-${bolt.id}`} x="-60%" y="-60%" width="220%" height="220%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#a78bfa" floodOpacity="0.95" />
                    <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor="#7c3aed" floodOpacity="0.7" />
                </filter>
            </defs>
            <motion.path
                d={bolt.d}
                stroke="#d6bcfa"
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                filter={`url(#glow-${bolt.id})`}
                style={{ mixBlendMode: "screen" as any }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                transition={{ times: [0, 0.18, 1], duration: 0.22 }}
                onAnimationComplete={() => onDone(bolt.id)}
            />
        </svg>
    );
}

// ---------------- main ----------------

export default function StormOverlay({
    isOpen = true,
    durationMs = 30_000,
    fadeOutAtEnd = true,
    overlayOpacity = 0.55,
    zIndexClass = "z-[9999]",
    intensity = 1,
    onFinished,
    className = "",
}: StormOverlayProps) {
    const [active, setActive] = useState(isOpen);
    const [done, setDone] = useState(false);
    const { bolts, removeBolt } = useLightning(durationMs, intensity);
    const timerRef = useRef<number | null>(null);

    useEffect(() => setActive(isOpen), [isOpen]);

    useEffect(() => {
        if (!active) return;
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setDone(true);
            try { window.dispatchEvent(new CustomEvent("storm:finished")); } catch { }
            onFinished?.();
        }, durationMs);
        return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
    }, [active, durationMs, onFinished]);

    useEffect(() => {
        if (done && fadeOutAtEnd) {
            const t = window.setTimeout(() => setActive(false), 900);
            return () => window.clearTimeout(t);
        }
    }, [done, fadeOutAtEnd]);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    className={`fixed inset-0 ${zIndexClass} ${className} pointer-events-none`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: overlayOpacity }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    aria-hidden
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.65) 40%, rgba(2,6,23,0.5) 100%)",
                        }}
                    />

                    {/* soft vignette to make clouds pop, still translucent */}
                    <div
                        className="absolute inset-0 mix-blend-multiply"
                        style={{
                            background:
                                "radial-gradient(1200px 480px at 50% -80px, rgba(124,58,237,0.18), rgba(2,6,23,0) 60%)",
                        }}
                    />

                    {/* rain streaks with low alpha */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            opacity: 0.9,
                            maskImage:
                                "repeating-linear-gradient(115deg, rgba(0,0,0,0.55) 0 2px, rgba(0,0,0,0.15) 2px 3px, transparent 3px 6px)",
                            WebkitMaskImage:
                                "repeating-linear-gradient(115deg, rgba(0,0,0,0.55) 0 2px, rgba(0,0,0,0.15) 2px 3px, transparent 3px 6px)",
                            background:
                                "linear-gradient(180deg, rgba(167,139,250,0.12) 0%, rgba(255,255,255,0) 70%)",
                        }}
                        initial={{ backgroundPosition: "0px 0px" }}
                        animate={{ backgroundPosition: ["0px 0px", "400px 0px"] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* clouds (visible and layered) */}
                    <Clouds speed={70} y={10} scale={1.15} opacity={1} />
                    <Clouds speed={55} y={30} scale={1.0} opacity={1} />
                    <Clouds speed={42} y={60} scale={0.95} opacity={1} />

                    {/* lightning */}
                    {bolts.map((b) => (
                        <Lightning key={b.id} bolt={b} onDone={removeBolt} />
                    ))}

                    {/* waves (large, centered, parallax) */}
                    <Waves heightVh={25} speed={36} opacity={0.9} />

                    {/* subtle ambient flash to sell lightning; translucent */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ mixBlendMode: "screen" as any, background: "radial-gradient(900px 340px at 50% 12%, rgba(196,181,253,0.12), transparent 70%)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.08, 0] }}
                        transition={{ repeat: Infinity, duration: 2.4, repeatType: "reverse", ease: "easeIn" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
