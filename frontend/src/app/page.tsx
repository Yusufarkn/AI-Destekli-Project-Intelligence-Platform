import { redirect } from 'next/navigation';

export default function Home() {
  // Ana sayfaya gelen kullanıcıyı doğrudan dashboard'a yönlendiriyoruz.
  redirect('/dashboard');
}
