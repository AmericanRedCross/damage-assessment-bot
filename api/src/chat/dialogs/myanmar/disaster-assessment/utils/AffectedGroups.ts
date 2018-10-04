interface MyanmarAffectedGroups {
    id: string;
    name: {
        en: string;
    }
}

export const AffectedGroups: MyanmarAffectedGroups[] = [
    {
        id: "displacedIdp",
        name: {
            en: "Displaced IDP"
        }
    },
    {
        id: "displacedRefugeesAndAsylumSeekers",
        name: {
            en: "Displaced Refugees & Asylum Seekers"
        }
    },
    {
        id: "displacedReturnees",
        name: {
            en: "Displaced Returnees"
        }
    },
    {
        id: "displacedOthers",
        name: {
            en: "Displaced Others of Concern"
        }
    },
    {
        id: "nonDisplacedHost",
        name: {
            en: "Non-Displaced Host"
        }
    },
    {
        id: "nonDisplacedNonHost",
        name: {
            en: "Non-Displaced Non-Host"
        }
    }
];