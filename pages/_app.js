// pages/_app.js
import '../app/globals.css'; // Import global CSS

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;