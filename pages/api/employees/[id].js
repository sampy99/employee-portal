import { getConnection, sql } from '../../../lib/database';

// Simple API key middleware (optional)
const validateApiKey = (req) => {
    const apiKey = process.env.API_KEY;
    if (apiKey && req.headers['x-api-key'] !== apiKey) {
        return false;
    }
    return true;
};

export default async function handler(req, res) {
    const { id } = req.query;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    // Optional API key validation
    if (!validateApiKey(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const pool = await getConnection();
        const employeeId = parseInt(id);

        if (req.method === 'GET') {
            // GET /api/employees/[id] - Fetch single employee
            const request = pool.request();
            request.input('id', sql.Int, employeeId);

            const result = await request.query(`
                SELECT EmployeeID, FirstName, LastName, Email, Department,
                       FORMAT(DateHired, 'yyyy-MM-dd HH:mm:ss') as DateHired
                FROM Employees 
                WHERE EmployeeID = @id
            `);

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.status(200).json({ employee: result.recordset[0] });

        } else if (req.method === 'PUT') {
            // PUT /api/employees/[id] - Update employee
            const { firstName, lastName, email, department } = req.body;

            // Validation
            if (!firstName || !lastName || !email) {
                return res.status(400).json({ 
                    error: 'First name, last name, and email are required' 
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if employee exists
            const checkRequest = pool.request();
            checkRequest.input('id', sql.Int, employeeId);
            const existingEmployee = await checkRequest.query(`
                SELECT EmployeeID FROM Employees WHERE EmployeeID = @id
            `);

            if (existingEmployee.recordset.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            const request = pool.request();
            request.input('id', sql.Int, employeeId);
            request.input('firstName', sql.NVarChar, firstName);
            request.input('lastName', sql.NVarChar, lastName);
            request.input('email', sql.NVarChar, email);
            request.input('department', sql.NVarChar, department || null);

            try {
                const result = await request.query(`
                    UPDATE Employees 
                    SET FirstName = @firstName, 
                        LastName = @lastName, 
                        Email = @email, 
                        Department = @department
                    OUTPUT INSERTED.*
                    WHERE EmployeeID = @id
                `);

                res.status(200).json({ 
                    message: 'Employee updated successfully',
                    employee: result.recordset[0]
                });
            } catch (dbError) {
                if (dbError.number === 2627) { // Unique constraint violation
                    res.status(409).json({ error: 'Email already exists' });
                } else {
                    throw dbError;
                }
            }

        } else if (req.method === 'DELETE') {
            // DELETE /api/employees/[id] - Delete employee
            const request = pool.request();
            request.input('id', sql.Int, employeeId);

            const result = await request.query(`
                DELETE FROM Employees 
                OUTPUT DELETED.*
                WHERE EmployeeID = @id
            `);

            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            res.status(200).json({ 
                message: 'Employee deleted successfully',
                employee: result.recordset[0]
            });

        } else {
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ error: 'Method not allowed' });
        }

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
