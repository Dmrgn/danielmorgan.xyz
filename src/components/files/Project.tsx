"use client"

import React from "react"
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

/**
 * Map normalized technology names to icon filenames inside /assets/logo
 * Add more mappings here as you add icons to assets/logo.
 */
const techIconMap: Record<string, string> = {
  c: "c.png",
  cpp: "cpp.png",
  css: "css.png",
  html: "html.png",
  java: "java.png",
  javascript: "js.png",
  js: "js.png",
  python: "python.png",
  pandas: "pandas.png",
  rn: "rn.png",
  tailwind: "tailwind.png",
  typescript: "ts.png",
  ts: "ts.png",
  vue: "vue.png",
  vscode: "vscode.png",
}

/** normalize a technology name to the key form we use in techIconMap */
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

      <div className="mt-4 prose dark:prose-invert">
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
                    <img src={`/assets/logo/${icon}`} alt={tech} className="w-5 h-5" />
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
