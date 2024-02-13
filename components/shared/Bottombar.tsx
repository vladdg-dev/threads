import NavLinks from "./NavLinks";

const Bottombar = () => {
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        <NavLinks
          className="bottombar_link"
          labelClassName="text-subtle-medium text-light-1 max-sm:hidden"
        />
      </div>
    </section>
  );
};

export default Bottombar;
