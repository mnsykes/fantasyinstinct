import React from "react";

export default function Social(props) {

    return (
        <>
            <a href={bp.href} target="_blank">
                <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                >
                    <use href={bp.src}></use>
                </svg>
                {bp.btnText}
            </a>
        </>

    )
}