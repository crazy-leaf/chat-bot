const LANGFLOW_API_URL = process.env.NEXT_PUBLIC_OPEN_AI_KEY;

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(LANGFLOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_value: message,
        output_type: "chat",
        input_type: "chat",
        tweaks: {}
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    let botResponse = "I'm sorry, I couldn't process your request at the moment.";
    
    if (data && data.outputs && data.outputs[0] && data.outputs[0].outputs && data.outputs[0].outputs[0]) {
      const output = data.outputs[0].outputs[0];
      if (output.results && output.results.message && output.results.message.text) {
        botResponse = output.results.message.text;
      }
    }

    return {
      success: true,
      message: botResponse
    };
  } catch (error) {
    console.error('Error calling Langflow API:', error);
    
    return {
      success: false,
      message: "I'm currently having trouble connecting to the AI service. Please make sure your Langflow instance is running at http://localhost:7860. For now, here's a demo response: Thank you for your message! This is a sample response from the AI assistant.",
      error: error.message
    };
  }
};
