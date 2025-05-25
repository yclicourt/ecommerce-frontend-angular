import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Status } from '@features/auth/enums/status.enum';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileModalUpdatedComponent } from '../../shared/common/components/dashboard-admin-components/profile-modal-updated/profile-modal-updated.component';
import { Role, User } from '@features/auth/interfaces/register.interface';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, ProfileModalUpdatedComponent],
  templateUrl: './profile-dashboard.component.html',
  styleUrl: './profile-dashboard.component.css',
})
export default class ProfileDashboardComponent implements OnInit {
  userService = inject(UserService);
  toastr = inject(ToastrService);
  router = inject(Router);

  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  // Save the selected user ids
  selectedUserIds = new Set<number>();
  selectAll = false;

  showUpdateModal: boolean = false;
  selectedUser: User | null = null;
  isUpdating: boolean = false;
  currentUserId!: number | null;
  ifActive: Status = Status.ACTIVE;
  isDeleting = false;

  ngOnInit(): void {
    this.getUsersDashboard();
  }

  // Method to get all profiles on dashboard
  getUsersDashboard() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.userService.users = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  // Method to handle a selected profile
  toggleUserSelection(userId: number): void {
    if (this.selectedUserIds.has(userId)) {
      this.selectedUserIds.delete(userId);
    } else {
      this.selectedUserIds.add(userId);
    }
    this.selectAll =
      this.selectedUserIds.size === this.userService.users.length;
  }

  // Method to handle select all profiles
  toggleSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectAll = target.checked;

    if (this.selectAll) {
      this.userService.users.forEach((user) =>
        this.selectedUserIds.add(user.id)
      );
    } else {
      this.selectedUserIds.clear();
    }
  }

  // Method to check if a profile is selected
  isSelected(userId: number): boolean {
    return this.selectedUserIds.has(userId);
  }

  // Method to delete a profile
  getDeleteProfile(userId: number) {
    // Assign the ID to the userId property
    this.currentUserId = userId;

    // Verify if user is autenticated
    if (!this.userService.isAuthenticated()) {
      this.toastr.error('You need a session to create products');
      return;
    }

    // Verify rol user
    if (!this.userService.getCurrentUserRole()) {
      this.toastr.error('Need privileges to complete this action');
      return;
    }

    // Getting token
    const token = this.userService.getToken();

    //Verify product not null
    if (this.currentUserId === null) {
      this.toastr.error('No product selected for update');
      return;
    }

    // Call the service to delete user
    this.userService.deleteUser(this.currentUserId, token).subscribe({
      next: () => {
        this.toastr.success('Profile deleted successfully');
        this.getUsersDashboard();
      },
      error: (e: HttpErrorResponse) => {
        // Handle different error statuses
        if (e.status == 401) {
          this.toastr.error('Session Expired, please init session again');
          this.userService.logout();
        } else if (e.status == 403) {
          this.toastr.error('Forbbiden');
        } else {
          console.log(e);
          this.toastr.error('Error to delete profile');
        }
      },
    });
  }

  // Method to delete selected profiles
  async deleteSelectedUsers(): Promise<void> {
    if (this.selectedUserIds.size === 0) return;

    this.isDeleting = true;

    // Verify if user is authenticated
    if (!this.userService.isAuthenticated()) {
      this.toastr.error('You need a session to perform this action');
      this.router.navigateByUrl('/login');
      return;
    }

    if (!this.userService.getCurrentUserRole()) {
      this.toastr.error('Need privileges to complete this action');
      return;
    }

    try {
      const idsToDelete = Array.from(this.selectedUserIds);

      // Show confirmation before delete
      const confirmDelete = confirm(
        `Are you sure you want to delete ${idsToDelete.length} users?`
      );
      if (!confirmDelete) return;

      // Call the service to delete users
      await firstValueFrom(this.userService.deleteUsers(idsToDelete));

      // Update the list
      this.getUsersDashboard();
      this.selectedUserIds.clear();
      this.selectAll = false;

      // Show notification
      this.toastr.success(`${idsToDelete.length} users deleted successfully`);
    } catch (error: any) {
      console.error('Error deleting users:', error);

      // Specific error handling
      if (error.status === 401) {
        this.toastr.error('Session Expired, please login again');
        this.userService.logout();
      } else if (error.status === 403) {
        this.toastr.error('Forbidden: Insufficient permissions');
      } else {
        this.toastr.error('Error deleting users');
      }
    } finally {
      this.isDeleting = false;
    }
  }

  // Method to open modal
  openModalUpdated() {
    if (this.selectedUserIds.size !== 1) {
      return; //Only allow if there is exactly 1 user selected
    }

    const selectedId = Array.from(this.selectedUserIds)[0];
    this.selectedUser =
      this.userService.users.find((user) => user.id === selectedId) || null;

    if (this.selectedUser) {
      this.showUpdateModal = true;
    } else {
      this.toastr.error('Selected user not found');
    }
  }

  // Method to close modal
  closeUpdateModal() {
    this.showUpdateModal = false;
    this.selectedUser = null;
  }

  // Method to update a profile
  async updateUserProfile(updatedUser: User) {
    if (!this.selectedUser) return;

    this.isUpdating = true;

    // Verify authentication and privileges
    if (!this.userService.isAuthenticated()) {
      this.toastr.error('You need a session to create products');
      this.isUpdating = false;
      return;
    }

    if (!this.userService.getCurrentUserRole()) {
      this.toastr.error('Need privileges to complete this action');
      this.isUpdating = false;
      return;
    }

    const token = this.userService.getToken();
    let updateData: FormData | Omit<User, 'id' | 'password' | 'createdAt'>;

    try {
      if (updatedUser.avatarFile) {
        const formData = new FormData();
        formData.append('avatar', updatedUser.avatarFile);
        formData.append('name', updatedUser.name);
        formData.append('lastname', updatedUser.lastname);
        formData.append('email', updatedUser.email);
        formData.append('phone', updatedUser.phone.toString());
        formData.append('address', updatedUser.address);

        if (updatedUser.role) {
          const rolesArray = Array.isArray(updatedUser.role)
            ? updatedUser.role
            : [updatedUser.role];
          rolesArray.forEach((role) => {
            formData.append('role[]', role);
          });
        }
        console.log(
          'FormData procesado:',
          Array.from((formData as any).entries())
        );
        updateData = formData;
      } else {
        updateData = {
          name: updatedUser.name,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          role: Array.isArray(updatedUser.role)
            ? updatedUser.role
            : [updatedUser.role || Role.USER],
          avatar: updatedUser.avatar,
        };
      }

      console.log(updateData);
      const updateResponse = await firstValueFrom(
        this.userService.updateUser(updateData, this.selectedUser.id, token)
      );

      // Update user list
      const index = this.userService.users.findIndex(
        (u) => u.id === updateResponse.id
      );
      if (index !== -1) {
        this.userService.users[index] = updateResponse;
      }

      this.toastr.success('Profile updated successfully');
      this.closeUpdateModal();
    } catch (error: any) {
      console.error('Error:', error);
      this.toastr.error(error.error?.message || 'Error updating profile');
    } finally {
      this.isUpdating = false;
    }
  }

  // Method to get avatar url
  getAvatarUrl(avatarPath: string | null): string {
    if (!avatarPath) {
      return '/avatar.svg';
    }
    return `${environment.apiUrl}${avatarPath}`;
  }

  // Handler for error
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/avatar.svg';
  }
}
