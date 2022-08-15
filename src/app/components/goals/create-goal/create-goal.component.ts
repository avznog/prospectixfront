import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManager } from 'src/app/models/project-manager.model';
import { ProjectManagersService } from 'src/app/services/project-managers/project-managers.service';
import { GoalsService } from '../../../services/goals/goals.service';

@Component({
  selector: 'app-create-goal',
  templateUrl: './create-goal.component.html',
  styleUrls: ['./create-goal.component.scss']
})
export class CreateGoalComponent implements OnInit {
  createGoalForm!: FormGroup;
  projectManagers!: ProjectManager[];
  pmSelected!: ProjectManager;
  choosingPm = false;
  constructor(
    private formBuilder: FormBuilder,
    private readonly goalsService: GoalsService,
    private readonly pmService: ProjectManagersService
  ) { }

  ngOnInit(): void {
    this.createGoalForm = this.formBuilder.group({
      title: ["", Validators.required],
      pmPseudo: ["", Validators.required],
      description: [""],
      deadline: [Date, Validators.required],
      isCyclic: [true, Validators.required],
      totalSteps: [0, Validators.required]
    })

    this.pmService.findAll()
      .subscribe({
        next: (data) => {
          this.projectManagers = data.filter(pm => !pm.disabled);
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  createGoal() {
    this.goalsService.createForPm(this.createGoalForm.value, this.pmSelected.pseudo);
  }

  selectPm(pm: ProjectManager) {
    this.pmSelected = pm;
  }
}
