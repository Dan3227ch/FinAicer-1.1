import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { Bot, Send, Sparkles, User, BarChart, TrendingUp } from '../components/Icons';
import { ChatMessage, AIReport, AIPrediction } from '../types';
import { initialChatMessages } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { sendMessageToAI, analyzeFinances, predictExpenses } from '../services/finaicerApiService';
import Card from '../components/Card';

const AIPredictionCard: React.FC<{ prediction: AIPrediction }> = ({ prediction }) => {
    // Component to render the AI Prediction
    return (
        <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">Predicción de Gastos para {prediction.nextMonth}</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">{prediction.summary}</p>
            <div className="space-y-2">
                {Object.entries(prediction.predictedExpenses).map(([category, amount]) => (
                    <div key={category} className="flex justify-between text-sm p-2 bg-white rounded">
                        <span>{category}</span>
                        <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const AIReportCard: React.FC<{ report: AIReport }> = ({ report }) => {
    // Component to render the AI Financial Report
    return (
        <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
                <BarChart className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold">Análisis Financiero - {report.month}</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">{report.summary}</p>
            
            <h5 className="font-medium text-sm mt-4 mb-2">Recomendaciones</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                {report.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
            </ul>

            <h5 className="font-medium text-sm mt-4 mb-2">Riesgos Detectados</h5>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                {report.risks.map((risk, index) => <li key={index}>{risk}</li>)}
            </ul>
        </Card>
    );
};


const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const bubbleClasses = isUser
        ? 'bg-blue-600 text-white self-end'
        : 'bg-slate-100 text-slate-800 self-start';
    
    const content = message.report ? <AIReportCard report={message.report} /> :
                    message.prediction ? <AIPredictionCard prediction={message.prediction} /> :
                    message.text;

    if (message.report || message.prediction) {
        return (
             <div className="flex items-start gap-2.5 w-full">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 flex-shrink-0">
                    <Bot className="h-5 w-5 text-slate-600" />
                </div>
                <div className="w-full max-w-lg">
                    {content}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-start gap-2.5 ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${isUser ? 'bg-slate-300' : 'bg-slate-200'} flex-shrink-0`}>
                {isUser ? <User className="h-5 w-5 text-slate-700" /> : <Bot className="h-5 w-5 text-slate-600" />}
            </div>
            <div className={`p-3 rounded-lg max-w-lg ${bubbleClasses}`}>
                {content}
            </div>
        </div>
    );
};

const AIAssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const addMessage = (sender: 'user' | 'ai', content: { text?: string | ReactElement; report?: AIReport; prediction?: AIPrediction }) => {
        setMessages(prev => [...prev, { id: Date.now(), sender, ...content }]);
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage || isLoading) return;

        addMessage('user', { text: userMessage });
        setInputValue('');
        setIsLoading(true);

        try {
            if (token) {
                const aiResponse = await sendMessageToAI(userMessage, token);
                addMessage('ai', { text: aiResponse });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('ai', { text: 'Lo siento, he encontrado un problema. Por favor, intenta de nuevo.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = async (action: 'analyze' | 'predict') => {
        if (isLoading || !token) return;

        const actionText = action === 'analyze' ? 'Analizar mis finanzas del último mes' : 'Predecir mis gastos para el próximo mes';
        addMessage('user', { text: actionText });
        setIsLoading(true);
        
        try {
            if (action === 'analyze') {
                const report = await analyzeFinances(token);
                addMessage('ai', { report });
            } else {
                const prediction = await predictExpenses(token);
                addMessage('ai', { prediction });
            }
        } catch (error: any) {
            console.error(`Error with ${action}:`, error);
            addMessage('ai', { text: `Lo siento, no pude ${action === 'analyze' ? 'analizar tus finanzas' : 'predecir tus gastos'}. ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-9rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex items-start gap-2.5 self-start">
                         <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 flex-shrink-0">
                             <Bot className="h-5 w-5 text-slate-600" />
                         </div>
                         <div className="p-3 rounded-lg bg-slate-100 text-slate-800">
                            <span className="animate-pulse">Escribiendo...</span>
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => handleQuickAction('analyze')} disabled={isLoading} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 h-8 px-2 rounded-md disabled:opacity-50">
                        <BarChart className="h-3 w-3" /> Analizar Finanzas
                    </button>
                    <button onClick={() => handleQuickAction('predict')} disabled={isLoading} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 h-8 px-2 rounded-md disabled:opacity-50">
                        <TrendingUp className="h-3 w-3" /> Predecir Gastos
                    </button>
                    <button onClick={() => {}} disabled={isLoading} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 h-8 px-2 rounded-md disabled:opacity-50">
                        <Sparkles className="h-3 w-3" /> Consejos Rápidos
                    </button>
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pregúntame cualquier cosa..."
                        className="flex-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-10 w-10 disabled:bg-slate-300">
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAssistantPage;