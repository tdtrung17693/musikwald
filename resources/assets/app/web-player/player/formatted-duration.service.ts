import {Injectable} from '@angular/core';

@Injectable()
export class FormattedDuration {
    public fromMilliseconds(ms: number) {
        return this.fromNumber(ms, 'ms');
    }

    public fromSeconds(seconds: number) {
        return this.fromNumber(seconds, 'sec');
    }

    private fromNumber(originalSeconds: number, type: 'sec'|'ms') {
        if ( ! originalSeconds || originalSeconds < 0) {
            return '0:00';
        }

        // create new date at "0:00:0" time
        const date = new Date(2000, 1, 1);
        if (type === 'sec') {
            date.setSeconds(originalSeconds);
        }  else {
            date.setMilliseconds(originalSeconds);
        }

        const hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();

        // minutes should only have zero prepended if hours exist
        // example: 01:05:03 and 5:03
        if (hours !== '0') {
            minutes = this.prependZero(minutes);
        }

        const seconds = this.prependZero(date.getSeconds().toString());

        let formatted = `${minutes}:${seconds}`;

        // don't show hours at all if length less then 1 hour
        if (hours !== '0') {
            formatted = `${hours}:${formatted}`;
        }

        return formatted;
    }

    private prependZero(number: string) {
        if (number.length === 1) {
            number = '0' + number;
        }

        return number;
    }

    public toVerboseString(ms: number): string {
        const date = new Date(ms);
        let str = '';

        const hours = date.getUTCHours();
        if (hours) str += hours + 'hr ';

        const minutes = date.getUTCMinutes();
        if (minutes) str += minutes + 'min ';

        const seconds = date.getUTCMinutes();
        if (seconds && !hours && !minutes) str += seconds + 'sec ';

        return str;
    }
}
