import {Injectable} from '@angular/core';
import {UploadValidator} from '../../uploads/validation/upload-validator';
import {FileSizeValidation} from '../../uploads/validation/validations/file-size-validation';
import {convertToBytes} from '../../shared/utils/convertToBytes';
import {FileTypeValidation} from '../../uploads/validation/validations/file-type-validation';

@Injectable({
    providedIn: 'root'
})
export class AudioUploadValidator extends UploadValidator {
    protected readonly DEFAULT_MAX_SIZE_MB = 50;
    public showToast = true;

    protected initValidations() {
        const validations = [
            new FileSizeValidation(
                {maxSize: this.getMaxFileSize()},
                this.i18n
            ),
            new FileTypeValidation({types: ['audio', 'video']}, this.i18n),
        ];

        this.validations.push(...validations);
    }

    protected getMaxFileSize(): number {
        return this.settings.get(
            'uploads.max_size',
            convertToBytes(this.DEFAULT_MAX_SIZE_MB, 'MB')
        );
    }
}
