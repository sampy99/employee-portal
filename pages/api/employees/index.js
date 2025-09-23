// pages/api/employees/index.js
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
    // Optional API key validation
    if (!validateApiKey(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const pool = await getConnection();

        if (req.method === 'GET') {
            // GET /api/employees - Fetch all employees
            const { search, department } = req.query;
            
            let query = `
                SELECT EmployeeID, FirstName, LastName, Email, Department, 
                       FORMAT(DateHired, 'yyyy-MM-dd') as DateHired
                FROM Employees
                WHERE 1=1
            `;
            const request = pool.request();

            // Add search filter
            if (search) {
                query += ` AND (FirstName LIKE @search OR LastName LIKE @search OR Email LIKE @search)`;
                request.input('search', sql.NVarChar, `%${search}%`);
            }

            // Add department filter
            if (department && department !== 'all') {
                query += ` AND Department = @department`;
                request.input('department', sql.NVarChar, department);
            }

            query += ` ORDER BY DateHired DESC`;

            const result = await request.query(query);
            res.status(200).json({ employees: result.recordset });

        } else if (req.method === 'POST') {
            // POST /api/employees - Add new employee
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

            const request = pool.request();
            request.input('firstName', sql.NVarChar, firstName);
            request.input('lastName', sql.NVarChar, lastName);
            request.input('email', sql.NVarChar, email);
            request.input('department', sql.NVarChar, department || null);

            try {
                const result = await request.query(`
                    INSERT INTO Employees (FirstName, LastName, Email, Department)
                    OUTPUT INSERTED.*
                    VALUES (@firstName, @lastName, @email, @department)
                `);

                res.status(201).json({ 
                    message: 'Employee created successfully',
                    employee: result.recordset[0]
                });
            } catch (dbError) {
                if (dbError.number === 2627) { // Unique constraint violation
                    res.status(409).json({ error: 'Email already exists' });
                } else {
                    throw dbError;
                }
            }

        } else {
            res.setHeader('Allow', ['GET', 'POST']);
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