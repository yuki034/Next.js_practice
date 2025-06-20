import { Metadata } from 'next';
import { auth } from '@/auth';

export default async function Page() {
    const session = await auth();//現在のユーザーのセッション情報を取得
}

export const metadata:Metadata = {
    title: 'customer',
};