import type { ReactNode } from 'react';

import { FlashMessage } from '@/components/flash-message';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

export function TasksLayout({ breadcrumbs, children }: { breadcrumbs: BreadcrumbItem[]; children: ReactNode }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto w-full max-w-5xl p-4">
                <FlashMessage />
                {children}
            </div>
        </AppLayout>
    );
}
