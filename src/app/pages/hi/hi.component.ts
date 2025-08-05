import { Component} from '@angular/core';
import { ProjectFormComponent } from '../../tools/project-form/project-form.component';

@Component({
  selector: 'app-hi',
  imports: [ProjectFormComponent],
  templateUrl: './hi.component.html',
  styleUrl: './hi.component.scss'
})
export class HiComponent{
  user: {name: string }= {name: 'User'};
  constructor() {
  }


}
