// pages/employees/add.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import EmployeeForm from '../../components/EmployeeForm';

export default function AddEmployee() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (formData) => {
        try {
            setIsLoading(true);
            setError('');
            setSuccess('');

            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Employee created successfully! Redirecting...');
                setTimeout(() => {
                    router.push('/employees');
                }, 1500);
            } else {
                setError(data.error || 'Failed to create employee');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Fill out the form below to add a new employee to the system.
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
                <div className="bg-white shadow rounded-lg p-6">
                    <EmployeeForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                        submitText="Add Employee"
                    />
                </div>

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