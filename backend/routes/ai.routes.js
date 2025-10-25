const express = require('express');
const router = express.Router();
const { GoogleGenAI, Type } = require('@google/genai');

const Transaction = require('../models/transaction.model');
const AIChat = require('../models/aiChat.model');
const AIReport = require('../models/aiReport.model');

const API_KEY = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Middleware to check for API Key
router.use((req, res, next) => {
    if (!API_KEY) {
        return res.status(500).json({ message: 'Google AI API key is not configured.' });
    }
    next();
});

// Helper function to get a month's name
const getMonthName = (date) => {
    return date.toLocaleString('es-ES', { month: 'long' });
}

// @route   POST /api/ai/analyze
// @desc    Analyze user's financial data for the last month
// @access  Private
router.post('/analyze', async (req, res) => {
    try {
        const userId = req.user.id;

        // Date calculations for current and previous month
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        // Fetch transactions for both periods
        const currentMonthTransactions = await Transaction.find({
            userId,
            date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth }
        }).select('type amount category date -_id');

        const lastMonthTransactions = await Transaction.find({
            userId,
            date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }).select('type amount category date -_id');

        if (currentMonthTransactions.filter(t => t.type === 'gasto').length === 0) {
            return res.status(400).json({ message: 'No hay datos de gastos en el mes actual para analizar.' });
        }
        
        const currentMonthName = getMonthName(startOfCurrentMonth);
        const lastMonthName = getMonthName(startOfLastMonth);

        const reportSchema = {
            type: Type.OBJECT,
            properties: {
                month: { type: Type.STRING },
                totalExpenses: { type: Type.NUMBER },
                recommendedSavings: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                spendingTrends: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Insights comparing current month's spending to last month's." },
                categorySpending: {
                    type: Type.OBJECT,
                    properties: {
                        Restaurantes: { type: Type.NUMBER },
                        Comestibles: { type: Type.NUMBER },
                        Transporte: { type: Type.NUMBER },
                        Entretenimiento: { type: Type.NUMBER },
                        Otros: { type: Type.NUMBER }
                    }
                }
            },
            required: ['month', 'totalExpenses', 'summary', 'recommendations', 'risks', 'categorySpending', 'spendingTrends']
        };

        const prompt = `Analiza las finanzas de un usuario para ${currentMonthName} comparándolas con ${lastMonthName}.
        
        Datos del mes actual (${currentMonthName}): ${JSON.stringify(currentMonthTransactions)}
        Datos del mes anterior (${lastMonthName}): ${JSON.stringify(lastMonthTransactions)}

        Tu tarea es:
        1.  Generar un resumen del análisis financiero del mes actual.
        2.  Calcular los gastos totales y por categoría para el mes actual.
        3.  Proporcionar 3 recomendaciones de ahorro concisas.
        4.  Identificar 2 riesgos financieros clave.
        5.  **Muy importante**: En el campo 'spendingTrends', escribe 3 puntos clave comparando los gastos de este mes con el anterior. Identifica las mayores desviaciones o tendencias (ej. "Aumento del 20% en restaurantes", "Disminución en gastos de transporte").
        
        Responde en español y sigue estrictamente el esquema JSON proporcionado.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: reportSchema,
            },
        });
        
        const reportData = JSON.parse(response.text);
        
        const newReport = new AIReport({
            userId,
            ...reportData
        });
        await newReport.save();

        res.json(reportData);

    } catch (error) {
        console.error('Error in /api/ai/analyze:', error);
        res.status(500).json({ message: 'Error al generar el análisis financiero.' });
    }
});

// @route   POST /api/ai/predict
// @desc    Predict user's expenses for the next month
// @access  Private
router.post('/predict', async (req, res) => {
    try {
        const userId = req.user.id;

        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        // Fetch real transactions from the last 3 months for a better prediction base
        const transactions = await Transaction.find({
             userId, 
             date: { $gte: threeMonthsAgo } 
        }).select('type amount category date -_id');
        
        if (transactions.filter(t => t.type === 'gasto').length < 3) {
            return res.status(400).json({ message: 'No hay suficientes datos históricos para generar una predicción.' });
        }
        
        const nextMonthDate = new Date();
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const nextMonth = getMonthName(nextMonthDate);

        const predictionSchema = {
            type: Type.OBJECT,
            properties: {
                nextMonth: { type: Type.STRING },
                summary: { type: Type.STRING },
                predictedExpenses: {
                    type: Type.OBJECT,
                    properties: {
                        Restaurantes: { type: Type.NUMBER },
                        Comestibles: { type: Type.NUMBER },
                        Transporte: { type: Type.NUMBER },
                        Entretenimiento: { type: Type.NUMBER },
                        Otros: { type: Type.NUMBER }
                    }
                }
            }
        };

        const prompt = `Basado en el historial de transacciones de los últimos meses, predice los gastos del usuario para el próximo mes (${nextMonth}) por categoría. Proporciona un breve resumen de la predicción. Responde en español.
        
        Historial: ${JSON.stringify(transactions)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: predictionSchema,
            },
        });
        
        res.json(JSON.parse(response.text));

    } catch (error) {
        console.error('Error in /api/ai/predict:', error);
        res.status(500).json({ message: 'Error al generar la predicción de gastos.' });
    }
});

// @route   POST /api/ai/chat
// @desc    Chat with the AI assistant
// @access  Private
router.post('/chat', async (req, res) => {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
        return res.status(400).json({ message: 'El mensaje es requerido.' });
    }

    try {
        // Fetch last 5 interactions for context
        const history = await AIChat.find({ userId }).sort({ date: -1 }).limit(5);
        const formattedHistory = history.map(h => `Usuario: ${h.prompt}\nIA: ${h.response}`).join('\n\n');

        const prompt = `Eres "FinAIcer", un asistente financiero amigable y experto en español. Tu objetivo es ayudar a los usuarios a administrar su dinero, ahorrar y tomar decisiones financieras inteligentes. Proporciona consejos claros, prácticos y alentadores. Usa viñetas para las listas si es necesario.
        
        Historial de la conversación:
        ${formattedHistory}

        Nuevo mensaje del usuario: "${message}"
        
        Tu respuesta:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const aiResponse = response.text;

        const newChat = new AIChat({
            userId,
            prompt: message,
            response: aiResponse
        });
        await newChat.save();

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error in /api/ai/chat:', error);
        res.status(500).json({ message: 'Error al comunicarse con el asistente de IA.' });
    }
});


module.exports = router;