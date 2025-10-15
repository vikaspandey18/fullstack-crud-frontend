import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title: string = 'Employee Manager App';

  public employees: Employee[] = [];
  public errorMessage: string = '';
  public editEmployee!: Employee;
  public deleteEmployee!: Employee;

  constructor(private employeeService: EmployeeService) {}

  public getEmployee(): void {
    this.employeeService.getEmployee().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.message;
      },
    });
  }

  ngOnInit(): void {
    this.getEmployee();
  }

  public openModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('employeeContainer');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#employeeModal');
    }
    if (mode === 'edit' && employee) {
      this.editEmployee = employee;
      button.setAttribute('data-bs-target', '#updateEmployee');
    }
    if (mode === 'delete' && employee) {
      this.deleteEmployee = employee;
      button.setAttribute('data-bs-target', '#deleteEmployee');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm): void {
    this.employeeService.createEmployee(addForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        document.getElementById('closeAddModal')?.click();
        this.getEmployee();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: any) => {
        console.log(response);
        document.getElementById('closeUpdateModal')?.click();
        this.getEmployee();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (response: any) => {
        console.log(response);
        document.getElementById('closeDeleteModal')?.click();
        this.getEmployee();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public onSearch(key: string): void {
    // console.log('Searching for:', key);

    if (!key.trim()) {
      this.getEmployee(); // reload all employees if the search box is empty
      return;
    }

    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (
        employee.name.toLowerCase().includes(key.toLowerCase()) ||
        employee.email.toLowerCase().includes(key.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(key.toLowerCase())
      ) {
        results.push(employee);
      }
    }
    this.employees = results;
  }
}
