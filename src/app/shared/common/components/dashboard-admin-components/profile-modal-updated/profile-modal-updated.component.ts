import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Role, User } from '@features/auth/interfaces/register.interface';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-modal-updated',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile-modal-updated.component.html',
  styleUrl: './profile-modal-updated.component.css',
})
export class ProfileModalUpdatedComponent implements OnInit {
  @Input() selectedUser: User | null = null;
  @Input() isUpdating: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<User>();

  toastr = inject(ToastrService);
  Role = Role;

  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  ngOnInit(): void {}

  get roles(): Role[] {
    return this.selectedUser?.role || [Role.USER];
  }

  set roles(value: Role[]) {
    if (this.selectedUser) {
      this.selectedUser.role = Array.isArray(value)
        ? value
        : [value || Role.USER];
    }
  }

  // Añade este método para manejar cambios en los roles
  onRoleChange(selectedRoles: Role[] | Role) {
    if (this.selectedUser) {
      this.selectedUser.role = Array.isArray(selectedRoles)
        ? selectedRoles
        : [selectedRoles];
    }
  }

  // Inject Services
  userService = inject(UserService);
  showUpdateModal: boolean = false;

  // Method to close modal
  closeUpdateModal() {
    this.closeModal.emit();
  }

  onFileSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      this.selectedFile = null;
      this.avatarPreview = null;
      return;
    }

    const file = fileInput.files[0];
    const validExtensions = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!validExtensions.includes(file.type)) {
      this.toastr.error('Formato no válido. Use JPG, JPEG, PNG, GIF o WEBP');
      return;
    }
    // Save the file to send it
    this.selectedFile = file;

    // Preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedUser!!.avatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Method to update Profile changes
  updateProfileChanges() {
    if (!this.selectedUser) return;

    const roles = Array.isArray(this.selectedUser.role)
      ? this.selectedUser.role
      : [this.selectedUser.role || Role.USER];

    // Create a copy of update data user
    const updatedUser: User = {
      ...this.selectedUser,
      role: roles,
      avatarFile: this.selectedFile ?? undefined, 
    };

    this.saveChanges.emit(updatedUser);
  }

  toggleRole(role: Role) {
    if (!this.selectedUser) return;

    if (!this.selectedUser.role) {
      this.selectedUser.role = [role];
      return;
    }

    const index = this.selectedUser.role.indexOf(role);
    if (index >= 0) {
      // Remove role if already present
      this.selectedUser.role.splice(index, 1);
      // Ensure at least one role remains
      if (this.selectedUser.role.length === 0) {
        this.selectedUser.role.push(Role.USER);
      }
    } else {
      // Add role if not present
      this.selectedUser.role.push(role);
    }

    // Remove duplicates
    this.selectedUser.role = [...new Set(this.selectedUser.role)];
  }
}
