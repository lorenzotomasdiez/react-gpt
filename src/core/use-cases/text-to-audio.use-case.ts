export async function textToAudioUseCase(prompt: string, voice: string) {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) throw new Error("No se pudo realizar la peticion.")

    const data = await resp.blob();

    const audioUrl = URL.createObjectURL(data);

    return {
      ok: true,
      message: prompt,
      audioUrl
    }

  } catch (error) {
    return {
      ok: false,
      message: "No se pudo realizar la peticion."
    }
  }
}