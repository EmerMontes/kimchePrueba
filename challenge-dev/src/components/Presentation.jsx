import  { useEffect, useState } from 'react';
import {Loader} from './Loader'

const Modal = () => {
  const [showModal, setShowModal] = useState(true);
  const [fadeOut, setFadeOut] = useState('presentation');

  useEffect(() => {
    setTimeout(()=>{
        setShowModal(false)
    }, 10000) 
    setTimeout(()=>{
      setFadeOut('presentationOut')
    }, 8000)
  }, []);

  return (
   <>
       {showModal && (<dialog className={fadeOut} open> 
           <h2>Hola <img className='saludos' src='/manito.gif' alt='saludos'/></h2>
           <div>
           <img className='logoKimche' src="/logo.png" alt="" />
           </div>
           <p>Soy Emerson Montes y estoy muy agradecido por la oportunidad de presentar 
             esta prueba. Espero que los resultados obtenidos sean de su agrado y pronto 
             poder formar parte de este grandioso equipo de trabajo. 
             Se muestra una aplicación con un diseño sencillo, código limpio y entendible,
             donde se logra cumplir con todo lo solicitado. Espero demostrar que cuento con 
             unas bases sólidas y toda la disposición para seguir aprendiendo.
           </p>
           <Loader/>
        </dialog>)
       }
    </>
  );
};

export default Modal;
