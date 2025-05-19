import { Button, Form } from "react-bootstrap";
import "./Card.css"
import { useEffect, useState } from "react";
import CardService from "../service/CardService";
// import ListService from "../../service/ListService";
function Card({item,boardId,listId,properties})
{
    const [completed, setCompleted] = useState(false);
    const cardService = new CardService();
    useEffect(() => {
        setCompleted(item.complete);
    }, [item]);
    const completeCard = async (e) => {
        setCompleted(e.target.checked);
        const card = await cardService.setStatus({ boardId, listId, cardId: item.id, isComplete: e.target.checked });
        if (card.status && card.status == 200)
        {
            properties.completeCard(item.id,e.target.checked);
        }
    }
    return (
        <>
            <div className="cardItem">
                <div className="d-flex align-center justify-content-flex-start">
                    <Form>
                        <Form.Check isValid={true} type="checkbox" checked={item.complete} onChange={completeCard} className="checkBox"></Form.Check>
                    </Form>
                    <p className="mb-0 ms-2">{item.name}</p>
                </div>
                
            </div>
        </>
    )
}

export default Card;