import SplashCursor from './components/SplashCursor';
import GooeyNav from './components/GooeyNav';

function App() {
  const items = [
    { label: "Home", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <>
      <SplashCursor />
      <GooeyNav
        items={items}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        initialActiveIndex={0}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />
      <h1>Air Menu Website</h1>
    </>
  );
}

export default App;
