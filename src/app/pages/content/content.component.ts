import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CustomValidator } from '../../utils/validators/custom.validator';
import { IotService } from '../../services/iot/iot.service';
import { Device, FirmwareVersionInformation, Group, Project } from '../../interfaces/iot.interface';
import { GenericHash, UUID } from '../../interfaces/commons.interface';
import { SelectComponent } from '../../tools/select/select.component';
import { ProjectFormComponent } from '../../tools/project-form/project-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupFormComponent } from '../../tools/group-form/group-form.component';
import { DeviceFormComponent } from '../../tools/device-form/device-form.component';
import { FirmwareUpdateComponent } from '../../tools/firmware-update/firmware-update.component';

@Component({
  selector: 'app-content',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SelectComponent,
    ProjectFormComponent,
    GroupFormComponent,
    DeviceFormComponent,
    FirmwareUpdateComponent
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {

  private modalService = inject(NgbModal);
  private iotService = inject(IotService);
  projects: Project[] = [];
  allGroups: Group[] = [];
  groups: Group[] = [];
  devices: Device[] = [];
  versions: FirmwareVersionInformation | undefined;


  constructor() {
    this.iotService.getProjects().subscribe({
      next: (projects) => {
        console.log('Projects:', projects);
        this.projects = projects;
      },
      error: (err) => console.error(err),
    });

    this.iotService.getAllGroups().subscribe({
      next: (groups) => {
        this.allGroups = groups;
        if(this.nodeForm.get('project')?.value?.key) {
          this.selectProject(this.nodeForm.get('project')?.value?.key as UUID);
        }
      },
      error: (err) => console.error(err),
    });

    this.nodeForm.get('project')?.valueChanges.subscribe((project) => {
      if (project?.key) {
        this.selectProject(project.key as UUID);
      }
    });

    this.nodeForm.get('group')?.valueChanges.subscribe((groupId) => {
      this.devices = [];
      if (groupId) {

        this.iotService.getDevices(this.nodeForm.get('project')?.value?.value! as UUID, groupId).subscribe({
          next: (devices) => {
            this.devices = devices;
          },
          error: (err) => console.error(err),
        });

        this.iotService.getFirmwareVersions(this.nodeForm.get('project')?.value?.key! as UUID, groupId).subscribe({
          next: (firmware) => {
            this.versions = firmware;
          },
          error: (err) => console.error(err),
        })

      }
    });
  }

  selectProject(projectId: UUID) {
    this.groups = this.allGroups.filter((group) => group.projectEntity.id == projectId);
  }

  get projectOptions() {
    return this.projects.map(p => ({key: p.id as string, value: p.name}))
  }

  get loadGroup(){
    return this.nodeForm.get('project')?.touched && !this.nodeForm.get('project')?.invalid
  }

  get versionOptions(){
    return this.versions?.versions
      .sort((a, b) => a.lastModified.getTime() - b.lastModified.getTime())
      .map(version => {return {key: version.versionId, value: version.versionId} as GenericHash}) || []
  }

  nodeForm = new  FormGroup({
    project: new FormControl<{key: string, value: string} | undefined>(undefined, [Validators.required, CustomValidator.allowedValues(Object.values(this.projects.map(p => `${p.id}`)))]),
    group: new FormControl<UUID | undefined>(undefined, [Validators.required, CustomValidator.allowedValues(Object.values(this.groups.map(g => `${g.id}`)))]),
    device: new FormControl<UUID | undefined>(undefined, [Validators.required, CustomValidator.allowedValues(Object.values(this.devices.map(d => `${d.id}`)))]),
    firmware: new FormControl('', [Validators.required]),
  })

  groupFilterForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
  });

  applyGroupFilter() {
    const { id, name } = this.groupFilterForm.value;
    this.groups = this.allGroups.filter(group => {
      return (!id || group.id?.includes(id)) &&
             (!name || group.name.includes(name));
    });
  }

  onFileChange(event:any) {

  }

  selectGroup(event: any, groupId: UUID) {
    const target = event.target as HTMLElement;
    if(target.closest('.device')) return;
    const id =  groupId == this.nodeForm.get('group')?.value ? undefined : groupId;
    this.nodeForm.get('group')?.setValue(id);
  }

  selectDevice(deviceId: UUID) {
    const id = deviceId == this.nodeForm.get('device')?.value ? undefined : deviceId;
    this.nodeForm.get('device')?.setValue(id);
  }

  openProjectForm() {
    const modalRef = this.modalService.open(ProjectFormComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  openGroupForm() {
    const modalRef = this.modalService.open(GroupFormComponent);
    modalRef.componentInstance.inputProject.set(this.nodeForm.get('project')?.value?.key as UUID);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  openDeviceForm() {
    const modalRef = this.modalService.open(DeviceFormComponent);
    modalRef.componentInstance.inputGroup.set(this.nodeForm.get('group')?.value as UUID);
    modalRef.componentInstance.inputProject.set(this.nodeForm.get('project')?.value?.key as UUID);

    modalRef.result.then((result) => {
      if (result) {
        console.log('Device created:', result);
      }
    }).catch((err) => {
      console.error('Modal dismissed:', err);
    });
  }

  openFirmwareUpdate() {
    const modalRef = this.modalService.open(FirmwareUpdateComponent);
   

    modalRef.result.then((result) => {
      if (result) {
        console.log('Firmware updated:', result);
      }
    }).catch((err) => {
      console.error('Modal dismissed:', err);
    });
  }
}
