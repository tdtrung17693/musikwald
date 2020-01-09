import {NgModule} from '@angular/core';
import {
    MatProgressBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatNativeDateModule,
    MatIconRegistry,
    MatIconModule,
    MatRadioModule,
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DomSanitizer} from '@angular/platform-browser';
import {Settings} from 'shared/config/settings.service';

@NgModule({
    imports: [
        MatProgressBarModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatListModule,
        MatExpansionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        DragDropModule,
    ],
    exports: [
        MatProgressBarModule,
        MatTableModule,
        MatIconModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatDialogModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatListModule,
        MatExpansionModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatRadioModule,
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        DragDropModule,
    ],
})
export class MaterialModule {
    constructor(
        private icons: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private config: Settings,
    ) {
        const url = this.config.getAssetUrl('icons/merged.svg');
        this.icons.addSvgIconSet(
            this.sanitizer.bypassSecurityTrustResourceUrl(url),
        );
    }
}
