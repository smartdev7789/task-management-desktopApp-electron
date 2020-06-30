import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { speedDialFabAnimations } from "./speed-dial-fab.animations";
import { ProjectMenuComponent } from "../project-menu/project-menu.component";
import { MatDialog } from "@angular/material/dialog";
import { ConfigService } from "src/app/services/config.service";
import { TaskMenuComponent } from "../task-menu/task-menu.component";
import { TaskService } from "../../services/task.service";
import { TaskNode } from "src/app/models/task-node";

@Component({
	selector: "speed-dial-fab",
	templateUrl: "./speed-dial-fab.component.html",
	styleUrls: [
		"./speed-dial-fab.component.css"
	],
	animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {
	constructor(public dialog: MatDialog, private configService: ConfigService, private taskService: TaskService) {}

	ngOnInit(): void {}

	showItems(): void {
		this.fabTogglerState = "active";
		this.buttons = this.fabButtons;
	}

	hideItems(): void {
		this.fabTogglerState = "inactive";
		this.buttons = [];
	}

	onToggleFab(): void {
		this.buttons.length ? this.hideItems() : this.showItems();
	}

	addProject(): void {
		console.log("Add project button clicked.");
		this.configService.getDefaultProjectPath().then((result) => {
			var name: String;
			const dialogRef = this.dialog.open(ProjectMenuComponent, {
				data: { name: "New project", path: result + "/newProject.taskizer" }
			});
			console.log("Opened ProjectMenuComponent dialog.");
			dialogRef.afterClosed().subscribe((result) => {
				console.log(result);
				if (result == null) {
					console.log("New project empty.");
					return;
				}
				this.createNewProjectOutput.emit(result);
			});
		});
	}

	addTask(): void {
		console.log("Add task button clicked.");
		const dialogRef = this.dialog.open(TaskMenuComponent, {
			data: { name: "New task", level: 1, expandable: false, date: undefined }
		});
		console.log("Opened TaskMenuComponent dialog.");
		dialogRef.afterClosed().subscribe((result: TaskNode) => {
			if (result == null) {
				console.log("New task empty.");
			}
			else {
				this.taskService.addTask(result);
			}
		});
	}

	fabItemButtonClicked(buttonName): void {
		buttonName == "addProject" ? this.addProject() : this.addTask();
		this.hideItems();
	}

	@Output() createNewProjectOutput = new EventEmitter<Object>();

	fabButtons = [
		{
			icon: "playlist_add",
			name: "addProject"
		},
		{
			icon: "check_circle",
			name: "addTask"
		}
	];

	buttons = [];
	fabTogglerState = "inactive";
}
