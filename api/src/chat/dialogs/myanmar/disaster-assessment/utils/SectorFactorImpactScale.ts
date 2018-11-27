interface MyanmarSectorFactorImpaceScale {
    value: number,
    label: {
        en: string
    }
}

export const SectorFactorImpactScale: MyanmarSectorFactorImpaceScale[] = [
    {
        value: 1,
        label: {
            en: "Factor with Zero Impact",
        }
    },
    {
        value: 2,
        label: {
            en: "Factor with Low Impact",
        }
    },
    {
        value: 3,
        label: {
            en: "Factor with Medium Impact",
        }
    },
    {
        value: 4,
        label: {
            en: "Factor with High Impact"
        }
    }
];