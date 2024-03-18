type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export async function imageGenerationUseCase(prompt: string, originalImage?: string, maskImage?: string): Promise<GeneratedImage> {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/image-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, originalImage, maskImage })
    });

    const data = await resp.json() as any;

    return {
      url: data.url,
      alt: data.alt
    }


  } catch (error) {
    console.error(error);
    return null;
  }
}