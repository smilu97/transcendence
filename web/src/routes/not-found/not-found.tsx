import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex bg-black text-white h-screen w-screen items-center justify-center">
      <div className="flex text-gray-300 w-[50em] h-[30em] bg-gray-900 rounded-xl items-center justify-center flex-col">
        <h1 className="text-9xl text-center text-teal-300 my-10">404</h1>
        <h2 className="text-4xl text-center">PAGE NOT FOUND</h2>
        <p className="text-xl text-center">
          {'The page you were looking for does not exist :('}
        </p>
        <Link to="/home">
          <button className="w-20 h-10 bg-slate-800 my-10 rounded-md transition-colors hover:bg-teal-300 hover:text-black">
            HOME
          </button>
        </Link>
      </div>
    </div>
  );
}
