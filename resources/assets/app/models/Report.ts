import {Track} from './Track';
import {User} from 'shared/types/models/User';

export enum ReportType {
    ILLEGAL = 0,
    BAD_QUALITY = 1,
    OTHER = 2,
};

export class Report {
    id?: number;
    additional_info: string;
    trackId?: number;
    viewed?: boolean;
    type: ReportType;

    constructor(params: Record<string, any> = {}) {
        for (const name in params) {
            if (params.hasOwnProperty(name)) {
                this[name] = params[name];
            }
        }
    }
}
