import { createClient } from '@/lib/db/supabase/client';
import { Banner } from '@/lib/banner/banner-model';

const supabase = createClient();

export async function getAllBanners(): Promise<Banner[] | null> {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Erro ao buscar banners:', error.message);
        return null;
    }
    return data as Banner[];
}

export async function createBanner(bannerData: Omit<Banner, 'id' | 'created_at'>): Promise<{ success: boolean; error: string | null }> {
    const { error } = await supabase
        .from('banners')
        .insert([bannerData]);

    if (error) {
        console.error('Erro ao criar banner:', error.message);
        return { success: false, error: error.message };
    }
    return { success: true, error: null };
}

export async function deleteBanner(id: number): Promise<{ success: boolean; error: string | null }> {
    const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao deletar banner:', error.message);
        return { success: false, error: error.message };
    }
    return { success: true, error: null };
}

export async function getActiveBanner(requestUrl: string): Promise<Banner | null> {
    const { data: banners, error } = await supabase
        .from('banners')
        .select('*')
        .eq('target_url', requestUrl);

    if (error) {
        console.error('Erro na busca da API:', error.message);
        return null;
    }

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo'
    };
    const currentTime = now.toLocaleString('pt-BR', options);
    const [currentH, currentM, currentS] = currentTime.split(':').map(Number);
    const currentTotal = currentH * 60 * 60 + currentM * 60 + currentS;

    const activeBanner = banners?.find((banner) => {
        if (!banner.start_time || !banner.end_time) return false;

        const [startH, startM, startS] = banner.start_time.split(':').map(Number);
        const [endH, endM, endS] = banner.end_time.split(':').map(Number);

        const startTotal = startH * 60 * 60 + startM * 60 + startS;
        const endTotal = endH * 60 * 60 + endM * 60 + endS;

        return currentTotal >= startTotal && currentTotal <= endTotal;
    });
    if (activeBanner) {
        return activeBanner;
    }
    return banners?.find((banner) => {
        if (!banner.start_time || !banner.end_time) return true;
    })
}

export async function uploadImage(filePath: string, file: File) {
    const { error: uploadError } = await supabase.storage
        .from('banner_images') // Nome do bucket criado
        .upload(filePath, file, {
            cacheControl: '3600', // Cache de 1 hora
            upsert: false,
        });

    if (uploadError) {
        console.error('Erro no Upload:', uploadError);
        alert('Erro ao subir a imagem. Verifique as permissões do bucket.');
        return null;
    }
}

export async function getPublicURL(filePath: string): Promise<string | null> {
    const { data: { publicUrl } } = supabase.storage
        .from('banner_images')
        .getPublicUrl(filePath)

    return publicUrl;
}
