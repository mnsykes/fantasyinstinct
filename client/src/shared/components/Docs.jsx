import React from "react";
import ButtonLink from "./ButtonLink.jsx";

export default function Docs() {
    return (
        <div>
            <svg className="icon" role="presentation" aria-hidden="true">
                <use href="/icons.svg#documentation-icon"></use>
            </svg>
            <h2>Documentation</h2>
            <p>Your questions, answered</p>

            <ButtonLink />
        </div>
    )
}