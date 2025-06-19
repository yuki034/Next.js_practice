import { Metadata } from 'next';

export default function Page() {
    return <p>Users Page
    ここはadminだけが閲覧可能なページです</p>;
}
export const metadata:Metadata = {
    title: 'customer',
};