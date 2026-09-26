import { Head, Link } from '@inertiajs/react';

const MESSAGES: Record<number, [string, string]> = {
    403: ['Forbidden', 'You do not have access to this page.'],
    404: ['Page not found', 'The page you are looking for does not exist.'],
    500: ['Server error', 'Something went wrong on our side.'],
    503: ['Service unavailable', 'We are doing some maintenance. Please check back soon.'],
};

export default function ErrorPage({ status }: { status: number }) {
    const [title, text] = MESSAGES[status] ?? ['Error', 'Something went wrong.'];

    return (
        <div className="mx-auto max-w-md p-10 text-center">
            <Head title={title} />
            <p className="text-5xl font-bold">{status}</p>
            <h1 className="mt-2 text-xl font-semibold">{title}</h1>
            <p className="mt-2 text-gray-600">{text}</p>
            <Link href="/dashboard" className="mt-6 inline-block underline">Go to dashboard</Link>
        </div>
    );
}
