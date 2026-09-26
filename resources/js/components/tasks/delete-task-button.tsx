import { router } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import tasks from '@/routes/tasks';

export function DeleteTaskButton({ id, title }: { id: number; title: string }) {
    const [processing, setProcessing] = useState(false);

    function destroy() {
        if (!window.confirm(`Delete "${title}"?`)) return;

        router.delete(tasks.destroy(id).url, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <Button type="button" variant="destructive" size="sm" disabled={processing} onClick={destroy}>
            {processing ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
