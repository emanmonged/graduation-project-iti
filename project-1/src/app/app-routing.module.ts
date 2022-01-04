import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AddCategoryComponent } from './components/admin-panel/add-category/add-category.component';
import { AddProductComponent } from './components/admin-panel/add-product/add-product.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CategoriesComponent } from './components/admin-panel/categories/categories.component';
import { EditCategoryComponent } from './components/admin-panel/edit-category/edit-category.component';
import { OrdersComponent } from './components/admin-panel/orders/orders.component';
import { ProductsComponent } from './components/admin-panel/products/products.component';
import { UsersComponent } from './components/admin-panel/users/users.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ElectronicsComponent } from './components/product/electronics/electronics.component';
import { HeadphonesComponent } from './components/product/electronics/headphones/headphones.component';
import { LaptopsComponent } from './components/product/electronics/laptops/laptops.component';
import { MobilesComponent } from './components/product/electronics/mobiles/mobiles.component';
import { TelevisionsComponent } from './components/product/electronics/televisions/televisions.component';
import { ProductComponent } from './components/product/product.component';
import { ProfileAddressComponent } from './components/profile/profile-address/profile-address.component';
import { ProfileOrdersComponent } from './components/profile/profile-orders/profile-orders.component';
import { ProfileSettingsComponent } from './components/profile/profile-settings/profile-settings.component';
import { ProfileWishListComponent } from './components/profile/profile-wish-list/profile-wish-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "profile", component: ProfileComponent, children: [
      { path: "orders", component: ProfileOrdersComponent },
      { path: "address", component: ProfileAddressComponent },
      { path: "wish-list", component: ProfileWishListComponent },
      { path: "settings", component: ProfileSettingsComponent },
    ]
  },
  { path: "product", component: ProductComponent },
  {
    path: "products/electronics", component: ElectronicsComponent, children: [
      { path: "mobiles", component: MobilesComponent },
      { path: "televisions", component: TelevisionsComponent },
      { path: "laptops", component: LaptopsComponent },
      { path: "headphones", component: HeadphonesComponent },
    ]
  },
  { path: "shopping-cart", component: ShoppingCartComponent },
  { path: "checkout", component: CheckoutComponent },
  {
    path: "admin", component: AdminPanelComponent, children: [
      { path: "categories", component: CategoriesComponent },
      { path: "new-category", component: AddCategoryComponent },
      { path: "edit-category", component: EditCategoryComponent },
      { path: "products", component: ProductsComponent },
      { path: "new-product", component: AddProductComponent },
      { path: "users", component: UsersComponent },
      { path: "orders", component: OrdersComponent },
    ]
  },
  { path: "**", component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }