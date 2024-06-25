
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { aiBotsDB } = require('../DB/db.js');



// ### AGENT LOGIN API ####


const agent_login = (req, res) => {
    try {
        // Input validation using Joi
        const schema = Joi.object({
            user_name: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { user_name, password } = req.body;

        // Check if user exists and is an agent
        aiBotsDB.query('SELECT * FROM users WHERE user_name = ?', [user_name], async (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const user = results[0];

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare hashed passwords using bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (user.role !== 'agent') {
                return res.status(403).json({ error: 'Access forbidden' });
            }

            

            // Generate JWT token
            const token = jwt.sign(
                { user_id: user.id, user_name: user.user_name, role: user.role },
                process.env.JWT_SECRET_AGENT,
                { expiresIn: '2d' }
            );

            // Set the JWT token as a cookie
            res.cookie("agent_access_token", token, {
                maxAge: 2 * 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: true,
            }); // 2 days in milliseconds

            // Remove sensitive information from the response
            delete user.password;

            res.json({
                message: "Login successful",
                user,
                token
            });
        });
    } catch (error) {
        console.error('Error in agent_login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





// ### CUSTOMER LOGIN API ####


const customer_login = (req, res) => {
    try {
        // Input validation using Joi
        const schema = Joi.object({
            user_name: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { user_name, password } = req.body;

        // Check if user exists and is a customer
        aiBotsDB.query('SELECT * FROM users WHERE user_name = ?', [user_name], async (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const user = results[0];
            // console.log(user)

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare hashed passwords using bcrypt
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            if (user.role !== 'customer') {
                return res.status(403).json({ error: 'Access forbidden' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { user_id: user.id, user_name: user.user_name, role: user.role },
                process.env.JWT_SECRET_CUSTOMER,
                { expiresIn: '2d' }
            );

            // Set the JWT token as a cookie
            res.cookie("customer_access_token", token, {
                maxAge: 2 * 24 * 60 * 60 * 1000,
                secure: true,
                httpOnly: true,
            }); // 2 days in milliseconds

            // Remove sensitive information from the response
            delete user.password;

            res.json({
                message: "Login successful",
                user,
                token
            });
        });
    } catch (error) {
        console.error('Error in customer_login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


  
  

  


module.exports = {
    agent_login,
    customer_login
    
}
