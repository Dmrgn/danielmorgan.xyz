import { MoonStar, Star } from "lucide-react";

export default function ReadMe() {
    return <>
        <h1>Portfolio Plan</h1>
        <h3>Skills to Highlight:</h3>
        <ul>
            <li className="list-none flex relative">
                <Star className="text-yellow-300 absolute -left-6 w-4" />
                <span>
                    Professional experience with <strong>React, Next, React Native, Django, Vue, Nuxt</strong>, and just about every other leading web framework.
                </span>
            </li>   
            <li className="list-none flex relative">
                <Star className="text-yellow-300 absolute -left-6 w-4" />
                <span>
                    <strong>Full-stack development</strong> with <strong>payment integrations (Stripe), authentication, emailing, DNS & proxies, S3 storage, websockets, large language models</strong> and <strong>web scraping</strong>.
                </span>
            </li>
            <li className="list-none flex relative">
                <Star className="text-yellow-300 absolute -left-6 w-4" />
                <span>
                    Extensive <strong>machine learning</strong> experience deploying real-world models with <strong>Tensorflow, Pytorch, Keras</strong>.
                </span>
            </li>
            <li className="list-none flex relative">
                <Star className="text-yellow-300 absolute -left-6 w-4" />
                <span>
                    Strong foundational understanding of <strong>data analysis</strong> and <strong>statistics</strong>.
                </span>
            </li>
            <li className="list-none flex relative">
                <Star className="text-yellow-300 absolute -left-6 w-4" />
                <span>
                    Low-level experience with <strong>C, C++ and Zig</strong> for <strong>systems programming & game development</strong>.
                </span>
            </li>
        </ul>
        <h3 className="pt-8">Experience to Highlight:</h3>
        <ul>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Founder of thundr.ca, a tool which automates website creation for construction & home service businesses.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Web & App Developer @ LifeCourseOnline, a tool for empowering caregivers of people with disabilities.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Co-Founder of Infrascan, award-winning software for geospatial & community analysis.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />IT Manager @ Built By Pros Inc. where I built computers and managed software during an office expansion.</li>
        </ul>
        <h3 className="pt-8">Achievements to Highlight:</h3>
        <ul>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Ingenious+ scholar awarded by the lieutenant governor of Ontario.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Alumni of DMZ Basecamp 2024, the largest university based startup incubator in the world.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />3.8/4.0 GPA first year @ University of Toronto with a Software Engineering Specialist.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Youreka Canada national data science symposium 2nd in Toronto.</li>
            <li className="list-none flex relative"><Star className="text-yellow-300 absolute -left-6 w-4" />Shad Canada alumni and valedictorian, University of New Brunswick.</li>
        </ul>
    </>
}