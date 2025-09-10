"use client"

import { Button } from "@/components/ui/button"

export interface ProjectType {
    name: string
    description: string
    technologies: string[]
    repo_link: string | null
    project_link: string | null
    year_created: number
}

interface Props {
    project: ProjectType
}

import cLogo from "../../../assets/logo/c.png";
import cppLogo from "../../../assets/logo/cpp.png";
import cssLogo from "../../../assets/logo/css.png";
import htmlLogo from "../../../assets/logo/html.png";
import javaLogo from "../../../assets/logo/java.png";
import jsLogo from "../../../assets/logo/js.png";
import tsLogo from "../../../assets/logo/ts.png";
import pandasLogo from "../../../assets/logo/pandas.png";
import pythonLogo from "../../../assets/logo/python.png";
import rnLogo from "../../../assets/logo/rn.png";
import tailwindLogo from "../../../assets/logo/tailwind.png";
import vscodeLogo from "../../../assets/logo/vscode.png";
import vueLogo from "../../../assets/logo/vue.png";


// map normalized technology names to icon filenames inside /assets/logo
const techIconMap: Record<string, string> = {
    c: cLogo,
    cpp: cppLogo,
    css: cssLogo,
    html: htmlLogo,
    java: javaLogo,
    javascript: jsLogo,
    js: jsLogo,
    python: pythonLogo,
    pandas: pandasLogo,
    rn: rnLogo,
    "react native": rnLogo,
    tailwind: tailwindLogo,
    typescript: tsLogo,
    ts: tsLogo,
    vue: vueLogo,
    vscode: vscodeLogo,
}

// normalize a technology name to the key form we use in techIconMap
function normalizeTech(t: string) {
    return t.replace(/[^a-z0-9]/gi, "").toLowerCase()
}

export default function Project({ project }: Props) {
    return (
        <div className="p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold">{project.name}</h2>
                    <div className="text-sm text-muted-foreground mt-1">Year: {project.year_created}</div>
                </div>
                <div className="flex items-center gap-2">
                    {project.repo_link && (
                        <a href={project.repo_link} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm">Repository</Button>
                        </a>
                    )}
                    {project.project_link && (
                        <a href={project.project_link} target="_blank" rel="noreferrer">
                            <Button variant="default" size="sm">Live</Button>
                        </a>
                    )}
                </div>
            </div>

            <div className="mt-4 prose prose-invert">
                <p>{project.description || "No description provided"}</p>
            </div>

            <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                    {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.map((tech) => {
                            const key = normalizeTech(tech)
                            const icon = techIconMap[key]
                            return (
                                <div key={tech} className="flex items-center gap-2 bg-card/60 px-2 py-1 rounded-md text-sm">
                                    {icon ? (
                                        // use absolute path to assets folder so runtime can serve file
                                        // example: /assets/logo/js.png
                                        <img src={icon} alt={tech} className="w-5 h-5" />
                                    ) : (
                                        <div className="w-5 h-5 flex items-center justify-center rounded-sm bg-muted text-xs">
                                            {tech[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    <span>{tech}</span>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-sm text-muted-foreground">No technologies listed</div>
                    )}
                </div>
            </div>
        </div>
    )
}
