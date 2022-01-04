import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { BackEndService } from 'src/app/services/back-end.service';
import { UserService } from 'src/app/services/user.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [MessageService],
  animations: [
    trigger('errorState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
})
export class CheckoutComponent implements OnInit {

  items: MenuItem[] = [];
  activeIndex: number = 0;
  userLoged: boolean = false;
  user: any;
  orders: any[] = [];
  cartOrders: any[] = [];
  cartItems: any[] = [];
  count: number = 0;
  totalPrice: number = 0;
  shipping: number = 30;
  grandTotal: number = 0;
  faLock = faLock;
  faCheckCircle = faCheckCircle;
  editedAddress = {
    firstName: '',
    lastName: '',
    governorate: '',
    city: '',
    area: '',
    street: '',
    phone: '',
    locationType: '',
    shippingNote: ''
  }

  order = {
    orderItems: [
      {
        quantity: '',
        product: ''
      }
    ],
    firstName: '',
    lastName: '',
    governorate: '',
    city: '',
    area: '',
    street: '',
    locationType: '',
    phone: '',
    totalPrice: '',
    shippingNote: '',
    status: 'pending',
    paymentMethod: 'Credit or Debit Cards',
    user: ''
  }

  currentYear = new Date().getFullYear();
  cc: string = "";
  ccRegex: any = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/;
  ccMonth: any;
  ccYear: any;
  editCity: string = "";

  addressFlag: boolean = false;
  cityFlag: boolean = true;
  areaFlag: boolean = true;
  fNameErrorFlag: boolean = false;
  lNameErrorFlag: boolean = false;
  governorateErrorFlag: boolean = false;
  cityErrorFlag: boolean = false;
  areaErrorFlag: boolean = false;
  streetErrorFlag: boolean = false;
  locationErrorFlag: boolean = false;
  editLocationFlag: boolean = false;
  paymentFlag: boolean = true;
  paymentMethodFlag: boolean = true;
  cardNumberErrorFlag: boolean = false;
  cardNameErrorFlag: boolean = false;

  @ViewChild('i1') fNameInput: any;
  @ViewChild('i2') lNameInput: any;
  @ViewChild('i3') governorateInput: any;
  @ViewChild('i4') cityInput: any;
  @ViewChild('i5') areaInput: any;
  @ViewChild('i6') streetInput: any;
  @ViewChild('i7') locationInput: any;
  @ViewChild('i1') cardNumberInput: any;
  @ViewChild('i2') cardNameInput: any;
  @ViewChild('i3') cardMonthInput: any;
  @ViewChild('i4') cardYearInput: any;
  @ViewChild('i5') cvcInput: any;

  deliveryCities: any[] = [
    {
      governorate: 'Damietta',
      cities: ['AZ Zarqa', 'Faraskour', 'Kafr Saad', 'New Damietta', 'Damietta'],
    },
    {
      governorate: 'Ash Sharqia',
      cities: ['New Salhia', 'Zakazik', '10th of Ramadan City', '10th of Ramadan Desert', '10th of Ramadan Desert'],
    },
    {
      governorate: 'Giza',
      cities: ['Giza', '6th of October City', 'Agouza', 'Al Ayat', 'Al Giza Desert'],
    },
    {
      governorate: 'Suez',
      cities: ['Aamr Village', 'Al Ganayen', 'Arbeen', 'Ataqah', 'Faysal'],
    },
    {
      governorate: 'Gharbia',
      cities: ['Tanta'],
    },
    {
      governorate: 'Dakahila',
      cities: ['Al Mansourah', 'As Santah', 'Basioun', 'Kafr El-Zayat', 'Qotour'],
    },
    {
      governorate: 'Alexandria',
      cities: ['Alexandria City', 'Ad Daerah Al Gomrokeyah', 'Al Amaria First', 'Alexandria Desert', 'Dekhela'],
    },
    {
      governorate: 'Asyut',
      cities: ['Abnub', 'Abu Tij', 'Al Badari', 'Al Fath', 'Al Qusiyyah'],
    },
    {
      governorate: 'Aswan',
      cities: ['Aswan', 'Kom Ombo', 'Edfo', 'Abu Simbel', 'Abu Simbel Desert'],
    },
    {
      governorate: 'Cairo',
      cities: ['Cario', 'Helwan', 'Abdeen', 'Heliopolis', 'Maadi'],
    },
    {
      governorate: 'Qalyubia',
      cities: ['Benha', 'Al Obour Desert', 'Al Qanater Al Khayreyah', 'El Obour City', 'Shibin Al Qanater'],
    },
    {
      governorate: 'Beheria',
      cities: ['Al Mahmmoudeya', 'Al Natron Valley', 'El Beheira Desert', 'Gharb El Noubareya', 'Markaz Abu Al Matamir'],
    },
    {
      governorate: 'Ismaillia',
      cities: ['Ismaillia', 'Abo Swir', 'Abo Swir Desert', 'Abou Sultan', 'Al Qantarah Gharb'],
    },
    {
      governorate: 'Red Sea',
      cities: ['Hurghada', 'Al Shalateen Desert', 'El Qoseir', 'Marsa Alam', 'Safaga'],
    },
  ];

  deliveryLocations: any[] = [];

  constructor(public userService: UserService, public router: Router, private messageService: MessageService, private backendService: BackEndService) {
    if (this.userService.getUserId() != undefined) {

      this.backendService.getUser(this.userService.getUserId()).subscribe(res => {
        this.user = res;
        this.userLoged = true;

        this.backendService.getUserOrders(this.user._id).subscribe(
          res => {

            this.orders = res as Array<any>;

            console.log(this.orders);

            this.cartOrders = this.orders.filter(order => order.status === "cart");


            let counter = 0;

            this.cartOrders.forEach(cartOrder => {

              this.cartItems.push(...cartOrder.orderItems);
              this.count += cartOrder.orderItems[0].quantity;
              this.totalPrice += cartOrder.totalPrice;

              for (; counter < this.cartItems.length; counter++) {
                this.cartItems[counter].orderId = cartOrder._id;
              }
            });

            this.grandTotal = this.totalPrice + this.shipping;
            console.log(this.cartItems);
          }
        );
      });
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.items = [{
      label: 'Shipping',
      command: (event: any) => {
        this.activeIndex = 0;
        this.messageService.add({ severity: 'info', summary: 'First Step', detail: event.item.label });
      }
    },
    {
      label: 'Payment',
      command: (event: any) => {
        this.activeIndex = 1;
        this.messageService.add({ severity: 'info', summary: 'Seat Selection', detail: event.item.label });
      }
    },
    {
      label: 'Done',
      command: (event: any) => {
        this.activeIndex = 2;
        this.messageService.add({ severity: 'info', summary: 'Pay with CC', detail: event.item.label });
      }
    },
    ];
  }

  next() {
    this.activeIndex++;
  }

  prev() {
    this.activeIndex--;
    if (this.activeIndex == 0) {
      this.editLocationFlag = true;
      this.editedAddress.firstName = this.user.address[0].firstName;
      this.editedAddress.lastName = this.user.address[0].lastName;
      this.editedAddress.governorate = this.user.address[0].governorate;
      this.editedAddress.city = this.user.address[0].city;
      this.editedAddress.area = this.user.address[0].area;
      this.editedAddress.street = this.user.address[0].street;
      this.editedAddress.locationType = this.user.address[0].locationType;
      this.editedAddress.phone = this.user.address[0].phone;
    }
  }


  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'You want to delete this address' });
  }

  onConfirm() {
    this.messageService.clear('c');
    this.user.address = [];
    this.backendService.editAddress(this.user._id, this.user).subscribe(
      res => {
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Done', detail: 'Address was deleted' });
        // localStorage.removeItem('userProfileAddress');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    );
  }

  onReject() {
    this.messageService.clear('c');
  }

  showAddressForm() {
    this.hideEditAddressForm();
    this.addressFlag = true;
  }


  hideAddressForm() {

    this.addressFlag = false;
    this.fNameErrorFlag = false;
    this.lNameErrorFlag = false;
    this.governorateErrorFlag = false;
    this.cityErrorFlag = false;
    this.areaErrorFlag = false;
    this.streetErrorFlag = false;
    this.locationErrorFlag = false;
  }

  showCities(event: any) {
    this.cityFlag = false;
    for (let i = 1; i < event.target.length; i++) {
      if (event.target[i].selected == true) {
        let value = this.deliveryCities.find(location => location.governorate == event.target[i].value);
        this.deliveryLocations = [];
        this.deliveryLocations.push(...value.cities);
      }
    }
  }

  showCitiesOnEdit(event: any) {
    for (let i = 1; i < event.target.length; i++) {
      if (event.target[i].selected == true) {
        let value = this.deliveryCities.find(location => location.governorate == event.target[i].value);
        this.deliveryLocations = [];
        this.deliveryLocations.push(...value.cities);
      }
    }
  }

  showAreas(event: any) {
    this.areaFlag = false;
  }

  showAreasOnEdit(event: any) { }

  saveAddress(id: number) {
    if (!this.firstNameCheck()) {
      this.fNameErrorFlag = true;
    }

    if (!this.lastNameCheck()) {
      this.lNameErrorFlag = true;
    }

    if (!this.governorateCheck()) {
      this.governorateErrorFlag = true;
    }

    if (!this.cityCheck()) {
      this.cityErrorFlag = true;
    }

    if (!this.areaCheck()) {
      this.areaErrorFlag = true;
    }

    if (!this.streetCheck()) {
      this.streetErrorFlag = true;
    }

    if (!this.locationCheck()) {
      this.locationErrorFlag = true;
    }

    if (
      this.firstNameCheck() && this.lastNameCheck() && this.governorateCheck() && this.cityCheck() && this.areaCheck()
      && this.streetCheck() && this.locationCheck()
    ) {

      this.user.address.push(this.editedAddress);

      this.backendService.editAddress(this.user._id, this.user).subscribe(
        res => {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Address was updated', life: 2000 });
          this.addressFlag = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      );
    } else {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Address was not saved', life: 2000 });
    }
  }

  hideEditAddressForm() {
    this.editLocationFlag = false;
  }

  editAddress(address: any) {

    this.editLocationFlag = true;
    this.editedAddress.firstName = address.firstName;
    this.editedAddress.lastName = address.lastName;
    this.editedAddress.governorate = address.governorate;
    this.editedAddress.city = address.city;
    this.editedAddress.area = address.area;
    this.editedAddress.street = address.street;
    this.editedAddress.locationType = address.locationType;
    this.editedAddress.phone = address.phone;
    this.editedAddress.shippingNote = address.shippingNote;

    let value = this.deliveryCities.find(location => location.governorate == address.governorate);

    this.deliveryLocations = [];
    this.deliveryLocations.push(...value.cities);
    this.editCity = this.deliveryLocations.find(city => city == address.city);
  }

  updateAddress() {

    if (!this.firstNameCheck()) {
      this.fNameErrorFlag = true;
    }

    if (!this.lastNameCheck()) {
      this.lNameErrorFlag = true;
    }

    if (!this.governorateCheck()) {
      this.governorateErrorFlag = true;
    }

    if (!this.cityCheck()) {
      this.cityErrorFlag = true;
    }

    if (!this.areaCheck()) {
      this.areaErrorFlag = true;
    }

    if (!this.streetCheck()) {
      this.streetErrorFlag = true;
    }

    if (!this.locationCheck()) {
      this.locationErrorFlag = true;
    }

    if (
      this.firstNameCheck() && this.lastNameCheck() && this.governorateCheck() && this.cityCheck() && this.areaCheck()
      && this.streetCheck() && this.locationCheck()
    ) {

      this.user.address = this.editedAddress;

      this.backendService.editAddress(this.user._id, this.user).subscribe(
        res => {
          this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: 'Address was updated', life: 2000 });
          this.editLocationFlag = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      );
    } else {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Address was not updated', life: 2000 });
    }
  }

  changePayment(index: number) {
    this.paymentMethodFlag = !this.paymentMethodFlag;
    this.cardNumberErrorFlag = false;
    this.cardNameErrorFlag = false;

    if (index === 1) {
      this.grandTotal += 10;
      this.order.paymentMethod = "Cash On Delivery (COD)";
    }
    else {
      this.grandTotal -= 10;
      this.order.paymentMethod = "Credit or Debit Cards";
    }
  }

  makeOrder() {
    if (this.paymentMethodFlag == true) {

      if (!this.checkCardNumber()) {
        this.cardNumberErrorFlag = true;
      }

      if (!this.checkCardName()) {
        this.cardNameErrorFlag = true;
      }

      this.checkCardMonth();
      this.checkCardYear();
      this.checkCVC();

      if (this.checkCardNumber() && this.checkCardName() && this.checkCardMonth() && this.checkCardYear() && this.checkCVC()) {
        this.setUpOrder();
      }
    } else {
      this.setUpOrder();
    }
  }

  async setUpOrder() {

    this.order.firstName = this.user.address[0].firstName;
    this.order.lastName = this.user.address[0].lastName;
    this.order.governorate = this.user.address[0].governorate;
    this.order.city = this.user.address[0].city;
    this.order.area = this.user.address[0].area;
    this.order.street = this.user.address[0].street;
    this.order.locationType = this.user.address[0].locationType;
    this.order.phone = this.user.address[0].phone;
    this.order.totalPrice = `${this.grandTotal}`;
    this.order.shippingNote = this.user.address[0].shippingNote;
    this.order.user = this.user._id;

    this.cartItems.forEach(item => {
      this.backendService.deleteCartOrder(item.orderId);
    });

    console.log(this.cartItems.length);

    let i = 0;
    while (i < this.cartItems.length) {
      this.cartItems[i].product.countInStock = this.cartItems[i].product.countInStock - this.cartItems[i].quantity;
      this.backendService.editProduct(this.cartItems[i].product._id, this.cartItems[i].product).subscribe(
        res => console.log(res),
        error => console.log(error)
      );
      i++;
    }

    console.log(this.cartItems);


    this.order.orderItems = [];
    this.cartItems.forEach(cartItem => this.order.orderItems.push(cartItem));

    console.log(this.order);


    this.backendService.makeOrder(this.order).subscribe(
      res => {
        console.log(res);
        this.activeIndex = 2;
      },
      error => console.log(error)
    );
  }

  firstNameCheck() {

    if (this.editedAddress.firstName.length < 3) {
      this.fNameErrorFlag = true;
      this.fNameInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.fNameErrorFlag = false;
      this.fNameInput.nativeElement.style.border = '';
      return true;
    }
  }

  lastNameCheck() {
    if (this.editedAddress.lastName.length < 2) {
      this.lNameErrorFlag = true;
      this.lNameInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.lNameErrorFlag = false;
      this.lNameInput.nativeElement.style.border = '';
      return true;
    }
  }

  governorateCheck() {
    if (this.editedAddress.governorate.length == 0) {
      this.governorateErrorFlag = true;
      this.governorateInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.governorateErrorFlag = false;
      this.governorateInput.nativeElement.style.border = '';
      return true;
    }
  }

  cityCheck() {
    if (this.editedAddress.city.length == 0) {
      this.cityErrorFlag = true;
      this.cityInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.cityErrorFlag = false;
      this.cityInput.nativeElement.style.border = '';
      return true;
    }
  }

  areaCheck() {
    if (this.editedAddress.area.length == 0) {
      this.areaErrorFlag = true;
      this.areaInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.areaErrorFlag = false;
      this.areaInput.nativeElement.style.border = '';
      return true;
    }
  }

  streetCheck() {
    if (this.editedAddress.street.length == 0) {
      this.streetErrorFlag = true;
      this.streetInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.streetErrorFlag = false;
      this.streetInput.nativeElement.style.border = '';
      return true;
    }
  }

  locationCheck() {
    if (this.editedAddress.locationType.length == 0) {
      this.locationErrorFlag = true;
      this.locationInput.nativeElement.style.border = '1px solid red';
      return false;
    } else {
      this.locationErrorFlag = false;
      this.locationInput.nativeElement.style.border = '';
      return true;
    }
  }

  checkCardNumber() {
    if (!this.ccRegex.test(this.cc)) {
      this.cardNumberErrorFlag = true;
      this.cardNumberInput.nativeElement.style.border = "1px solid red";
      return false;
    } else {
      this.cardNumberErrorFlag = false;
      this.cardNumberInput.nativeElement.style.border = "";
      return true;
    }
  }

  checkCardName() {
    if (this.cardNameInput.nativeElement.value == 0) {
      this.cardNameErrorFlag = true;
      this.cardNameInput.nativeElement.style.border = "1px solid red";
      return false;
    } else {
      this.cardNameErrorFlag = false;
      this.cardNameInput.nativeElement.style.border = "";
      return true;
    }
  }

  checkCardMonth() {
    console.log(this.ccMonth > 0);
    if (this.ccMonth > 0) {
      this.cardMonthInput.nativeElement.style.border = "";
      return true;
    } else {
      this.cardMonthInput.nativeElement.style.border = "1px solid red";
      return false;
    }
  }

  checkCardYear() {
    if (this.ccYear > 0) {
      this.cardYearInput.nativeElement.style.border = "";
      return true;
    } else {
      this.cardYearInput.nativeElement.style.border = "1px solid red";
      return false;
    }
  }

  checkCVC() {
    if (this.cvcInput.nativeElement.value.length == 3) {
      this.cvcInput.nativeElement.style.border = "";
      return true;
    } else {
      this.cvcInput.nativeElement.style.border = "1px solid red";
      return false;
    }
  }
}