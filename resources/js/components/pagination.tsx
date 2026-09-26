import { Link } from '@inertiajs/react';

// @ts-ignore
import type { Paginated } from '@/types/pagination';

export function Pagination({ page }: { page: Paginated<unknown> }) {
    if (page.last_page <= 1) return null;

    return (
        <div className="mt-6 flex items-center gap-4">
            {page.prev_page_url ? <Link href={page.prev_page_url} preserveScroll>Previous</Link> : <span className="text-gray-400">Previous</span>}
            <span>Page {page.current_page} of {page.last_page}</span>
            {page.next_page_url ? <Link href={page.next_page_url} preserveScroll>Next</Link> : <span className="text-gray-400">Next</span>}
        </div>
    );
}
