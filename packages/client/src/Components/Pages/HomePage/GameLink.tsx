import React from 'react';
import './GameLink.css';
import { Link } from "react-router-dom";

type GameLinkProps = {
    url: string;
    text: string;
    image: string;
}

export default function GameLink({ url, text, image }: GameLinkProps) {
    return (
        <Link className='gamelink' to={url} >
            <div style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, .9)),
                url(${image})`
            }}>
                <div className='gamelink-text'>
                    {text}
                </div>
            </div>
        </Link>
    )
}
