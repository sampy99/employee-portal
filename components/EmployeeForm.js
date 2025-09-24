import { useState } from 'react';

export default function EmployeeForm({ 
    initialData = {}, 
    onSubmit, 
    isLoading = false, 
    submitText = "Save" 
}) {
    const [formData, setFormData] = useState({
        firstName: initialData.FirstName || '',
        lastName: initialData.LastName || '',
        email: initialData.Email || '',
        department: initialData.Department || ''
    });

    const [errors, setErrors] = useState({});

    const departments = [
        '', 'IT', 'HR', 'Finance', 'Marketing', 'Operations', 
        'Sales', 'Design', 'Engineering', 'Customer Service'
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                />
                {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
            </div>

            {/* Last Name */}
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                />
                {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
            </div>

            {/* Department */}
            <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                </label>
                <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                >
                    <option value="">Select Department</option>
                    {departments.slice(1).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Saving...' : submitText}
                </button>
            </div>
        </form>
    );
}
