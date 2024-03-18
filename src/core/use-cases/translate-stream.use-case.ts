export async function* translateStreamUseCase(prompt: string, lang: string, abort: AbortSignal) {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, lang }),
      signal: abort
    });

    if (!resp.ok) throw new Error("no se pudo realizar la peticion.")

    const reader = resp.body?.getReader();

    if (!reader) {
      console.error("No se pudo obtener el reader");
      return null;
    }

    const decoder = new TextDecoder('utf-8');

    let message = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      message += decoder.decode(value, { stream: true });
      yield message;
    }

  } catch (error) {
    return null
  }
}