import { Routes } from '@angular/router';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { ProductUserComponent } from './components/product-user/product-user.component';
import { AboutUserComponent } from './components/about-user/about-user.component';
import { CartUserComponent } from './components/cart-user/cart-user.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { NewspaperUserComponent } from './components/newspaper-user/newspaper-user.component';
import { ProductdetailUserComponent } from './components/productdetail-user/productdetail-user.component';
import { FavoriteUserComponent } from './components/favorite-user/favorite-user.component';
import { UserCustomComponent } from './components/user-custom/user-custom.component';
import { HistoryOrderComponent } from './components/history-order/history-order.component';
import { UpdateUserCustomComponent } from './components/update-user-custom/update-user-custom.component';
import { BrandUserComponent } from './components/brand-user/brand-user.component';

export const routes: Routes = [
    { path: '', component: HomeUserComponent },
    { path: 'user/product-user', component: ProductUserComponent },
    { path: 'user/about-user', component: AboutUserComponent },
    { path: 'user/cart-user', component: CartUserComponent },
    { path: 'user/brand-user', component: BrandUserComponent },
    { path: 'user/login-user', component: LoginUserComponent },
    { path: 'user/register-user', component: RegisterUserComponent },
    { path: 'user/newspaper-user', component: NewspaperUserComponent },
    { path: 'user/favorite-user', component: FavoriteUserComponent },

    { path: 'product/:productID', component: ProductdetailUserComponent }, // Đường dẫn đến chi tiết sản phẩm

    { path: 'order/:orderID', component: HistoryOrderComponent }, // Đường dẫn đến chi tiết đươn hàng


    { path: 'userupdate/:userID', component: UpdateUserCustomComponent }, // Đường dẫn đến đổi thông tin người dùng

    { path: 'user/my', component: UserCustomComponent }, // Đường dẫn đến chi tiết sản phẩm

    { path: '*', redirectTo: '' }, // Redirect cho các đường dẫn không hợp lệ
    
    //{ path: '**', component: ErrorAdminComponent} // Redirect cho các đường dẫn không hợp lệ
];
