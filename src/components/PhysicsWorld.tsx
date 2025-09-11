import React, {
    createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback
} from "react";
import Matter, { Bodies, Body, Composite, Engine, Events, Runner } from "matter-js";

type Ctx = {
    engine: Engine;
    containerEl: HTMLDivElement;
    getLocalPoint: (pageX: number, pageY: number) => { x: number; y: number };
};

const PhysicsCtx = createContext<Ctx | null>(null);
export function usePhysics() {
    const ctx = useContext(PhysicsCtx);
    if (!ctx) throw new Error("usePhysics must be used inside <PhysicsWorld>");
    return ctx;
}

type PhysicsWorldProps = {
    children: React.ReactNode;
    gravity?: number;
    damping?: number;
    restitution?: number;
    className?: string;
    debugCanvas?: boolean;
};

export function PhysicsWorld({
    children,
    gravity = 1.2,
    damping = 0.02,
    restitution = 0.2,
    className,
    debugCanvas = false,
}: PhysicsWorldProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Engine>();
    const runnerRef = useRef<Runner>();
    const wallsRef = useRef<Body[]>([]);
    const [ctx, setCtx] = useState<Ctx | null>(null); // ← gate children on this

    const getLocalPoint = useCallback((pageX: number, pageY: number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return { x: pageX, y: pageY };
        return { x: pageX - rect.left, y: pageY - rect.top };
    }, []);

    // 1) Init engine once (StrictMode-safe)
    useEffect(() => {
        if (engineRef.current) return; // guard duplicate init
        const engine = Engine.create();
        engine.gravity.y = gravity;
        // keep gravity consistent across frame rates
        engine.world.gravity.scale = 0.001;

        const runner = Runner.create();
        Runner.run(runner, engine);

        engineRef.current = engine;
        runnerRef.current = runner;

        // If the container is already mounted, we can publish ctx now.
        if (containerRef.current) {
            setCtx({ engine, containerEl: containerRef.current, getLocalPoint });
        }

        return () => {
            if (runnerRef.current) Runner.stop(runnerRef.current);
            runnerRef.current = undefined;
            engineRef.current = undefined;
        };
    }, [getLocalPoint, gravity]);

    // 2) Ensure ctx gets set once the container ref exists (first layout)
    useLayoutEffect(() => {
        if (engineRef.current && containerRef.current) {
            setCtx({ engine: engineRef.current, containerEl: containerRef.current, getLocalPoint });
        }
    }, [getLocalPoint]);

    // 3) Live-update gravity
    useEffect(() => {
        if (engineRef.current) engineRef.current.gravity.y = gravity;
    }, [gravity]);

    // 4) Global damping (add/remove with correct handler ref)
    useEffect(() => {
        const engine = engineRef.current;
        if (!engine) return;
        const onBefore = () => {
            engine.world.bodies.forEach((b) => {
                if (!b.isStatic) {
                    b.velocity.x *= (1 - damping);
                    b.velocity.y *= (1 - damping);
                }
            });
        };
        Events.on(engine, "beforeUpdate", onBefore);
        return () => { Events.off(engine, "beforeUpdate", onBefore); };
    }, [damping]);

    // 5) Static walls that resize with the container
    useLayoutEffect(() => {
        if (!ctx) return; // wait until we have engine + container
        const { engine, containerEl } = ctx;

        const rebuildWalls = () => {
            wallsRef.current.forEach((w) => Composite.remove(engine.world, w));
            wallsRef.current = [];

            const rect = containerEl.getBoundingClientRect();
            const W = rect.width, H = rect.height;
            const thick = 200;

            const floor = Bodies.rectangle(W / 2, H + thick / 2, W, thick, { isStatic: true });
            const ceiling = Bodies.rectangle(W / 2, -thick / 2, W, thick, { isStatic: true });
            const left = Bodies.rectangle(-thick / 2, H / 2, thick, H, { isStatic: true });
            const right = Bodies.rectangle(W + thick / 2, H / 2, thick, H, { isStatic: true });

            wallsRef.current = [floor, ceiling, left, right];
            Composite.add(engine.world, wallsRef.current);
        };

        const ro = new ResizeObserver(rebuildWalls);
        ro.observe(containerEl);
        rebuildWalls(); // also build immediately

        return () => {
            ro.disconnect();
            wallsRef.current.forEach((w) => Composite.remove(engine.world, w));
            wallsRef.current = [];
        };
    }, [ctx]);

    const providerValue = useMemo(() => ctx, [ctx]);

    return (
        <div ref={containerRef} className={className} style={{ position: "relative", overflow: "hidden" }}>
            {/* Only render consumers when context is ready */}
            {providerValue && (
                <PhysicsCtx.Provider value={providerValue}>
                    {debugCanvas && <DebugCanvas />}
                    {children}
                </PhysicsCtx.Provider>
            )}
        </div>
    );
}

function DebugCanvas() {
    const { engine, containerEl } = usePhysics();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!containerEl || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d")!;
        let raf = 0;

        const draw = () => {
            const rect = containerEl.getBoundingClientRect();
            canvasRef.current!.width = rect.width;
            canvasRef.current!.height = rect.height;
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.globalAlpha = 0.15;
            ctx.lineWidth = 1;

            engine.world.bodies.forEach((b) => {
                if ((b as any).isDebugHidden) return;
                ctx.save();
                ctx.translate(b.position.x, b.position.y);
                ctx.rotate(b.angle);
                ctx.beginPath();
                const verts = b.vertices;
                ctx.moveTo(verts[0].x - b.position.x, verts[0].y - b.position.y);
                for (let i = 1; i < verts.length; i++) {
                    ctx.lineTo(verts[i].x - b.position.x, verts[i].y - b.position.y);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            });

            raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [engine, containerEl]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />
    );
}

export function usePhysics() {
    const ctx = useContext(PhysicsCtx);
    if (!ctx) throw new Error("usePhysics must be used inside <PhysicsWorld>");
    return ctx;
}

type PhysicsItemProps = {
    children: React.ReactNode;
    /** starting x/y inside the container (px). If omitted, it spawns near the top at a random x */
    initial?: { x?: number; y?: number; angle?: number };
    /** override defaults per item */
    options?: Partial<Pick<Matter.IBodyDefinition,
        "restitution" | "friction" | "frictionStatic" | "frictionAir" | "density">>;
    /** make it draggable */
    draggable?: boolean;
    className?: string;
};

export function PhysicsItem({
    children,
    initial,
    options,
    draggable = true,
    className,
}: PhysicsItemProps) {
    const { engine, containerEl, getLocalPoint } = usePhysics();
    const hostRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<Body | null>(null);

    // measure size once mounted
    useLayoutEffect(() => {
        const host = hostRef.current;
        if (!host || !containerEl) return;

        const rectC = containerEl.getBoundingClientRect();
        const rect = host.getBoundingClientRect();
        const w = Math.max(1, rect.width);
        const h = Math.max(1, rect.height);

        const startX = initial?.x ?? Math.random() * rectC.width;
        const startY = initial?.y ?? -20; // slightly above top
        const startAngle = initial?.angle ?? 0;

        const body = Bodies.rectangle(startX + w / 2, startY + h / 2, w, h, {
            restitution: options?.restitution ?? 0.2,
            friction: options?.friction ?? 0.1,
            frictionStatic: options?.frictionStatic ?? 0.5,
            frictionAir: options?.frictionAir ?? 0.01,
            density: options?.density ?? 0.001,
        });
        Body.setAngle(body, startAngle);
        bodyRef.current = body;
        Composite.add(engine.world, body as any);

        // sync DOM -> physics position each tick
        let unsub = () => { };
        const onAfterUpdate = () => {
            if (!hostRef.current || !bodyRef.current) return;
            const b = bodyRef.current;
            // map body center to top-left DOM
            const x = b.position.x - w / 2;
            const y = b.position.y - h / 2;
            hostRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${b.angle}rad)`;
        };
        Events.on(engine, "afterUpdate", onAfterUpdate);
        unsub = () => Events.off(engine, "afterUpdate", onAfterUpdate);

        return () => {
            unsub();
            if (bodyRef.current) {
                Composite.remove(engine.world, bodyRef.current);
                bodyRef.current = null;
            }
        };
    }, [engine, containerEl]);

    // basic drag
    useEffect(() => {
        if (!draggable || !hostRef.current || !containerEl) return;
        const host = hostRef.current;

        let dragging = false;
        let offset = { x: 0, y: 0 };

        const onPointerDown = (e: PointerEvent) => {
            if (!bodyRef.current) return;
            dragging = true;
            host.setPointerCapture(e.pointerId);
            const local = getLocalPoint(e.pageX, e.pageY);
            offset.x = local.x - bodyRef.current.position.x;
            offset.y = local.y - bodyRef.current.position.y;
            Body.setAngularVelocity(bodyRef.current, 0);
            Body.setVelocity(bodyRef.current, { x: 0, y: 0 });
        };
        const onPointerMove = (e: PointerEvent) => {
            if (!dragging || !bodyRef.current) return;
            const local = getLocalPoint(e.pageX, e.pageY);
            Body.setPosition(bodyRef.current, { x: local.x - offset.x, y: local.y - offset.y });
        };
        const onPointerUp = (e: PointerEvent) => {
            dragging = false;
            try { host.releasePointerCapture(e.pointerId); } catch { }
        };

        host.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        return () => {
            host.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [draggable, containerEl, getLocalPoint]);

    return (
        <div
            ref={hostRef}
            className={className}
            style={{
                position: "absolute",
                willChange: "transform",
                touchAction: "none",
            }}
        >
            {children}
        </div>
    );
}
