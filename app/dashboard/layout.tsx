import SideNav from '@/app/ui/dashboard/sidenav';
//children は子要素（子ページ）を受け取るための引数。React.ReactNodeはReact上で描写可能な要素を表す型
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}