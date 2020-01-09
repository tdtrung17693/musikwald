import {Track} from './Track';
import {User} from 'shared/types/models/User';

export class Playlist {
    id: number;
    name: string;
    public: number;
    image: string;
    description: string;
    created_at: string;
    updated_at: string;
    is_owner: string;
    editors?: User[];
    tracks?: Track[];
    views = 0;

    constructor(params: Record<string, any> = {}) {
        for (const name in params) {
            if (params.hasOwnProperty(name)) {
                this[name] = params[name];
            }
        }
    }
}
