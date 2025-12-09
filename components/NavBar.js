import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar() {
  const router = useRouter();
  const links = [
    { href: '/', label: 'Welcome' },
    { href: '/menu', label: 'Menu' },
    { href: '/account', label: 'Account' },
    { href: '/admin/menu', label: 'Menu Admin' },
  ];
  return (
    <nav>
      <strong style={{ color: '#ffdedb', letterSpacing: 1 }}>Volcanic Sushi & Sake</strong>
      {links.map((link) => (
        <Link key={link.href} href={link.href} legacyBehavior>
          <a className={router.pathname === link.href ? 'active' : ''}>{link.label}</a>
        </Link>
      ))}
    </nav>
  );
}
