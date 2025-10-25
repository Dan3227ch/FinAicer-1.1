const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const authMiddleware = require('../middleware/auth.middleware');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Make sure to set GOOGLE_APPLICATION_CREDENTIALS in your environment
if (!admin.apps.length) {
    admin.initializeApp();
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('email', 'Por favor, incluye un email válido').isEmail(),
    body('password', 'La contraseña debe tener 6 o más caracteres').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
    body('email', 'Por favor, incluye un email válido').isEmail(),
    body('password', 'La contraseña es requerida').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user || !user.password) { // Check for password existence
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/auth/google
// @desc    Authenticate user via Google Firebase token & get our own token
// @access  Public
router.post('/google', async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name } = decodedToken;

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                name,
                email,
                firebaseUid: uid
            });
            await user.save();
        }

        // Generate our own JWT for the session
        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, appToken) => {
            if (err) throw err;
            res.json({ token: appToken });
        });

    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ msg: 'Invalid Google token' });
    }
});


// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
