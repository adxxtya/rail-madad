// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';

let conversationHistory: string = ""; // Initialize conversation history

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        const apiKey = process.env.GEMINI_PUBLIC_API_KEY; // Accessing the API key

        if (!apiKey) {
            console.error('API key not found in environment variables.');
            return NextResponse.json({ error: 'API key not found.' }, { status: 500 });
        }

        // Create the full prompt for the API
        const chatbotPromptHelper = "You are a helpful chatbot. Respond to the user's query in a conversational and helpful manner:\n\n";
        const fullPrompt = `${chatbotPromptHelper}${conversationHistory}\nUser: ${message}\nChatbot:`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: fullPrompt
                            }
                        ]
                    }
                ]
            })
        });

        // Check for response status
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response from Gemini API:', errorText);
            return NextResponse.json({ error: 'Failed to communicate with Gemini API.' }, { status: 500 });
        }

        const data = await response.json();

        // Extracting generated text and token information
        const generatedText = data.candidates[0]?.content?.parts[0]?.text;
        
        if (!generatedText) {
            console.error('Generated text not found in response:', data);
            return NextResponse.json({ error: 'No generated text found.' }, { status: 500 });
        }

        // Append the conversation to history
        conversationHistory += `User: ${message}\nChatbot: ${generatedText}\n`;

        // Return the chatbot response
        return NextResponse.json({
            generated_text: generatedText,
            conversation_history: conversationHistory // Optional, if you want to send back history
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}