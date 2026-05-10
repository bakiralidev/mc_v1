const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Guest login
// @route   POST /api/auth/guest
const guestLogin = async (req, res) => {
    try {
        const guestId = Math.floor(1000 + Math.random() * 9000);
        const username = `Guest_${guestId}`;

        const user = await prisma.user.create({
            data: {
                username,
                is_guest: true,
                stats: {
                    create: {} // Default player stats
                }
            }
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            is_guest: user.is_guest,
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Guest login failed', error: error.message });
    }
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password_hash,
                stats: {
                    create: {}
                }
            }
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (user && !user.is_guest && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                is_guest: true,
                avatar_url: true,
                created_at: true,
                updated_at: true,
                stats: {
                    select: {
                        level: true,
                        xp: true,
                        total_matches: true,
                        wins: true,
                        losses: true,
                        kills: true,
                        deaths: true,
                        assists: true,
                        damage_dealt: true,
                        healing_done: true
                    }
                }
            }
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

module.exports = {
    guestLogin,
    register,
    login,
    getMe
};
