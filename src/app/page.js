import { redirect } from 'next/navigation';
// import useTitle from '../Utils/useTitle';
import "./globals.css";

export default function HomePage() {
  // useTitle()
  redirect('/login');
}
