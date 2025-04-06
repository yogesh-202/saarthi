export async function queryOllama(prompt: string) {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral', // or llama2, etc.
        prompt,
        stream: false,
      }),
    });
  
    const data = await res.json();
    return data.response;
  }
  