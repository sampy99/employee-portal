import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const router = useRouter();

    const isActive = (path) => {
        return router.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <nav className="bg-blue-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <span className="text-white text-xl font-bold">
                                    Employee Portal
                                </span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/employees"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/employees') 
                                        ? 'bg-blue-700 text-white' 
                                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                                }`}
                            >
                                All Employees
                            </Link>
                            <Link 
                                href="/employees/add"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/employees/add') 
                                        ? 'bg-blue-700 text-white' 
                                        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                                }`}
                            >
                                Add Employee
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content - This will grow to push footer down */}
            <main className="flex-grow max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {children}
                </div>
            </main>

            {/* Footer - This will stay at the bottom */}
            <footer className="bg-blue-600 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2025 Employee Management Portal</p>
                </div>
            </footer>
        </div>
    );
}
