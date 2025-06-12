export = VerbStatement;
declare class VerbStatement {
    constructor(verbId: any);
    verbId: any;
    verbDisplay: any;
    verbIds: {
        initialized: string;
        progressed: string;
        completed: string;
        accessed: string;
        skipped: string;
        selected: string;
        unlocked: string;
        interacted: string;
        used: string;
        responded: string;
        resumed: string;
        suspended: string;
        terminated: string;
        passed: string;
        failed: string;
        scored: string;
    };
    toXAPI(): {
        id: any;
        display: {
            en: any;
        };
    };
    toCSV(): any;
}
