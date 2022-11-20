import { Component } from '@angular/core';
import { InitMatrix,SetEquation,InitCanvasLogic} from './matrix.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'graphvis';
  constructor(){

  InitMatrix(400, 400);
  InitCanvasLogic();
  
  document.getElementsByClassName("equation-submit")[0].addEventListener("click",SetEquation);

  }
}
