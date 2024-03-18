type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export async function imageVariationUseCase(originalImage: string): Promise<GeneratedImage> {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/image-variation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ baseImage: originalImage })
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