import '../assets/global.css';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import voltar from '../assets/frutiger/Aero Voltar.png';

function DASIC(): React.JSX.Element {


    return(
        <section className='containerS'>
            <Link to="/"><img className="bnt-voltar" src={voltar} alt="Botão de voltar" /></Link>

            
        </section>
    )
}

export default DASIC