// pages/index.js
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <div className="text-center">
                {/* Hero Section */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Employee Management Portal
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Streamline your HR processes with our comprehensive employee management system
                    </p>
                    
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/employees"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
                        >
                            View All Employees
                        </Link>
                        <Link
                            href="/employees/add"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
                        >
                            Add New Employee
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-blue-600 text-3xl mb-3">👥</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Employees</h3>
                        <p className="text-gray-600 text-sm">
                            Add, edit, and remove employee records with ease
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-blue-600 text-3xl mb-3">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search & Filter</h3>
                        <p className="text-gray-600 text-sm">
                            Quickly find employees by name, email, or department
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-blue-600 text-3xl mb-3">🏢</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Tracking</h3>
                        <p className="text-gray-600 text-sm">
                            Organize employees by departments and roles
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="text-blue-600 text-3xl mb-3">📊</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Details</h3>
                        <p className="text-gray-600 text-sm">
                            View comprehensive employee information and history
                        </p>
                    </div>
                </div>

               

                
            </div>
        </Layout>
    );
}