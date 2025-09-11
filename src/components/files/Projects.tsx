import { useCompanyData } from "@/lib/useCompanyData";
import { LanguageChart } from "../LanguageChart";
import { BoldWord } from "@/lib/BoldWord";

export default function Projects() {
    const targetCompany = useCompanyData();

    return <>
        <h2>Summary of this JSON file:</h2>
        <p>It contains information about projects Daniel has completed, and the programming languages & technologies he has used.</p>
        { targetCompany &&
            <p><BoldWord text={targetCompany.technologies} word={targetCompany.name} /></p>
        }
        <LanguageChart />
    </>
}