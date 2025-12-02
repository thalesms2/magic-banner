'use client';
import { useState } from 'react';
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';

import { createBanner, getPublicURL, uploadImage } from '@/lib/banner/banner-service';

export default function AddBanner() {
    const [form, setForm] = useState({ target_url: '', start_time: '', end_time: '' });
    const router = useRouter();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false); // Para UX

    async function handleImageUpload(): Promise<string | null> {
        if (!selectedFile) return null;

        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        uploadImage(filePath, selectedFile);

        return getPublicURL(filePath);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!selectedFile || !form.target_url) {
            alert('Por favor, preencha a URL Alvo e selecione a Imagem do Banner.');
            return;
        }

        setIsUploading(true);

        const imageUrl = await handleImageUpload();

        if (!imageUrl) {
            setIsUploading(false);
            return;
        }
        const bannerData = {
            target_url: form.target_url,
            image_url: imageUrl,
            start_time: form.start_time || null,
            end_time: form.end_time || null,
        }

        const { error } = await createBanner(bannerData);

        setIsUploading(false);

        if (!error) {
            setForm({ target_url: '', start_time: '', end_time: '' });
            setSelectedFile(null);
            router.refresh();
        } else {
            alert('Erro ao salvar o registro do banner no DB.');
        }
    }
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Magic Banner</CardTitle>
                <CardDescription>
                    Adicione um banner
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <Input
                        placeholder="URL Alvo (ex: https://loja.com)"
                        className="border p-2 w-full"
                        value={form.target_url}
                        onChange={e => setForm({ ...form, target_url: e.target.value })}
                        required
                    />
                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="picture">Upload da Imagem do Banner</Label>
                        <Input id="picture" type="file"
                            onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                            required={!selectedFile} // Requer um arquivo na criação
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="w-1/2">
                            <Label htmlFor="time-picker" className="px-1">
                                Início (Opcional)
                            </Label>
                            <Input
                                type="time"
                                id="time-picker"
                                step="1"
                                value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="time-picker" className="px-1">
                                Fim (Opcional)
                            </Label>
                            <Input
                                type="time"
                                id="time-picker"
                                step="1"
                                value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </div>
                    </div>
                    <Button type="submit"
                        disabled={isUploading}
                        className={`w-full text-white rounded ${isUploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isUploading ? 'Fazendo Upload...' : 'Criar Banner'}
                    </Button>
                </form >
            </CardContent>
        </Card>
    )
}
