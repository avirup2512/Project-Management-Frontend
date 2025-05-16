import { Button, Form } from "react-bootstrap";
import "./ListItem.css"
import { useState } from "react";
import ListService from "../../service/ListService";
function Card({item})
{

    return (
        <>
            <div className="card">
                {item.name}
            </div>
        </>
    )
}

export default Card;