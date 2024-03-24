import { Link } from "react-router-dom";

const Content = () => {
  return (
    <>
      <div>Homepage</div>
      <section className="grid gap-2">
        <Link to={"user"}>Login</Link>
        <Link to={"chat"}>Chat</Link>
      </section>
    </>
  );
};

export default Content;
