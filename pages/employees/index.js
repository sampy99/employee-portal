// pages/employees/index.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useSweetAlert } from '../../hooks/useSweetAlert'


export default function EmployeeList() {
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [departments, setDepartments] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const { confirmDelete, showSuccess, showError } = useSweetAlert();


    // Debounced fetch function
    const fetchEmployees = useCallback(async (searchTerm = search, department = departmentFilter) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (department !== 'all') params.append('department', department);

            const response = await fetch(`/api/employees?${params}`);
            const data = await response.json();

            if (response.ok) {
                setEmployees(data.employees);
                
                // Extract unique departments for filter
                const uniqueDepts = [...new Set(data.employees
                    .map(emp => emp.Department)
                    .filter(dept => dept)
                )];
                setDepartments(uniqueDepts);
            } else {
                setError(data.error || 'Failed to fetch employees');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }, [search, departmentFilter]);

    // Debounced search handler
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // Set new timeout for debouncing
        const timeout = setTimeout(() => {
            fetchEmployees(value, departmentFilter);
        }, 500); // 500ms delay
        
        setSearchTimeout(timeout);
    };

    // Department filter handler (immediate)
    const handleDepartmentFilter = (e) => {
        const value = e.target.value;
        setDepartmentFilter(value);
        fetchEmployees(search, value);
    };

    // Initial load and clean up
    useEffect(() => {
        fetchEmployees();
        
        // Clean up timeout on component unmount
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, []);

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
  

    if (loading && employees.length === 0) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
                    <Link 
                        href="/employees/add"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                        Add New Employee
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                Search Employees
                            </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                           
                        </div>
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Department
                            </label>
                            <select
                                id="department"
                                value={departmentFilter}
                                onChange={handleDepartmentFilter}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Loading indicator for search results */}
                {loading && employees.length > 0 && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Employee Table */}
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {employees.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No employees found.</p>
                            <Link 
                                href="/employees/add"
                                className="text-blue-600 hover:text-blue-500 mt-2 inline-block"
                            >
                                Add the first employee
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date Hired
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees.map((employee) => (
                                        <tr key={employee.EmployeeID} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {employee.FirstName} {employee.LastName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{employee.Email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {employee.Department || 'Not Assigned'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {employee.DateHired}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link 
                                                        href={`/employees/view/${employee.EmployeeID}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link 
                                                        href={`/employees/edit/${employee.EmployeeID}`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(employee.EmployeeID, `${employee.FirstName} ${employee.LastName}`)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary */}
                {employees.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">
                            Showing {employees.length} employee{employees.length !== 1 ? 's' : ''}
                            {search && ` matching "${search}"`}
                            {departmentFilter !== 'all' && ` in ${departmentFilter}`}
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}