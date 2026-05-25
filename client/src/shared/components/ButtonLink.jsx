import React from "react";
import reactLogo from '../../assets/react.svg';
import viteLogo from "../../assets/vite.svg";

export default function ButtonLink(props) {
    const buttonProps = [
        {
            id: 1,
            href: "https://vite.dev/",
            src: viteLogo,
            alt: "Vite Logo",
            btnText: "Explore Vite"
        },
        {
            id: 2,
            href: "https://react.dev/",
            src: reactLogo,
            alt: "React Logo",
            btnText: "Learn More"
        }

    ]

    return (
        <ul>
            {buttonProps.map((bp) => {

                return (
                    <li key={bp.id}>
                        <a href={bp.href} target="_blank">
                            <img className="logo" src={bp.src} alt={bp.alt}/>
                            {bp.btnText}
                        </a>
                    </li>
                )
            })}
        </ul>

    )
}

