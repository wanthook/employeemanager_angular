import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  public employees: Employee[] | [] ;
  public editEmployee: Employee | null;
  public deleteEmployee: Employee | null;

  constructor(private employeeService: EmployeeService){}

  ngOnInit(): void {
      this.getEmployee();
  }

  public getEmployee(): void{
    this.employeeService.getEmployee().subscribe(
      (response: Employee[]) => {
        this.employees =  response;
        console.log(this.employees)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm: NgForm): void{
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployee();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee: Employee): void{
    // document.getElementById('update-employee-form')?.click();
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployee();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmployee(employeeId: number): void{
    // document.getElementById('update-employee-form')?.click();
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployee();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployee(key: string): void{
    const results: Employee[] = [];

    for(const employee of this.employees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee); 
      }
    }
    this.employees = results;

    if(results.length === 0 || !key){
      this.getEmployee();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');

    }
    if(mode === 'edit'){
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if(mode === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }

}
