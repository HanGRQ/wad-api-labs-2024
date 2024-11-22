import express from 'express';
import User from './userModel';

const router = express.Router(); // eslint-disable-line

// 密码验证正则表达式 Password validation regular expression
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// Register(Create)/Authenticate User
router.post('/', async (req, res) => {
    if (req.query.action === 'register') {
        try {
            // 检查是否提供了必需字段
            // Check if required fields are provided
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Missing required fields: username or password',
                });
            }
            
            // 检查用户名是否已经存在
            // Check if username already exists
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return res.status(409).json({
                    code: 409,
                    msg: 'Username already exists',
                });
            }

            // 验证密码 
            // verify passwword
            if (!passwordRegex.test(req.body.password)) {
                return res.status(400).json({
                    code: 400,
                    msg: 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character',
                });
            }

            // 创建并保存用户
            // Create and save user
            await User(req.body).save();
            res.status(201).json({
                code: 201,
                msg: 'Successfully created new user',
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                msg: 'Internal server error',
                error: error.message,
            });
        }
    } else {
        try {
            // Authenticate user
            const user = await User.findOne(req.body);
            if (!user) {
                return res.status(401).json({ code: 401, msg: 'Authentication failed' });
            } else {
                return res.status(200).json({ 
                    code: 200, 
                    msg: 'Authentication successful', 
                    token: 'TEMPORARY_TOKEN' 
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                msg: 'Internal server error',
                error: error.message,
            });
        }
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        if (req.body._id) delete req.body._id;
        const result = await User.updateOne(
            { _id: req.params.id },
            req.body
        );
        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'User updated successfully' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to update user' });
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            msg: 'Internal server error',
            error: error.message,
        });
    }
});

export default router;