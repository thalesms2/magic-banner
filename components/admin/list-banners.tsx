'use client';
import { deleteBanner } from '@/domain/banner/banner-service';
import { Button } from "@/components/ui/button";
import { Banner } from '@/domain/banner/banner-model';
import { useRouter } from 'next/navigation';
import Image from "next/image"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item"

export default function ListBanners({
    banners
}: {
    banners: Banner[] | [],
}) {
    const router = useRouter();
    async function handleDelete(id: number) {
        await deleteBanner(id);
        router.refresh();
    }
    return (
        <div className="w-full py-2 grid gap-4">
            {banners.map(banner => (
                <Item key={banner.id} variant="outline">
                    <ItemHeader>
                        <Image
                            src={banner.image_url}
                            alt={`${banner.image_url} - ${banner.target_url}`}
                            width={1920}
                            height={200}
                            className="w-full h-[200px] rounded-sm object-cover"
                        />
                    </ItemHeader>
                    <ItemContent>
                        <ItemTitle>{banner.target_url}</ItemTitle>
                        <ItemDescription>
                            Horário: {banner.start_time ? `${banner.start_time} - ${banner.end_time}` : 'Sempre visível'}
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button onClick={() => handleDelete(banner.id)} variant="outline" size="sm">
                            Excluir
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </div>
    )
}
