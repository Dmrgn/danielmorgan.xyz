import { MoveRight as _A, Send as _B } from "lucide-react";
import { Input as _C } from "../ui/input";
import { AnimatePresence as _D, motion as _E } from "motion/react";
import { useEffect as _F, useState as _G } from "react";
import { Button as _H } from "../ui/button";

const De = (q: string) => { try { const a = globalThis["atob"](q), b: string[] = []; for (let i = 0; i < a.length; i++) { b.push('%' + ('00' + a.charCodeAt(i).toString(16)).slice(-2)) } return decodeURIComponent(b.join('')) } catch (_) { return (globalThis as any)["atob"](q) } };

export default function ᚠᚢᚦᚨᚱᚲ() {
    const [α, β] = _G<string>("");                // requestValue
    const [γ, δ] = _G<boolean>(false);            // wasPasswordCorrect
    const [ε, ζ] = _G<string>("");                // helpText
    const [η, θ] = _G<boolean>(true);             // isEasyOptionShown
    const [ι, κ] = _G<boolean>(false);            // isSecretShown

    _F(() => { (globalThis as any)["localStorage"]["setItem"](De("cGFzc3dvcmQ="), De("dGhpcyBpcyBhIHRlc3Q=")) }, []);

    const Ψ = () => {                               // testPassword
        const ρ = α["split"]("")["sort"]();
        const ω = α["split"]("");
        const μ = ρ["reduceRight"]((σ: any, x: any, i: number) => [...σ, x, ω[i]], [])["join"]("|")["split"]("a")["join"]("qua")["split"]("t")["join"]("tsts");
        if (μ === De("dHN0c3x0c3RzfHRzdHN8c3x0c3RzfGV8c3x0c3RzfHN8IHxzfHF1YXxpfCB8aXxzfGh8aXxlfCB8cXVhfHN8IHxpfCB8aHwgfHRzdHM=")) { δ(true); β("") }
    };

    const Ω = () => {                               // noPassword
        if (γ) { κ(true); return }
        θ(false);
        (globalThis as any)["setTimeout"](() => { ζ(De("SXQgd2FzIHdvcnRoIHRyeWluZywgYnV0IHRoYXQgd291bGQgYmUgdG9vIGVhc3kh")) }, 0xC8);
        (globalThis as any)["setTimeout"](() => { ζ("") }, 0x1388);
        (globalThis as any)["setTimeout"](() => { θ(true) }, 0x157C);
    };

    return (
        <>
            <p>{De("VGhpcyBmaWxlIGlzIHBhc3N3b3JkIHByb3RlY3RlZC4=")}</p>
            <div className="flex gap-2">
                <_C
                    onInput={(e: any) => { β(e["currentTarget"]["value"]) }}
                    placeholder={De("UGFzc3dvcmQuLi4=")}
                />
                {α["length"] > 3 && (
                    <_E.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <_H onClick={Ψ}><_B /></_H>
                    </_E.div>
                )}
            </div>

            {η && !ι && (
                <div className="flex items-center">
                    <p className="mr-2">{De("T3IgY2xpY2sgaGVyZSB0byBhY2Nlc3Mgd2l0aG91dCBhIHBhc3N3b3JkOg==")}</p>
                    <p className="cursor-pointer underline" onClick={Ω}>{De("VmlldyBDb250ZW50cw==")}</p>
                </div>
            )}

            <_D mode={De("d2FpdA==")}>
                <_E.span
                    key={ε}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <p>{ε}</p>
                </_E.span>
            </_D>

            {γ && !ι && (
                <>
                    <h2>{De("RmlsZSBDb250ZW50czo=")}</h2>
                    <p>{"This file is empty. \\u00AF\\_(\\u30C4)_/\\u00AF"}</p>
                    <p>{"No need to keep looking! Nothing to see here!"}</p>
                </>
            )}

            {ι && (
                <>
                    <h2>{De("RmlsZSBDb250ZW50czo=")}</h2>
                    <p className="break-words">
                        {"VGhhdCB3YXMgYSBsb3Qgb2Ygd29yayB0byBmaW5kIHRoaXMhIEhvcGVmdWxseSB5b3Ugd2VyZW4ndCBwcm9jcmFzdGluYXRpbmcgc29tZXRoaW5nIG1vcmUgaW1wb3J0YW50LiBJJ20gc2FkIHRvIHNheSBJJ3ZlIHdhc3RlZCB5b3VyIHRpbWUsIGFuZCBJIGRvbid0IGhhdmUgYW55IHNlY3JldHMgdG8gcHV0IGhlcmUhIElmIHlvdSBmb3VuZCB0aGlzLCBtZXNzYWdlIG1lIGFuZCB0ZWxsIG1lIGhvdyB5b3UgZGlkIGl0IC8gaG93IGxvbmcgaXQgdG9vayB5b3UhIA=="}
                    </p>
                </>
            )}
        </>
    );
}
