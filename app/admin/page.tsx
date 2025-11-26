import AddBanner from '@/components/admin/add-banner';
import ListBanners from '@/components/admin/list-banners';
import { getAllBanners } from '@/domain/banner/banner-service';

export default async function AdminPage() {
    const banners = await getAllBanners();
    return (
        <div className="h-screen flex flex-col items-center p-5 gap-5">
            <AddBanner />
            <ListBanners banners={banners || []} />
        </div>
    );
}
