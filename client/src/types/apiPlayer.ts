type FantasyTeam = {
    commissioner: boolean;
    id: string;
    logoId: string;
    logoUrl128: string;
    logoUrl256: string;
    name: string;
    shortName: string;
}

type Info = {
    display: string;
    key: string;
    name: string;
    tradeName: string;
    tradeable: boolean;
    value: string;
}

type SalaryInfo = {
    info: Info[];
    title: string;
}

type MiscData = {
    maxActions: number;
    salaryInfo: SalaryInfo;
}

type TeamHeadingInfo = {
    h2hRecord: {
        name: string;
        shortName: string;
        value: string;
    },
    owners: {
        name: string;
        shortName: string;
        value: string;
    },
    rank: {
        name: string;
        shortName: string;
        value: string;
    }
}



export type ApiPlayer = {
    fantasyTeam: FantasyTeam;
    miscData: MiscData;
    teamHeadingInfo: TeamHeadingInfo;
}
