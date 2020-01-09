import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from '../shared/contact/contact.component';

const routes: Routes = [
    {path: 'admin', loadChildren: 'app/admin/app-admin.module#AppAdminModule'},
    {path: 'contact', component: ContactComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
