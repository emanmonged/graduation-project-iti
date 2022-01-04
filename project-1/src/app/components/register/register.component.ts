import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackEndService } from 'src/app/services/back-end.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  registerForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isAdmin: false
  }

  blockedDocument: boolean = false;

  constructor(private backendService: BackEndService, private router: Router, private messageService: MessageService) { }


  ngOnInit(): void {
  }
  
  register() {
    console.log(this.registerForm);
    
    this.backendService.registerService(this.registerForm).subscribe(res => {
      // console.log(res);
      this.messageService.add({ key: 'tc', severity: 'success', closable: false, summary: 'Success', detail: 'Redirecting to login.....', life: 10000 });
      this.blockDocument();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    }, error => {
      console.log(error);
    });
  }

  blockDocument() {
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
    }, 10000);
  }

}