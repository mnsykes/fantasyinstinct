export interface Team {
    division: string;
    id: string;
    name: string;
    salaryInfo: {
        cap: string;
        used: string;
        remaining: string;
        floor: string;
    }
}