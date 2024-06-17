export const Tag = ({ children, icon, href }: { children: React.ReactNode; icon?: React.ReactNode; href?: string }) => {
  if (href) {
    return (
      <a
        target="_blank"
        href={href}
        className="py-2 px-4 bg-base-2 text-primary rounded-[33px] font-semibold flex items-center gap-1 w-fit text-sm whitespace-nowrap"
      >
        {icon && icon}
        {children}
      </a>
    );
  }
  return (
    <div className="py-2 px-4 bg-base-2 text-primary rounded-[33px] font-semibold flex items-center gap-1 w-fit text-sm whitespace-nowrap">
      {icon && icon}
      {children}
    </div>
  );
};
