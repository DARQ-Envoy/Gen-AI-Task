import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to experiments page for better UX
  redirect('/experiments');
}