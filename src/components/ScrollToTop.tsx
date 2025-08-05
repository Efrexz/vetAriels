import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop () {
    const { pathname } = useLocation();//cada vez que cambie de ruta, se reinicia el scroll

    useEffect(() => {
        window.scroll({ top: 0, left: 0, behavior: 'auto' }); // Reiniciar scroll
    }, [pathname]);

    return null; // No renderiza nada
}

export default ScrollToTop;