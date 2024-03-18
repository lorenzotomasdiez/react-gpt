export async function audioToTextUseCase(prompt: string, audioFile: File) {
  try {
    const formData = new FormData();
    formData.append("file", audioFile);
    if (prompt) formData.append("prompt", prompt);

    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/audio-to-text`, {
      method: 'POST',
      body: formData
    });

    if (!resp.ok) throw new Error("No se pudo realizar la peticion.")

    const data = await resp.json() as any;

    return {
      ok: true,
      ...data
    }

  } catch (error) {
    return {
      ok: false,
      message: "No se pudo realizar la peticion."
    }
  }
}