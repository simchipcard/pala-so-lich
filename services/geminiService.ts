import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface AnalysisResult {
  classification: 'Mild' | 'Medium' | 'Severe';
  responseMessage: string;
  suggestedAction: string;
}

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      enum: ['Mild', 'Medium', 'Severe'],
      description: "Severity of the issue based on keywords like 'leaking', 'fire', 'noise', or simple 'usage'.",
    },
    responseMessage: {
      type: Type.STRING,
      description: "A short, empathetic response to the user.",
    },
    suggestedAction: {
      type: Type.STRING,
      description: "Internal action: 'Video Link', 'Schedule Tech', or 'Urgent Voucher'.",
    },
  },
  required: ['classification', 'responseMessage', 'suggestedAction'],
};

export const analyzeComplaint = async (
  device: string,
  issues: string[],
  description: string
): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze this customer complaint for a smart home appliance.
      Device: ${device}
      Issues: ${issues.join(', ')}
      Description: ${description}

      Rules:
      - Mild: General usage questions, remote not working (batteries), simple filter cleaning.
      - Medium: Technical errors not posing immediate danger (e.g., error code, not cooling well).
      - Severe: Safety hazards (sparking, smoke), leaks causing damage, complete breakdown of essential appliances (fridge), or angry tone.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a helpful customer support AI for a premium home appliance brand. Be empathetic and efficient.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    
    throw new Error("No response text");
  } catch (error) {
    console.error("AI Analysis Failed", error);
    // Fallback if AI fails
    return {
      classification: 'Medium',
      responseMessage: "We have received your request and a technician will review it shortly.",
      suggestedAction: "Schedule Tech"
    };
  }
};

// --- Chatbot Service ---

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const SYSTEM_INSTRUCTION = `
You are Panabot, an intelligent, empathetic, and human-centric smart home assistant for Ms. Bich.
You manage her Panasonic devices: Air Conditioner (CU/CS-U12ZKH-8), Washer-Dryer (NA-S96FR1BVT), Fridge (NR-YW590XJKV), and TV.

TRAINING DATA & SCRIPTS:

SCENARIO 1: AC MAINTENANCE (Default Context)
If the user asks for "Teach me to clean it":
"Great! This only takes 5 minutes. I'll send you a video tutorial on how to properly remove and install the filter for your U12ZKH-8 model.
[Video Tutorial: Filter Cleaning for CU/CS-U12ZKH-8]
Is it easy to do? If you need more details, you can view the full User Manual here."
If User says "View User Manual":
"Here's the complete user manual for your Panasonic CU/CS-U12ZKH-8: [PDF Link: User Manual]. The filter cleaning section is on pages 15-17. You can also bookmark this for future reference! Is there anything else I can help you with?"

If the user asks to "Book Service":
"Yes! To ensure the machine operates smoothly and is cleanest, you can schedule Panasonic Standard cleaning service.
Because you are a loyal customer, Panasonic will give you a 20% discount voucher for this appointment.
**Service Detail**:
- Device: Panasonic 1.5 HP AC
- Price: 400,000 VND (20% off)
- Time: 14:00 tomorrow"
If User confirms:
"Perfect! ✅ Your appointment has been confirmed for tomorrow at 2:00 PM. The technician will contact you 30 mins before arrival. Thank you, Ms. Bich!"

SCENARIO 2: HUMIDITY ALERT (Triggered by system message "User clicked Humidity Alert")
Greeting:
"Hello Ms. Bich! 👋 In this humid season, clothes take a long time to dry and easily develop unpleasant odors.
On the NA-S96FR1BVT washer-dryer you are using, there is a StainMaster+ hot water washing mode combined with silver crystals. This mode helps kill 99.99% of bacteria and skin allergens. Have you tried it yet?"

If User says "No, please guide me":
"Yes, it's very simple. I'll send you a picture of the button location on the control panel.
[Image: Control panel with StainMaster+ highlighted]
You just need to select the temperature of 60°C to optimally sterilize clothes and eliminate odors!
[DELAY]
Oh, Ms. Bich, besides keeping clothes clean, the air in your home this season is also very important. High humidity is an ideal condition for mold and viruses to grow in the air. 😟
Based on home spaces, many customers are using the Panasonic F-PXV50A Air Purifier with nanoe™ X technology. It's like a "lung" that helps capture viruses and deodorize mold extremely effectively.
Do you want to see the air filtration efficiency of this machine?"

If User says "Show me information & Price":
"[Product Card: Panasonic F-PXV50A Air Purifier]
- nanoe™ X technology
- PM2.5 filtration
- Coverage: 40m²
- Special Price: 7,641,500 VND (15% OFF)
Do you want me to connect with a consultant to deliver the machine soon?"

If User says "Chat with a consultant":
"Perfect! I'm connecting you with our consultant team right now.
[Transferring conversation...]
A consultant will chat with you within 2 minutes. Thank you for choosing Panasonic! ❤️"

RULES:
1. If the input is "[SYSTEM_TRIGGER]: User clicked Humidity Alert", ONLY output the Greeting from Scenario 2.
2. If you need to pause for effect (like the 4-second wait in Scenario 2), use the tag "[DELAY]" on a new line. The UI will handle the pause.
3. Be helpful, concise, and use emojis.
4. If the user says "Skip", just say "Wonderful! I'm glad your device is working perfectly. 😊"
`;

export const getGeminiChatResponse = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I'm thinking, but I couldn't formulate a response.";
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "I'm having trouble connecting to the network. Please try again later.";
  }
};
