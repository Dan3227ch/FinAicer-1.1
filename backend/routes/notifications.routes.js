const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Notification = require('../models/notification.model');
const NotificationLog = require('../models/notificationLog.model');

// @route   POST /api/notifications/preferences
// @desc    Update user notification preferences
// @access  Private
router.post('/preferences', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

        // Merge new preferences with existing ones
        const newPreferences = {
            ...user.notificationPreferences,
            ...req.body
        };
        
        user.notificationPreferences = newPreferences;
        
        await user.save();
        res.json(user.notificationPreferences);
    } catch (err) {
        console.error("Error updating preferences: ", err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/notifications/test-push
// @desc    Send a test push notification
// @access  Private
router.post('/test-push', async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || !user.notificationPreferences.pushEnabled) {
            return res.status(400).json({ msg: 'Las notificaciones push no están habilitadas para este usuario.' });
        }
        if (!user.notificationPreferences.pushToken) {
            return res.status(400).json({ msg: 'El usuario no tiene un token de notificación push registrado.' });
        }


        // 1. Create the notification record
        const notification = new Notification({
            userId,
            type: 'push',
            title: 'Prueba de Notificación ✨',
            body: 'Si recibes esto, ¡las notificaciones push están funcionando!',
            status: 'sending'
        });
        await notification.save();

        // 2. Mock sending the notification
        // In a real app, you would call a service here: 
        // const { success, response } = await pushService.send(user.pushToken, ...);
        console.log(`Simulando envío de notificación push a token: ${user.notificationPreferences.pushToken}`);
        const isSentSuccessfully = true; 
        
        // 3. Log the attempt
        const log = new NotificationLog({
            notificationId: notification._id,
            userId,
            channel: 'push',
            success: isSentSuccessfully,
            providerResponse: { mock: true, messageId: `mock_${Date.now()}` },
            error: isSentSuccessfully ? null : 'Fallo al enviar notificación simulada'
        });
        await log.save();
        
        // 4. Update notification status
        notification.status = isSentSuccessfully ? 'sent' : 'failed';
        notification.sentAt = new Date();
        await notification.save();

        res.json({ msg: 'Notificación de prueba procesada exitosamente.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});


module.exports = router;