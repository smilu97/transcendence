import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div>
      <div>
        <h1>404</h1>
        <h2>PAGE NOT FOUND</h2>
        <p>
          {'The page you were looking for does not exist :('}
        </p>
        <Link to="/">
          <button>
            HOME
          </button>
        </Link>
      </div>
    </div>
  );
}
