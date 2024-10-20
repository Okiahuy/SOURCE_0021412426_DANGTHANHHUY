import { Routes } from '@angular/router';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { OrderAdminComponent } from './components/order-admin/order-admin.component';
import { CategoryAdminComponent } from './components/category-admin/category-admin.component';
import { ProductAdminComponent } from './components/product-admin/product-admin.component';
import { NewAdminComponent } from './components/new-admin/new-admin.component';
import { UserControllAdminComponent } from './components/user-controll-admin/user-controll-admin.component';
import { BrandAdminComponent } from './components/brand-admin/brand-admin.component';
import { InvoiceAdminComponent } from './components/invoice-admin/invoice-admin.component';
import { PaymentAdminComponent } from './components/payment-admin/payment-admin.component';
import { ErrorAdminComponent } from './components/error-admin/error-admin.component';
import { ColorAdminComponent } from './components/color-admin/color-admin.component';
import { MaterialAdminComponent } from './components/material-admin/material-admin.component';
import { OrderdetailAdminComponent } from './components/orderdetail-admin/orderdetail-admin.component';

export const routes: Routes = [
    { path: '', component: HomeAdminComponent },
    { path: 'admin/order-admin', component: OrderAdminComponent },
    { path: 'admin/category-admin', component: CategoryAdminComponent },
    { path: 'admin/brand-admin', component: BrandAdminComponent },
    { path: 'admin/payment-admin', component: PaymentAdminComponent },
    { path: 'admin/invoice-admin', component: InvoiceAdminComponent },
    { path: 'admin/product-admin', component: ProductAdminComponent },
    { path: 'admin/newspaper-admin', component: NewAdminComponent },
    { path: 'admin/user-admin', component: UserControllAdminComponent },
    { path: 'admin/color-admin', component: ColorAdminComponent},
    { path: 'admin/material-admin', component:  MaterialAdminComponent},


    { path: 'order/:orderID', component: OrderdetailAdminComponent }, // Đường dẫn đến chi tiết đươn hàng

    { path: 'orderinvoice/:orderID', component: InvoiceAdminComponent }, // Đường dẫn đến chi tiết đươn hàng

    { path: '*', redirectTo: '' }, // Redirect cho các đường dẫn không hợp lệ
    
    { path: '**', component: ErrorAdminComponent} // Redirect cho các đường dẫn không hợp lệ
];
