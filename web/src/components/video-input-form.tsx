import { FileVideo, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function VideoInputForm() {
  return (
    <form className='space-y-5'>
      <label
        htmlFor='video'
        className='border flex rounded-md aspect-video cursor-pointer text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10'
      >
        <FileVideo className='w-6 h-6' />
        Selecione um vídeo
      </label>
      <input type='file' id='video' accept='video/mp4' className='sr-only' />

      <Separator />

      <div className='space-y-1'>
        <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
        <Textarea
          id='transcription_prompt'
          className='h-20 leading-relaxed resize-none'
          placeholder='Inclua palavaras-chave mencionadas no vídeo separadas por vírgula ( , )'
        ></Textarea>
      </div>

      <Button type='submit' className='w-full'>
        Carregar vídeo
        <Upload className='w-4 h-4 ml-2' />
      </Button>
    </form>
  );
}
