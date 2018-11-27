interface MyanmarSectorySeverityScore {
    value: number,
    label: {
        en: string
    }
}

export const SectorSeverityScale: MyanmarSectorySeverityScore[] = [
    {
        value: 1, 
        label: {
            en: "No concern – situation under control"
        }
    },
    {
        value: 2, 
        label: {
            en: "Situation of concern that requires monitoring",
        }
    },
    {
        value: 3, 
        label: {
            en: "Many people are suffering because of insufficient [supply of goods or services]",
        }
    },
    {
        value: 4, 
        label: {
            en: "Many people will die because [supply of goods or services] are insufficient",
        }
    },
    {
        value: 5, 
        label: {
            en: "Many people are known to be dying due to insufficient [supply of goods or services]",
        }
    }
];