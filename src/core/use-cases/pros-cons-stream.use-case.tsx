export const prosConsStreamUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      //TODO ABORT SIGNAL
    });

    if (!resp.ok) throw new Error("no se pudo realizar la peticion.")

    const reader = resp.body?.getReader();

    if (!reader) {
      console.error("No se pudo obtener el reader");
      return null;
    }

    return reader;
  } catch (error) {
    return null
  }
}