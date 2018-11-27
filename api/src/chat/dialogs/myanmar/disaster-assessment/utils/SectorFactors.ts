interface MyanmarSectorFactors {
    id: string,
    name: {
        en: string
    }
}

export const SectorFactors: MyanmarSectorFactors[] = [
    {
        id: "access",
        name: {
            en: "Access",
        }
    },
    {
        id: "availability",
        name: {
            en: "Availability",
        }
    },
    {
        id: "quality",
        name: {
            en: "Quality",
        }
    },
    {
        id: "use",
        name: {
            en: "Use",
        }
    }
];