import { useEffect, useState } from "react";
import companies from "../../assets/companies.json";

export type CompanyData = typeof companies[number];

export function useCompanyData(): CompanyData|null {
    const companyId = new URLSearchParams(window.location.search).get("type") ?? null;
    const matchedCompany = (companies as any[]).find((c) => c.id === companyId);
    return matchedCompany ?? null;
}


