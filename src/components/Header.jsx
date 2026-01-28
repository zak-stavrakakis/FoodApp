import logoPng from '../assets/logo.jpg';

export default function Header({itemsInChartNumber}) {
  return (
    <header id='main-header'>
      <div id='title'>
        <img src={logoPng} alt='logo' />
        <p>REACTFOOD</p>
      </div>
      <div>
        <button>Cart(3)</button>
      </div>
    </header>
  );
}
