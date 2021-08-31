import Link from 'next/link';

export default function ApplicationRoot() {
  return (
    <div>
      <h1>Welcome to CloudsBuzz</h1>
      <Link href={'/app/employee/dashboard/'}>Open a static dashboard</Link>
    </div>
  );
}
