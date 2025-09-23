// hooks/useSweetAlert.js
import Swal from 'sweetalert2';

export const useSweetAlert = () => {
    const confirmDelete = (employeeName) => {
        return Swal.fire({
            title: 'Are you sure?',
            html: `You are about to delete <strong>${employeeName}</strong>. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            customClass: {
                popup: '!opacity-100 !visible',
                confirmButton: '!opacity-100 !visible !inline-block',
                cancelButton: '!opacity-100 !visible !inline-block',
                actions: '!opacity-100 !visible !flex !gap-3'
            },
            buttonsStyling: false,
            showClass: {
                popup: 'animate__animated animate__fadeIn'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOut'
            }
        });
    };

    const showSuccess = (message) => {
        return Swal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            confirmButtonColor: '#10b981',
            customClass: {
                confirmButton: '!opacity-100 !visible !inline-block'
            },
            buttonsStyling: false
        });
    };

    const showError = (message) => {
        return Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonColor: '#dc2626',
            customClass: {
                confirmButton: '!opacity-100 !visible !inline-block'
            },
            buttonsStyling: false
        });
    };

    return {
        confirmDelete,
        showSuccess,
        showError
    };
};