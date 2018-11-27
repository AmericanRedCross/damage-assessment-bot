interface MyanmarGeographicalSettings {
    id: string,
    name: {
        en: string
    }
}

export const GeographicalSettings: MyanmarGeographicalSettings[] = [
    {
        id: "urban",
        name: {
            en: "Urban"
        }
    },
    {
        id: "rural",
        name: {
            en: "Rural"
        }
    },
    {
        id: "semiUrban",
        name: {
            en: "Semi-Urban"
        }
    }
];