import {usePage} from "@inertiajs/react";

export function FlashMessage() {
    const {flash} = usePage();
    const {success, error} = flash as {success ?: string; error?: string};

    if (!success && !error) return null;

    return (
        <div role="status"
             className={`mb-4 rounded border p-3 ${error ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
            {error ?? success}
        </div>
    );
}
