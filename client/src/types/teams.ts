export interface Team {
    id: string;
    name: string;
    salaryInfo: {
        cap: string;
        used: string;
        remaining: string;
        floor: string;
    }
}