// pages/employees/view/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { useSweetAlert } from '../../../hooks/useSweetAlert'


export default function ViewEmployee() {
    const router = useRouter();
    const { id } = router.query;
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { confirmDelete, showSuccess, showError } = useSweetAlert();
    

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
console.log('--------------');

        console.log(data);
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

    const handleDelete = async (employeeId, employeeName) => {
                
        const result = await confirmDelete(employeeName);
        
        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/employees/${employeeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setEmployees(employees.filter(emp => emp.EmployeeID !== employeeId));
                await showSuccess(`${employeeName} has been deleted successfully!`);
            } else {
                const data = await response.json();
                await showError(data.error || 'Failed to delete employee');
            }
        } catch (err) {
            await showError('Failed to delete employee');
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
            <div className="max-w-4xl mx-auto">
                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {employee && (
                    <>
                        {/* Header */}
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {employee.FirstName} {employee.LastName}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">Employee ID: {employee.EmployeeID}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/employees/edit/${employee.EmployeeID}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        Edit Employee
                                    </Link>
                                    <button
                                                        onClick={() => handleDelete(employee.EmployeeID, `${employee.FirstName} ${employee.LastName}`)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
                                    >
                                        Delete Employee
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Employee Details */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Employee Information</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                                        Personal Details
                                    </h3>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.FirstName}</dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{employee.LastName}</dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            <a 
                                                href={`mailto:${employee.Email}`}
                                                className="text-blue-600 hover:text-blue-500"
                                            >
                                                {employee.Email}
                                            </a>
                                        </dd>
                                    </div>
                                </div>

                                {/* Work Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                                        Work Details
                                    </h3>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Department</dt>
                                        <dd className="mt-1">
                                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {employee.Department || 'Not Assigned'}
                                            </span>
                                        </dd>
                                    </div>
                                    
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Date Hired</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(employee.DateHired).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </dd>
                                    </div>
                                    
                                    
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => router.back()}
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                                ← Back to Employee List
                            </button>
                            
                            <div className="flex space-x-3">
                                
                                <Link
                                    href="/employees/add"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Add Another Employee
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}