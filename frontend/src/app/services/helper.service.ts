import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

 constructor(private _snackBar: MatSnackBar) { }

 openSnackBar(message: string) {
   this._snackBar.open(message, 'OK', {
     horizontalPosition: "center",
     verticalPosition: "top",
     duration: 3000
   });
  }
}
