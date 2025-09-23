// pages/employees/edit/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import EmployeeForm from '../../../components/EmployeeForm';

export default function EditEmployee() {
    const router = useRouter();
    const { id } = router.query;
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/employees/${id}`);
            const data = await response.json();

            if (response.ok) {
                setEmployee(data.employee);
            } else {
                setError(data.error || 'Failed to fetch employee');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            const response = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Employee updated successfully! Redirecting...');
                setTimeout(() => {
                    router.push('/employees');
                }, 1500);
            } else {
                setError(data.error || 'Failed to update employee');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    if (error && !employee) {
        return (
            <Layout>
                <div className="max-w-2xl mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.back()}
                            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                            ← Back to Employee List
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Update the employee information below.
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Form */}
                {employee && (
                    <div className="bg-white shadow rounded-lg p-6">
                        <EmployeeForm
                            initialData={employee}
                            onSubmit={handleSubmit}
                            isLoading={isSubmitting}
                            submitText="Update Employee"
                        />
                    </div>
                )}

                {/* Back Link */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                        ← Back to Employee List
                    </button>
                </div>
            </div>
        </Layout>
    );
}