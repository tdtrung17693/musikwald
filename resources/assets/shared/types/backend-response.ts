import {Observable} from 'rxjs';
import {MetaTag} from '@app/meta.service';

type Generic<T extends {}> = T & {
    status: string,
    seo?: MetaTag[]
};

export interface BackendResponse<T> extends Observable<Generic<T>> {}
