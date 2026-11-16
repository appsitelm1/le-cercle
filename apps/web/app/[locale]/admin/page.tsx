import { redirect } from 'next/navigation';

export default function AdminRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/dashboard/admin`);
}
