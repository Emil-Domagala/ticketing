import Link from 'next/link';

type Props = {
  href: string;
  text: string;
};

const NavItem = ({ href, text }: Props) => {
  return (
    <Link href={href} className="text-md p-3 h-[100%] transition:background duration-300 hover:bg-stone-500/20">
      <span>{text}</span>
    </Link>
  );
};

export default NavItem;
